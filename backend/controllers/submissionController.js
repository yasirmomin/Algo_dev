const axios = require("axios");
const Submission = require("../models/Submission");
const Problem = require("../models/Problem");

const submitCode = async (req, res) => {
    const { language = "cpp", code, problemId } = req.body;

    if (!code || !language || !problemId) {
        return res.status(400).json({ message: "Code, language, and problemId are required." });
    }

    let lastOutput = "";

    try {
        const problem = await Problem.findById(problemId);
        if (!problem) {
            return res.status(404).json({ message: "Problem not found." });
        }

        const existingSubmission = await Submission.findOne({
            user: req.user.id,
            problem: problemId,
            code: code,
            createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
        });

        if (existingSubmission) {
            return res.status(400).json({
                message: "You have already submitted this exact code for this problem."
            });
        }

        if (!problem.testCases || problem.testCases.length === 0) {
            return res.status(400).json({
                message: "This problem has no test cases configured.",
            });
        }

        let verdict = "Accepted";

        for (let i = 0; i < problem.testCases.length; i++) {
            const testCase = problem.testCases[i];
            try {
                const response = await axios.post(`${process.env.VITE_COMPILER_URL}/run`, {
                    code,
                    language,
                    input: testCase.input,
                }, {
                    headers: {
                        Authorization: req.headers.authorization,
                    },
                });

                const output = response.data.output?.trim();
                lastOutput = output;

                const expectedOutput = testCase.output?.trim();

                if (output !== expectedOutput) {
                    verdict = `Wrong Answer on Test Case ${i + 1}`;
                    break;
                }
            }
            catch (err) {
                const errorText =
                    err.response?.data?.error ||
                    err.response?.data?.message ||
                    "Unknown Error";

                if (errorText.includes("Time Limit Exceeded")) {
                    verdict = `Time Limit Exceeded on Test Case ${i + 1}`;
                } else if (errorText.includes("Compilation Error")) {
                    verdict = "Compilation Error";
                } else if (errorText.includes("Runtime Error")) {
                    verdict = "Runtime Error";
                } else {
                    verdict = "Unknown Error";
                }

                lastOutput = errorText;
                break;
            }
        }

        const submission = new Submission({
            user: req.user.id,
            problem: problemId,
            code,
            language,
            verdict,
            output: lastOutput,
        });

        await submission.save();

        if (verdict === "Accepted") {
            const user = await require("../models/User").findById(req.user.id);
            if (!user.problemsSolved.includes(problemId)) {
                user.problemsSolved.push(problemId);
                await user.save();
            }
        }

        return res.json({
            success: true,
            verdict,
            submissionId: submission._id
        });
    } catch (error) {
        console.error("Error in submitCode:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


const getSubmissionById = async (req, res) => {
    try {
        const submission = await Submission.findById(req.params.submissionId).populate("problem");
        if (!submission) {
            return res.status(404).json({ message: "Submission not found." });
        }
        res.json({ submission });
    } catch (err) {
        res.status(500).json({ message: "Internal server error." });
    }
};


const getSubmissionsForProblem = async (req, res) => {
    try {
        const submissions = await Submission.find({
            problem: req.params.id,
            user: req.user.id
        }).sort({ createdAt: -1 });

        res.json({ submissions });
    } catch (err) {
        console.error("Error fetching submissions:", err);
        res.status(500).json({ message: "Internal server error." });
    }
};

const getAllMySubmissions = async (req, res) => {
    try {
        const submissions = await Submission.find({ user: req.user.id })
            .populate("problem", "title") // get problem title
            .sort({ createdAt: -1 });

        res.json({ submissions });
    } catch (err) {
        console.error("Error fetching my submissions:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { submitCode, getSubmissionById, getSubmissionsForProblem, getAllMySubmissions };

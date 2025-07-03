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

        if (!problem.testCases || problem.testCases.length === 0) {
            return res.status(400).json({
                message: "This problem has no test cases configured.",
            });
        }

        const testCases = problem.testCases;
        let verdict = "Accepted";


        for (let testCase of testCases) {
            try {
                const response = await axios.post("http://localhost:8000/run", {
                    code,
                    language,
                    input: testCase.input,
                },{
                    headers: {
                        Authorization: req.headers.authorization,
                    },
                });

                const output = response.data.output?.trim();
                lastOutput = output;

                const expectedOutput = testCase.output?.trim();

                if (output !== expectedOutput) {
                    verdict = "Wrong Answer";
                    break;
                }
            }
            catch (err) {

                let errorMessage = err.response?.data.message ||"Unknown Error";

                
                if (errorMessage.includes("Time Limit Exceeded")) {
                    verdict = "Time Limit Exceeded";
                } else if (errorMessage.includes("Compilation Error")) {
                    verdict = "Compilation Error";
                } else if (errorMessage.includes("Runtime Error")) {
                    verdict = "Runtime Error";
                } else {
                    verdict = "Compilation Error";
                }

                lastOutput = errorMessage;
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

        return res.json({
            success: true,
            verdict,
        });
    } catch (error) {
        console.error("Error in submitCode:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { submitCode };

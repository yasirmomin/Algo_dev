const Problem = require('../models/Problem');

const getAllProblems = async (req, res) => {
    try {
        const { difficulty, tags } = req.query;
        const filter = {};

        if (difficulty) {
            filter.difficulty = difficulty;
        }

        if (tags) {
            const tagsArray = tags.split(',').map((t) => t.trim());
            filter.tags = { $all: tagsArray };
        }
        const problems = await Problem.find(filter).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            message: "All problems fetched successfully",
            problems
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Internal server error while fetching problems",
            error: err.message
        });
    }
};

const addProblem = async (req, res) => {
    try {
        const { title, statement, difficulty, tags, testCases, constraints, solutions } = req.body;

        if (!title || !statement || !difficulty) {
            return res.status(400).json({ message: "Please fill all required fields" });
        }

        const newProblem = new Problem({
            title,
            statement,
            difficulty,
            tags: tags || [],
            testCases,
            constraints: req.body.constraints || [],
            solutions: req.body.solutions ||''
        });

        await newProblem.save();

        res.status(201).json({ message: "Problem added successfully", problem: newProblem });

    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error while adding problem",
            error: error.message
        });
    }
};

const updateProblem = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, statement, difficulty, tags, testCases, constraints ,solutions} = req.body;
        if (!title || !statement || !difficulty) {
            return res.status(400).json({ message: "Please fill all required fields" });
        }
        const updatedProblem = await Problem.findByIdAndUpdate(id, {
            title,
            statement,
            difficulty,
            tags: tags || [],
            testCases,
            constraints: req.body.constraints || [],
            solutions:req.body.solutions || ""
        }, { new: true });

        if (!updatedProblem) {
            return res.status(404).json({ message: "Problem not found" });
        }
        res.status(200).json({
            message: "Problem updated successfully",
            success: true,
            problem: updatedProblem
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error while updating problem",
            error: error.message
        });
    }
};

const deleteProblem = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProblem = await Problem.findByIdAndDelete(id);
        if (!deletedProblem) {
            return res.status(404).json({ message: "Problem not found" });
        }
        res.status(200).json({
            message: "Problem deleted successfully",
            success: true,
            problem: deletedProblem
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error while deleting problem",
            error: error.message
        });
    }
};

const getProblemById = async (req, res) => {
    try {
        const { id } = req.params;
        const problem = await Problem.findById(id);

        if (!problem) {
            return res.status(404).json({
                success: false,
                message: 'Problem not found'
            });
        }

        res.status(200).json({
            success: true,
            problem
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error while fetching problem',
            error: error.message
        });
    }
};

module.exports = { getAllProblems, addProblem, updateProblem, deleteProblem, getProblemById };
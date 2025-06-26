const express = require('express')
const router = express.Router()
const { loginCode, registerCode } = require('../controllers/authController');
const isAuthenticated = require('../middlewares/isAuthenticated');
const { getAllProblems, addProblem, updateProblem, deleteProblem, getProblemById } = require('../controllers/problemController');
const isAdmin = require('../middlewares/isAdmin');

router.post('/login', loginCode);

router.post('/register', registerCode);

router.get("/verify", isAuthenticated, (req, res) => {
    res.status(200).json({ message: "User is authenticated", user: req.user });
});

router.get("/problems", getAllProblems);

router.get('/problems/:id', isAuthenticated, isAdmin, getProblemById);

router.post("/problems", isAuthenticated, isAdmin, addProblem);

router.put("/problems/:id", isAuthenticated, isAdmin, updateProblem);

router.delete("/problems/:id", isAuthenticated, isAdmin, deleteProblem);

module.exports = router;
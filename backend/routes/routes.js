const express = require('express')
const router = express.Router()
const { loginCode, registerCode } = require('../controllers/authController');
const isAuthenticated = require('../middlewares/isAuthenticated');
const { getAllProblems, addProblem ,updateProblem, deleteProblem } = require('../controllers/problemController');

router.post('/login', loginCode);

router.post('/register', registerCode);

router.get("/verify", isAuthenticated, (req, res) => {
    res.status(200).json({ message: "User is authenticated", user: req.user });
});

router.get("/problems", getAllProblems);

router.post("/problems", isAuthenticated, addProblem);

router.put("/problems/:id", isAuthenticated, updateProblem);

router.delete("/problems/:id", isAuthenticated, deleteProblem);

module.exports = router;
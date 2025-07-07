const express = require('express')
const router = express.Router()
const { loginCode, registerCode } = require('../controllers/authController');
const isAuthenticated = require('../middlewares/isAuthenticated');
const { getAllProblems, addProblem, updateProblem, deleteProblem, getProblemById } = require('../controllers/problemController');
const isAdmin = require('../middlewares/isAdmin');
const { searchUsers, addFriend, getMyProfile, getUserById, getFriends, removeFriend } = require('../controllers/userController');
const { submitCode, getSubmissionsForProblem, getSubmissionById} = require('../controllers/submissionController');

router.post('/login', loginCode);

router.post('/register', registerCode);

router.get("/verify", isAuthenticated, (req, res) => {
    res.status(200).json({ message: "User is authenticated", user: req.user });
});

router.get("/problems", getAllProblems);

router.get('/problems/:id', getProblemById);

router.post("/problems", isAuthenticated, isAdmin, addProblem);

router.put("/problems/:id", isAuthenticated, isAdmin, updateProblem);

router.delete("/problems/:id", isAuthenticated, isAdmin, deleteProblem);


router.get("/user/search", isAuthenticated, searchUsers);

router.post('/user/add-friend/:id', isAuthenticated, addFriend);

router.get("/user/me", isAuthenticated, getMyProfile);

router.get("/user/friends", isAuthenticated, getFriends);

router.get("/user/:id", isAuthenticated, getUserById);

router.post("/user/remove-friend/:id", isAuthenticated, removeFriend);


router.post("/submit", isAuthenticated, submitCode);

router.get("/problems/:id/submissions", isAuthenticated, getSubmissionsForProblem);

router.get("/problems/:id/:submissionId", isAuthenticated, getSubmissionById);

module.exports = router;
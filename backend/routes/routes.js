const express = require('express')
const router = express.Router()
const { loginCode, registerCode } = require('../controllers/authController');
const isAuthenticated = require('../middlewares/isAuthenticated');
const { getAllProblems, addProblem, updateProblem, deleteProblem, getProblemById } = require('../controllers/problemController');
const isAdmin = require('../middlewares/isAdmin');
const { searchUsers, addFriend, getMyProfile, getUserById, getFriends, removeFriend, updateMyProfile } = require('../controllers/userController');
const { submitCode, getSubmissionsForProblem, getSubmissionById, getAllMySubmissions } = require('../controllers/submissionController');
const { getCodeFeedback, getCodeHint, getTimeComplexity } = require('../controllers/aiController');
const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 5,
    message: "Too many login attempts from this IP, please try again after 15 minutes.",
    standardHeaders: true,
    legacyHeaders: false,
});

const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 10,
    message: "Too many accounts created from this IP, please try again after an hour.",
});

const aiLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 20,
    message: "Too many AI requests from this IP. Please try again after an hour.",
    standardHeaders: true,
    legacyHeaders: false,
});

const submitLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: "Too many submissions in a short time. Please wait a minute and try again.",
  keyGenerator: (req) => `${req.user.id}-${req.body.problemId}`,
});

router.post('/login', loginLimiter, loginCode);

router.post('/register', registerLimiter, registerCode);

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

router.put("/user/me", isAuthenticated, updateMyProfile);

router.get("/user/friends", isAuthenticated, getFriends);

router.get("/user/:id", isAuthenticated, getUserById);

router.post("/user/remove-friend/:id", isAuthenticated, removeFriend);


router.post("/submit", isAuthenticated,submitLimiter, submitCode);

router.get("/problems/:id/submissions", isAuthenticated, getSubmissionsForProblem);

router.get("/problems/:id/:submissionId", isAuthenticated, getSubmissionById);

router.get("/my-submissions", isAuthenticated, getAllMySubmissions);


router.post("/ai/feedback", isAuthenticated, aiLimiter, getCodeFeedback);

router.post("/ai/hint", isAuthenticated, aiLimiter, getCodeHint);

router.post("/ai/complexity", isAuthenticated, aiLimiter, getTimeComplexity);

module.exports = router;
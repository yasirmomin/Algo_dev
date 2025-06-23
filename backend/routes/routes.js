const express = require('express')
const router = express.Router()
const { loginCode, registerCode } = require ('../controllers/authController');

router.post('/login', loginCode);

router.post('/register', registerCode);


module.exports = router;
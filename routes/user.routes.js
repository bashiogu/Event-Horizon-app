const express = require('express');
const { signUp, login, sendOtp, verifyOtp } = require('../controllers/user.controllers');
const { validateSignUp, validateLogin } = require('../validators/user.validators');


const router = express.Router();


router.post('/signup', validateSignUp, signUp);
router.post('/login', validateLogin, login);
router.post('/send-otp/:id', sendOtp);
router.post('/verify-otp', verifyOtp);


module.exports = router

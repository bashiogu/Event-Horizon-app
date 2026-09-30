const express = require('express');
const { signUp, login } = require('../controllers/user.controllers');
const { validateSignUp, validateLogin } = require('../validators/user.validators');


const router = express.Router();


router.post('/signup', validateSignUp, signUp);
router.post('/login', validateLogin, login);



module.exports = router

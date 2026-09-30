const express = require('express');
const { signUp, login } = require('../controllers/user.controllers');


const router = express.Router();


router.post('/signup', signUp);
router.post('/login', login);



module.exports = router

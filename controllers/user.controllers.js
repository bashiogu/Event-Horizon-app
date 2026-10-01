const User = require("../models/user.models");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();



const signUp = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists'});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
       
        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword
        });

        return res.status(201).json({ message: 'User created successfully', user: newUser});
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: 'Internal server error '});
    }
}



const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user){
            return res.status(400).json({ message: 'User not found' });
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect){
            return res.status(400).json({ message: 'Invalid password'});
        }
        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {expiresIn: "1h", });


        return res.status(200).json({ message: 'Login successful', user: user, token: token });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


const sendOtp = async (req, res) => {
    const id = req.params.id;
    try {
        const user = await User.findById(id);
        if(!user){
            return res.status(400).json({ message: 'User not found'});
        }
        const otp = Math.floor(100000 + Math.random() * 900000);
        const otpExpiresAt = Date.now() + 10 * 60 * 1000;
        user.otp = otp;
        user.otpExpiresAt = otpExpiresAt;
        await user.save();
        return res.status(201).json({ message: 'OTP sent successfully', otp: otp, otpExpiresAt: otpExpiresAt });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const verifyOtp = async (req, res) => {
    const { otp } = req.body;
    try {
        const user = await User.findOne({ otp: otp });
        if(!user){
            return res.status(400).json({ message: 'User not found' });
        }
        if(user.otp !== otp){
            return res.status(400).json({ message: 'Invalid OTP' });
        }
        if (user.otpExpiresAt < Date.now()){
            return res.status(400).json({ message: 'OTP expired' });
        }
        if(user.isVerified){
            return res.status(400).json({ message: 'Email already verified' });
        }

        user.isVerified = true,
        user.otp = null;
        user,otpExpiresAt = null;
        await user.save();
        return res.status(200).json({ message: 'Email successfully verified' });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: 'Internal server error' });
    }
};



module.exports = { signUp, login, sendOtp, verifyOtp };
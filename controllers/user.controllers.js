const User = require("../models/user.models");




const signUp = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    try {
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ message: 'All fields are required'});
        }
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists'});
        }
        const newUser = await User.create({ firstName, lastName, email, password });

        return res.status(201).json({ message: 'User created successfully', user: newUser});
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: 'Internal server error '});
    }
}




module.exports = signUp;
const User = require("../models/userModel")

exports.register = async (req, res) => {
    try {
        const { fullname, email } = req.body;

        const user = await User.findOne({ where: { email } });

        if (user) {
            return  res.status(401).json({
                message: `User with email ${email} already exists`
            })
        }
        const newUser = await User.create({
            fullname,
            email
        });

        res.status(201).json({
            message: "User registration successful",
            data: newUser
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            data: error.message
        });
    }
};

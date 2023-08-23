const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('../models/User')
const { sendOtp, verifyOtp } = require('../service/otp')

const register = async (req, res) => {
    try {
        const { name, phone_number, password } = req.body
        if (!name && !phone_number && !password) {
            return res.status(500).json({ msg: "bad request" })
        }
        const newUser = new User({
            name,
            phone_number,
            password
        })
        await newUser.save();
        const count = await User.countDocuments({})
        if (count == 1) {
            await User.findOneAndUpdate({ phone_number }, {
                isAdmin: true,
            })
        }
        // sendOtpfor verification *phone number should be with country code*
        await sendOtp(phone_number)
        res.status(201).json({ msg: "User registered successfully" });
    } catch (error) {
        res.status(500).json(error);
    }
}


const login = async (req, res) => {
    try {
        const { phone_number, password } = req.body
        if (!phone_number && !password) {
            return res.status(500).json({ msg: "bad request" })
        }
        //finding user with the provided username
        const user = await User.findOne({ phone_number });

        //if user does not exist
        if (!user) {
            return res.status(401).json("Wrong credentials");
        }
        //calling instance method to comparehashed password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json("Wrong credentials");
        }
        //if every thing is okay then send the user details except password
        const accestoken = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRY })
        const { name, verified, isAdmin, _id } = user._doc;
        res.status(201).json({ name, verified, isAdmin, accestoken, _id, phone_number });
    } catch (error) {
        res.status(500).json(error.message);
        console.log(error)
    }
}

const verifyTheOtp = async (req, res) => {
    try {
        const { phone_number, otp } = req.body
        if (!phone_number && !otp) {
            return res.status(400).json({ msg: "bad request" })
        }
        const status = await verifyOtp(phone_number, otp)
        if (status == 'approved') {
            await User.findOneAndUpdate({ phone_number }, { verified: true })
            return res.status(200).json({ msg: "otp is approved" })
        } else if (status == 'pending') {
            return res.status(500).json({ msg: "otp is pending" })
        } else if (status == 'canceled') {
            return res.status(500).json({ msg: "otp is expired" })
        }

    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
}
const verifyTheOtpForNewPassword = async (req, res) => {
    try {
        const { phone_number, otp } = req.body
        if (!phone_number && !otp) {
            return res.status(400).json({ msg: "bad request" })
        }
        const status = await verifyOtp(phone_number, otp)
        if (status == 'approved') {
            await User.findOneAndUpdate({ phone_number }, { verifiedToChangePass: true })
            return res.status(200).json({ msg: "otp is approved" })
        } else if (status == 'pending') {
            return res.status(500).json({ msg: "otp is pending" })
        } else if (status == 'canceled') {
            return res.status(500).json({ msg: "otp is expired" })
        }
    } catch (error) {
        console.log(error)
        res.status(400).json({ msg: error.message })
    }
}
const updatePassword = async (req, res) => {
    try {
        let { phone_number, password } = req.body
        if (!req.body && !phone_number) {
            return res.status(500).json({ msg: "bad request" })
        }
        const salt = await bcrypt.genSalt(10)
        //referencing the password from the above schema and hashing it using bcrypt library
        password = await bcrypt.hash(password, salt)
        const user = await User.findOneAndUpdate({ phone_number, verifiedToChangePass: true }, { password, verifiedToChangePass: false })
        if (!user) {
            return res.status(500).json({ msg: "not authenticated to change password" })
        }
        res.status(201).json({ msg: "password changed succesfully" })
    } catch (error) {
        res.status(500).json(error.message)
    }
}
const resendOtp = async (req, res) => {
    try {
        const { phone_number } = req.body
        if (!phone_number) {
            return res.status(500).json({ msg: "bad request" })
        }
        await sendOtp(phone_number)
        res.status(201).json({ msg: "otp sent" })
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}
module.exports = {
    login,
    register,
    verifyTheOtp,
    resendOtp,
    verifyTheOtpForNewPassword,
    updatePassword
}

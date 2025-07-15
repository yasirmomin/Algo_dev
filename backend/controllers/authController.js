const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const isAdmin = require('../middlewares/isAdmin');

const loginCode = async (req, res) => {
    try {
        const { email, password } = req.body;
        const errors = [];
        if (!email) errors.push("email");
        if (!password) errors.push("password");
        if (errors.length > 0) {
            return res.status(400).json({ message: `Please provide ${errors.join(" and ")}` });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User does not exists with the given email" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Incorrect password" });
        }

        const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin, }, process.env.SECRET_KEY, { expiresIn: '8h' });

        const userResponse = {
            _id: user._id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            createdAt: user.createdAt,
            phone: user.phone,
            isAdmin: user.isAdmin,
            rating: user.rating,
            friends: user.friends,
            contestsGiven: user.contestsGiven,
            problemsSolved: user.problemsSolved,
        };


        res.status(200).json({
            success: true,
            message: "Login successful",
            token: token,
            user: userResponse
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            success: false,
            message: "Internal server error during login"
        });
    }
};

const registerCode = async (req, res) => {
    try {
        const { firstName, lastName, username, email, password, phone } = req.body;

        const existingUserByUsername = await User.findOne({ username });
        if (existingUserByUsername) {
            return res.status(400).json({ message: "Username already taken" });
        }

        if (!username) {
            return res.status(400).json({ message: "Username is required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send({ message: `User already exists with the given email` });
        }
        const existingUser1 = await User.findOne({ phone });
        if (existingUser1) {
            return res.status(400).send({ message: `User already exists with the given phone no.` });
        }
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ message: 'Please enter all fields' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        if (phone && !/^\d{10}$/.test(phone)) {
            return res.status(400).json({ message: "Please check your phone no." });
        }

        const errors = [];

        if (password.length < 8) errors.push("at least 8 characters");
        if (!/[A-Z]/.test(password)) errors.push("one uppercase letter");
        if (!/[a-z]/.test(password)) errors.push("one lowercase letter");
        if (!/\d/.test(password)) errors.push("one digit");
        if (!/[\W_]/.test(password)) errors.push("one special character");

        if (errors.length > 0) {
            return res.status(400).json({
                message: `Password must include: ${errors.join(", ")}.`
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = new User({
            firstName,
            lastName,
            username,
            email,
            password: hashedPassword,
            phone
        });

        await user.save();

        res.status(201).json({
            success: true,
            message: "User registered successfully", user
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            message: "Server error. Please try again later."
        });
    }
};

module.exports = { loginCode, registerCode };
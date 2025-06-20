const express = require('express');
const app = express();
const { DBConnection } = require('./databse/db');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const jwt = require("jsonwebtoken");

app.use(cors({
    origin: true,
    credentials: true
}));

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
DBConnection();
app.get("/", (req, res) => {
    res.send("Hello, World!");
});

app.post("/register", async (req, res) => {
    try {
        const { firstName, lastName, email, password, phone } = req.body;

        // check if the user already exists  (we need database)
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

        // validations
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

        // hashing/encrypt the password
        const hashedPassword = await bcrypt.hash(password, 10)

        // create a new user
        const user = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            phone
        });

        // save the user to the database
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
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        // Basic validation
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

        // generate and send the JWT token
        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' });

        const userResponse = {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            createdAt: user.createdAt
        };

        res.status(200).json({
            success: true,
            message: "Login successful",
            token:token,
            user: userResponse
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            success: false,
            message: "Internal server error during login"
        });
    }
});
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});


const express = require('express');
const app = express();
const { DBConnection } = require('./databse/db');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const cors = require('cors');

app.use(cors());

DBConnection();
// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
    res.send("Hello, World!");
});

app.post("/register", async (req, res) => {
    try {
        const { firstName, lastName, email, password, phone } = req.body;

        // check if the user already exists  (we need database)
        const existingUser = await User.findOne({ email});
        if (existingUser) {
            return res.status(400).send({message:`User already exists with the given email`});   
        }
        const existingUser1 = await User.findOne({ phone});
        if (existingUser1) {
            return res.status(400).send({message:`User already exists with the given phone no.`});   
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

        res.status(201).json({ message: "User registered successfully", user });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
});
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});


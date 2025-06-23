const express = require('express');
const app = express();
const { DBConnection } = require('./databse/db');
const cors = require('cors');
const router  = require('./routes/routes');
const dotenv = require('dotenv');
dotenv.config();

app.use(cors({
    origin: true,
    credentials: true
}));

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
DBConnection();

// routes
app.use("/",router);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});


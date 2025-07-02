const mongoose = require('mongoose');

const DBConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Failed to connect to MongoDB', error.message);
    }
}

module.exports = {DBConnection};

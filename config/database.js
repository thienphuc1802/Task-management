const mongoose = require("mongoose");
require('dotenv').config();
module.exports.connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Connected to MongoDB');
    }
    catch (err) {
        console.log('Failed to connect to MongoDB');
    }
}
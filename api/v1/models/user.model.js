const mongoose = require('mongoose');
const genearate = require('../../helpers/generate');

const userSchema = new mongoose.Schema(
    {
        fullname: String,
        email: String,
        password: String,
        token: String,
        deleted: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model('User', userSchema, 'users');
module.exports = User;
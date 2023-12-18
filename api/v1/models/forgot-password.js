const mongoose = require('mongoose');

const forgotPasswordSchema = new mongoose.Schema(
    {
        email: String,
        otp: String,
        expired: { type: Boolean, expires: 0 },
    },
    {
        timestamps: true,
    }
);
const ForgotPassword = mongoose.model('ForgotPassword', forgotPasswordSchema, 'forgot-passwords');
module.exports = ForgotPassword; 
const User = require('../models/user.model');
const md5 = require('md5');
const generate = require('../../helpers/generate');
const ForgotPassword = require('../models/forgot-password');
const sendMailHelper = require('../../helpers/sendMail');
//Register
module.exports.register = async (req, res) => {
    try {
        const existEmail = await User.findOne({ email: req.body.email, deleted: false });
        if (existEmail) {
            res.json({
                code: 400,
                message: "Email da ton tai"
            });
            return;
        }
        const infoUser = {
            fullname: req.body.fullname,
            email: req.body.email,
            password: md5(req.body.password),
            token: generate.generateRandomString(20),
        };

        const user = new User(infoUser);
        console.log(infoUser);
        const data = await user.save();
        res.cookie("token", data.token);
        res.json({
            code: 200,
            message: "Tao moi thanh cong",
            token: data.token
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Tao moi that bai"
        });
    }
}

//Login
module.exports.login = async (req, res) => {
    const email = req.body.email;
    const password = md5(req.body.password);

    const user = await User.findOne({
        email: email,
        deleted: false,
    });

    if (!user) {
        res.json({
            code: 400,
            message: "Email khong ton tai"
        });
        return;
    }
    if (password !== user.password) {
        res.json({
            code: 400,
            message: "Sai Mat Khau"
        });
        return;
    }
    res.cookie("token", user.token);
    res.json({
        code: 200,
        message: "Dang nhap thanh cong",
        token: user.token
    });
}

//Forgot Password
module.exports.forgotPassword = async (req, res) => {
    const email = req.body.email;
    const user = await User.findOne({
        email: email,
        deleted: false,
    });
    if (!user) {
        res.json({
            code: 400,
            message: "Email khong ton tai"
        });
        return;
    }
    const otp = generate.generateRandomNumber(6);
    const timeExpired = 5;

    const objectForgotPassword = {
        email: email,
        otp: otp,
        timeExpired: Date.now() + timeExpired * 60 * 1000,
    };

    const forgotPassword = new ForgotPassword(objectForgotPassword);
    await forgotPassword.save();
    const subject = "Mã OTP xác minh lấy lại mật khẩu";
    const html = `Mã OTP để lấy lại mật khẩu của bạn là: <b>${otp}</b> (sử dụng trong ${timeExpired} phút ). Vui lòng không chia sẻ mã OTP này với bất kì ai `
    sendMailHelper.sendMail(email, subject, html);
    res.json({
        code: 200,
        message: "Gui thanh cong",

    });
}

//OTP Password
module.exports.otpPassword = async (req, res) => {
    const email = req.body.email;
    const otp = req.body.otp;


    const forgotPassword = await ForgotPassword.findOne({
        email: email,
        otp: otp,
    });
    if (!forgotPassword) {
        res.json({
            code: 400,
            message: "OTP khong hop le"
        });
        return;
    }
    const user = await User.findOne({
        email: email,
        deleted: false,
    });
    res.cookie("token", user.token);
    res.json({
        code: 200,
        message: "Xac thuc thanh cong",
        token: user.token
    });
}

//Reset Password
module.exports.resetPassword = async (req, res) => {
    const token = req.body.token;
    console.log(req.body.password);
    password = md5(req.body.password);
    const user = await User.findOne({
        token: token,
        deleted: false,
    });

    if (!user) {
        res.json({
            code: 400,
            message: "User khong ton tai"
        });
        return;
    }

    if (password === user.password) {
        res.json({
            code: 400,
            message: "Vui long nhap mat khau khac mat khau cu"
        });
        return;
    }

    await User.updateOne({ token: token }, { password: password });

    res.json({
        code: 200,
        message: "Doi mat khau thanh cong",
    });
}

//Detail
module.exports.detail = async (req, res) => {
    try {

        res.json({
            code: 200,
            message: "Thanh cong",
            data: req.user
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Loi server"
        });
    }
}

//List
module.exports.list = async (req, res) => {
    const users = await User.find({ deleted: false }).select('fullname email');
    res.json({
        code: 200,
        message: "Thanh cong",
        data: users
    });
}


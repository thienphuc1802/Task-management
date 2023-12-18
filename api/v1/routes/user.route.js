const express = require("express");
const Router = express.Router();
const controller = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");

Router.post('/register', controller.register);

Router.post('/login', controller.login);

Router.post('/password/forgot', controller.forgotPassword);

Router.post('/password/otp', controller.otpPassword);

Router.post('/password/reset', controller.resetPassword);

Router.get('/detail', authMiddleware.requireAuth, controller.detail);

Router.get('/list', authMiddleware.requireAuth, controller.list);

module.exports = Router;
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.login = void 0;
const http_status_codes_1 = require("http-status-codes");
const asyncWrapper_1 = __importDefault(require("../middlewares/asyncWrapper"));
const badRequest_1 = __importDefault(require("../errors/badRequest"));
const notFound_1 = __importDefault(require("../errors/notFound"));
const users_1 = __importDefault(require("../models/users"));
exports.login = (0, asyncWrapper_1.default)(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        throw new badRequest_1.default("Please provide valid credentials");
    const user = await users_1.default.findOne({ email });
    if (!user)
        throw new notFound_1.default("Email or password is incorrect");
    const isPasswordCorrect = await user.comparePasswords(password);
    if (!isPasswordCorrect)
        throw new badRequest_1.default("Email or password is incorrect");
    if (!user.verified)
        throw new badRequest_1.default("You need to verify your email first");
    const token = user.createJWT();
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "Logged in successfully", token });
});
exports.forgotPassword = (0, asyncWrapper_1.default)((req, res) => {
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "Password reset link was sent to email" });
});
exports.resetPassword = (0, asyncWrapper_1.default)((req, res) => {
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "Password was reset successfully" });
});

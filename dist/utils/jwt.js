"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendTokenResponse = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const generateToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, env_1.env.jwt.secret, {
        expiresIn: env_1.env.jwt.expiresIn,
    });
};
exports.generateToken = generateToken;
const sendTokenResponse = (res, token, statusCode, data = {}) => {
    const cookieOptions = {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: env_1.env.isProd,
        sameSite: 'lax',
    };
    res
        .status(statusCode)
        .cookie('token', token, cookieOptions)
        .json({ success: true, token, ...data });
};
exports.sendTokenResponse = sendTokenResponse;
//# sourceMappingURL=jwt.js.map
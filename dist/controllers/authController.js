"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.logout = exports.getMe = exports.login = exports.register = exports.loginValidation = exports.registerValidation = void 0;
const express_validator_1 = require("express-validator");
const User_1 = require("../models/User");
const validate_1 = require("../middleware/validate");
const errorHandler_1 = require("../middleware/errorHandler");
const jwt_1 = require("../utils/jwt");
exports.registerValidation = [
    (0, express_validator_1.body)('name').trim().notEmpty().withMessage('Name is required'),
    (0, express_validator_1.body)('email').isEmail().withMessage('Valid email is required'),
    (0, express_validator_1.body)('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];
exports.loginValidation = [
    (0, express_validator_1.body)('email').isEmail().withMessage('Valid email is required'),
    (0, express_validator_1.body)('password').notEmpty().withMessage('Password is required'),
];
/** Register a new guest account */
exports.register = (0, validate_1.asyncHandler)(async (req, res) => {
    const { name, email, password, phone } = req.body;
    const existingUser = await User_1.User.findOne({ email });
    if (existingUser) {
        throw (0, errorHandler_1.createError)('Email already registered', 400);
    }
    const user = await User_1.User.create({ name, email, password, phone });
    const token = (0, jwt_1.generateToken)({ id: user._id.toString(), role: user.role });
    (0, jwt_1.sendTokenResponse)(res, token, 201, {
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    });
});
/** Login with email and password */
exports.login = (0, validate_1.asyncHandler)(async (req, res) => {
    const { email, password } = req.body;
    const user = await User_1.User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
        throw (0, errorHandler_1.createError)('Invalid email or password', 401);
    }
    if (!user.isActive) {
        throw (0, errorHandler_1.createError)('Account is deactivated', 403);
    }
    const token = (0, jwt_1.generateToken)({ id: user._id.toString(), role: user.role });
    (0, jwt_1.sendTokenResponse)(res, token, 200, {
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    });
});
/** Get current authenticated user */
exports.getMe = (0, validate_1.asyncHandler)(async (req, res) => {
    const user = req.user;
    res.json({
        success: true,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            avatar: user.avatar,
        },
    });
});
/** Logout — clear auth cookie */
exports.logout = (0, validate_1.asyncHandler)(async (_req, res) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 1000),
        httpOnly: true,
    });
    res.json({ success: true, message: 'Logged out successfully' });
});
/** Update user profile */
exports.updateProfile = (0, validate_1.asyncHandler)(async (req, res) => {
    const { name, phone } = req.body;
    const user = await User_1.User.findByIdAndUpdate(req.user._id, { name, phone }, { new: true, runValidators: true });
    res.json({
        success: true,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
        },
    });
});
//# sourceMappingURL=authController.js.map
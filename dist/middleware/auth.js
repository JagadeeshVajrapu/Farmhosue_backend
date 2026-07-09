"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = exports.authorize = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const User_1 = require("../models/User");
/**
 * Protect routes — requires valid JWT
 */
const protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization?.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
        }
        else if (req.cookies?.token) {
            token = req.cookies.token;
        }
        if (!token) {
            res.status(401).json({ success: false, message: 'Not authorized, no token' });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, env_1.env.jwt.secret);
        const user = await User_1.User.findById(decoded.id);
        if (!user || !user.isActive) {
            res.status(401).json({ success: false, message: 'Not authorized' });
            return;
        }
        req.user = user;
        next();
    }
    catch {
        res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
};
exports.protect = protect;
/**
 * Role-based access control
 */
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            res.status(403).json({
                success: false,
                message: `Role '${req.user?.role}' is not authorized`,
            });
            return;
        }
        next();
    };
};
exports.authorize = authorize;
/**
 * Optional auth — attaches user if token present
 */
const optionalAuth = async (req, _res, next) => {
    try {
        let token;
        if (req.headers.authorization?.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (token) {
            const decoded = jsonwebtoken_1.default.verify(token, env_1.env.jwt.secret);
            req.user = (await User_1.User.findById(decoded.id)) ?? undefined;
        }
    }
    catch {
        // Silently continue without user
    }
    next();
};
exports.optionalAuth = optionalAuth;
//# sourceMappingURL=auth.js.map
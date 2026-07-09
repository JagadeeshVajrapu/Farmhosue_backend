import { Response } from 'express';
import { body } from 'express-validator';
import { User } from '../models/User';
import { AuthRequest } from '../types';
import { asyncHandler } from '../middleware/validate';
import { createError } from '../middleware/errorHandler';
import { generateToken, sendTokenResponse } from '../utils/jwt';

export const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

export const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

/** Register a new guest account */
export const register = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { name, email, password, phone } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createError('Email already registered', 400);
  }

  const user = await User.create({ name, email, password, phone });

  const token = generateToken({ id: user._id.toString(), role: user.role });

  sendTokenResponse(res, token, 201, {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

/** Login with email and password */
export const login = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw createError('Invalid email or password', 401);
  }

  if (!user.isActive) {
    throw createError('Account is deactivated', 403);
  }

  const token = generateToken({ id: user._id.toString(), role: user.role });

  sendTokenResponse(res, token, 200, {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

/** Get current authenticated user */
export const getMe = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = req.user!;
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
export const logout = asyncHandler(async (_req: AuthRequest, res: Response) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 1000),
    httpOnly: true,
  });
  res.json({ success: true, message: 'Logged out successfully' });
});

/** Update user profile */
export const updateProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { name, phone } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user!._id,
    { name, phone },
    { new: true, runValidators: true }
  );

  res.json({
    success: true,
    user: {
      id: user!._id,
      name: user!.name,
      email: user!.email,
      phone: user!.phone,
      role: user!.role,
    },
  });
});

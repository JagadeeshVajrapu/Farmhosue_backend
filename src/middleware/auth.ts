import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { User } from '../models/User';
import { AuthRequest, JwtPayload, UserRole } from '../types';

/**
 * Protect routes — requires valid JWT
 */
export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      res.status(401).json({ success: false, message: 'Not authorized, no token' });
      return;
    }

    const decoded = jwt.verify(token, env.jwt.secret) as JwtPayload;
    const user = await User.findById(decoded.id);

    if (!user || !user.isActive) {
      res.status(401).json({ success: false, message: 'Not authorized' });
      return;
    }

    req.user = user;
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Not authorized, token failed' });
  }
};

/**
 * Role-based access control
 */
export const authorize = (...roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
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

/**
 * Optional auth — attaches user if token present
 */
export const optionalAuth = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      const decoded = jwt.verify(token, env.jwt.secret) as JwtPayload;
      req.user = (await User.findById(decoded.id)) ?? undefined;
    }
  } catch {
    // Silently continue without user
  }
  next();
};

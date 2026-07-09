import { Response, NextFunction } from 'express';
import { AuthRequest, UserRole } from '../types';
/**
 * Protect routes — requires valid JWT
 */
export declare const protect: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * Role-based access control
 */
export declare const authorize: (...roles: UserRole[]) => (req: AuthRequest, res: Response, next: NextFunction) => void;
/**
 * Optional auth — attaches user if token present
 */
export declare const optionalAuth: (req: AuthRequest, _res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=auth.d.ts.map
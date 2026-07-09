import { Response } from 'express';
import { JwtPayload } from '../types';
export declare const generateToken: (payload: JwtPayload) => string;
export declare const sendTokenResponse: (res: Response, token: string, statusCode: number, data?: Record<string, unknown>) => void;
//# sourceMappingURL=jwt.d.ts.map
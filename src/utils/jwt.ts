import jwt from 'jsonwebtoken';
import { Response } from 'express';
import { env } from '../config/env';
import { JwtPayload } from '../types';

export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, env.jwt.secret, {
    expiresIn: env.jwt.expiresIn,
  } as jwt.SignOptions);
};

export const sendTokenResponse = (
  res: Response,
  token: string,
  statusCode: number,
  data: Record<string, unknown> = {}
): void => {
  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: env.isProd,
    sameSite: 'lax' as const,
  };

  res
    .status(statusCode)
    .cookie('token', token, cookieOptions)
    .json({ success: true, token, ...data });
};

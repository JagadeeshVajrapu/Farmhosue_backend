import { Request, Response, NextFunction } from 'express';
import { isDbConnected } from '../config/database';
import { env } from '../config/env';
import { createError } from './errorHandler';

/** Block routes that need MongoDB when the database is disabled or disconnected */
export function requireDatabase(_req: Request, _res: Response, next: NextFunction): void {
  if (!env.mongodb.enabled) {
    return next(
      createError('Database is disabled. Enquiry submissions are handled by email only.', 503)
    );
  }

  if (!isDbConnected()) {
    return next(createError('Database is unavailable. Please try again later.', 503));
  }

  next();
}

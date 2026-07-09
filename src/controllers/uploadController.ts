import { Response } from 'express';
import { AuthRequest } from '../types';
import { asyncHandler } from '../middleware/validate';
import { createError } from '../middleware/errorHandler';

/** Handle Cloudinary file upload */
export const uploadImage = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.file) {
    throw createError('No file uploaded', 400);
  }

  const file = req.file as Express.Multer.File & { path?: string; filename?: string };

  res.json({
    success: true,
    data: {
      url: file.path,
      publicId: file.filename,
    },
  });
});

/** Handle multiple image uploads */
export const uploadImages = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
    throw createError('No files uploaded', 400);
  }

  const images = req.files.map((file) => {
    const f = file as Express.Multer.File & { path?: string; filename?: string };
    return { url: f.path, publicId: f.filename };
  });

  res.json({ success: true, data: images });
});

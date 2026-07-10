import { Response } from 'express';
import { AuthRequest } from '../types';
import { asyncHandler } from '../middleware/validate';
import { createError } from '../middleware/errorHandler';
import { uploadImageBuffer } from '../config/cloudinary';

/** Handle Cloudinary file upload */
export const uploadImage = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.file?.buffer) {
    throw createError('No file uploaded', 400);
  }

  const data = await uploadImageBuffer(req.file.buffer);

  res.json({
    success: true,
    data,
  });
});

/** Handle multiple image uploads */
export const uploadImages = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
    throw createError('No files uploaded', 400);
  }

  const images = await Promise.all(
    req.files.map((file) => {
      if (!file.buffer) {
        throw createError('Invalid file upload', 400);
      }
      return uploadImageBuffer(file.buffer);
    })
  );

  res.json({ success: true, data: images });
});

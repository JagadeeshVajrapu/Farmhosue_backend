import { Request, Response } from 'express';
import { body } from 'express-validator';
import { Property } from '../models/Property';
import { AuthRequest } from '../types';
import { asyncHandler } from '../middleware/validate';
import { createError } from '../middleware/errorHandler';

export const propertyValidation = [
  body('name').trim().notEmpty(),
  body('slug').trim().notEmpty(),
  body('description').trim().notEmpty(),
  body('shortDescription').trim().notEmpty(),
  body('type').isIn(['villa', 'cottage', 'suite', 'farmhouse']),
  body('pricePerNight').isFloat({ min: 0 }),
  body('maxGuests').isInt({ min: 1 }),
  body('bedrooms').isInt({ min: 1 }),
  body('bathrooms').isInt({ min: 1 }),
  body('size').isFloat({ min: 0 }),
];

/** Get all properties with optional filters */
export const getProperties = asyncHandler(async (req: Request, res: Response) => {
  const { featured, type, minPrice, maxPrice, guests } = req.query;

  const filter: Record<string, unknown> = { isAvailable: true };

  if (featured === 'true') filter.featured = true;
  if (type) filter.type = type;
  if (minPrice || maxPrice) {
    filter.pricePerNight = {};
    if (minPrice) (filter.pricePerNight as Record<string, number>).$gte = Number(minPrice);
    if (maxPrice) (filter.pricePerNight as Record<string, number>).$lte = Number(maxPrice);
  }
  if (guests) filter.maxGuests = { $gte: Number(guests) };

  const properties = await Property.find(filter).sort({ featured: -1, createdAt: -1 });

  res.json({ success: true, count: properties.length, data: properties });
});

/** Get single property by slug */
export const getPropertyBySlug = asyncHandler(async (req: Request, res: Response) => {
  const property = await Property.findOne({ slug: req.params.slug });

  if (!property) {
    throw createError('Property not found', 404);
  }

  res.json({ success: true, data: property });
});

/** Create property (admin only) */
export const createProperty = asyncHandler(async (req: AuthRequest, res: Response) => {
  const property = await Property.create(req.body);
  res.status(201).json({ success: true, data: property });
});

/** Update property (admin only) */
export const updateProperty = asyncHandler(async (req: AuthRequest, res: Response) => {
  const property = await Property.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!property) {
    throw createError('Property not found', 404);
  }

  res.json({ success: true, data: property });
});

/** Delete property (admin only) */
export const deleteProperty = asyncHandler(async (req: AuthRequest, res: Response) => {
  const property = await Property.findByIdAndDelete(req.params.id);

  if (!property) {
    throw createError('Property not found', 404);
  }

  res.json({ success: true, message: 'Property deleted' });
});

/** Get featured properties for homepage */
export const getFeaturedProperties = asyncHandler(async (_req: Request, res: Response) => {
  const properties = await Property.find({ featured: true, isAvailable: true }).limit(6);
  res.json({ success: true, data: properties });
});

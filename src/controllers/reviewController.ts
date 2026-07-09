import { Request, Response } from 'express';
import { body } from 'express-validator';
import { Review } from '../models/Review';
import { AuthRequest } from '../types';
import { asyncHandler } from '../middleware/validate';
import { createError } from '../middleware/errorHandler';

export const reviewValidation = [
  body('propertyId').notEmpty(),
  body('rating').isInt({ min: 1, max: 5 }),
  body('comment').trim().notEmpty().isLength({ min: 10 }),
];

/** Get approved reviews for a property */
export const getPropertyReviews = asyncHandler(async (req: Request, res: Response) => {
  const reviews = await Review.find({
    property: req.params.propertyId,
    isApproved: true,
  })
    .populate('user', 'name avatar')
    .sort({ createdAt: -1 });

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  res.json({
    success: true,
    count: reviews.length,
    avgRating: Math.round(avgRating * 10) / 10,
    data: reviews,
  });
});

/** Create a review */
export const createReview = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { propertyId, rating, comment } = req.body;

  const existing = await Review.findOne({
    user: req.user!._id,
    property: propertyId,
  });

  if (existing) {
    throw createError('You have already reviewed this property', 400);
  }

  const review = await Review.create({
    user: req.user!._id,
    property: propertyId,
    rating,
    comment,
  });

  await review.populate('user', 'name avatar');

  res.status(201).json({ success: true, data: review });
});

/** Approve review (admin) */
export const approveReview = asyncHandler(async (req: AuthRequest, res: Response) => {
  const review = await Review.findByIdAndUpdate(
    req.params.id,
    { isApproved: true },
    { new: true }
  );

  if (!review) {
    throw createError('Review not found', 404);
  }

  res.json({ success: true, data: review });
});

/** Get pending reviews (admin) */
export const getPendingReviews = asyncHandler(async (_req: AuthRequest, res: Response) => {
  const reviews = await Review.find({ isApproved: false })
    .populate('user', 'name')
    .populate('property', 'name')
    .sort({ createdAt: -1 });

  res.json({ success: true, data: reviews });
});

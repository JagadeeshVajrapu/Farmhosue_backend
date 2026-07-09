"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPendingReviews = exports.approveReview = exports.createReview = exports.getPropertyReviews = exports.reviewValidation = void 0;
const express_validator_1 = require("express-validator");
const Review_1 = require("../models/Review");
const validate_1 = require("../middleware/validate");
const errorHandler_1 = require("../middleware/errorHandler");
exports.reviewValidation = [
    (0, express_validator_1.body)('propertyId').notEmpty(),
    (0, express_validator_1.body)('rating').isInt({ min: 1, max: 5 }),
    (0, express_validator_1.body)('comment').trim().notEmpty().isLength({ min: 10 }),
];
/** Get approved reviews for a property */
exports.getPropertyReviews = (0, validate_1.asyncHandler)(async (req, res) => {
    const reviews = await Review_1.Review.find({
        property: req.params.propertyId,
        isApproved: true,
    })
        .populate('user', 'name avatar')
        .sort({ createdAt: -1 });
    const avgRating = reviews.length > 0
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
exports.createReview = (0, validate_1.asyncHandler)(async (req, res) => {
    const { propertyId, rating, comment } = req.body;
    const existing = await Review_1.Review.findOne({
        user: req.user._id,
        property: propertyId,
    });
    if (existing) {
        throw (0, errorHandler_1.createError)('You have already reviewed this property', 400);
    }
    const review = await Review_1.Review.create({
        user: req.user._id,
        property: propertyId,
        rating,
        comment,
    });
    await review.populate('user', 'name avatar');
    res.status(201).json({ success: true, data: review });
});
/** Approve review (admin) */
exports.approveReview = (0, validate_1.asyncHandler)(async (req, res) => {
    const review = await Review_1.Review.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
    if (!review) {
        throw (0, errorHandler_1.createError)('Review not found', 404);
    }
    res.json({ success: true, data: review });
});
/** Get pending reviews (admin) */
exports.getPendingReviews = (0, validate_1.asyncHandler)(async (_req, res) => {
    const reviews = await Review_1.Review.find({ isApproved: false })
        .populate('user', 'name')
        .populate('property', 'name')
        .sort({ createdAt: -1 });
    res.json({ success: true, data: reviews });
});
//# sourceMappingURL=reviewController.js.map
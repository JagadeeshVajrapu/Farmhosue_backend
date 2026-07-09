"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFeaturedProperties = exports.deleteProperty = exports.updateProperty = exports.createProperty = exports.getPropertyBySlug = exports.getProperties = exports.propertyValidation = void 0;
const express_validator_1 = require("express-validator");
const Property_1 = require("../models/Property");
const validate_1 = require("../middleware/validate");
const errorHandler_1 = require("../middleware/errorHandler");
exports.propertyValidation = [
    (0, express_validator_1.body)('name').trim().notEmpty(),
    (0, express_validator_1.body)('slug').trim().notEmpty(),
    (0, express_validator_1.body)('description').trim().notEmpty(),
    (0, express_validator_1.body)('shortDescription').trim().notEmpty(),
    (0, express_validator_1.body)('type').isIn(['villa', 'cottage', 'suite', 'farmhouse']),
    (0, express_validator_1.body)('pricePerNight').isFloat({ min: 0 }),
    (0, express_validator_1.body)('maxGuests').isInt({ min: 1 }),
    (0, express_validator_1.body)('bedrooms').isInt({ min: 1 }),
    (0, express_validator_1.body)('bathrooms').isInt({ min: 1 }),
    (0, express_validator_1.body)('size').isFloat({ min: 0 }),
];
/** Get all properties with optional filters */
exports.getProperties = (0, validate_1.asyncHandler)(async (req, res) => {
    const { featured, type, minPrice, maxPrice, guests } = req.query;
    const filter = { isAvailable: true };
    if (featured === 'true')
        filter.featured = true;
    if (type)
        filter.type = type;
    if (minPrice || maxPrice) {
        filter.pricePerNight = {};
        if (minPrice)
            filter.pricePerNight.$gte = Number(minPrice);
        if (maxPrice)
            filter.pricePerNight.$lte = Number(maxPrice);
    }
    if (guests)
        filter.maxGuests = { $gte: Number(guests) };
    const properties = await Property_1.Property.find(filter).sort({ featured: -1, createdAt: -1 });
    res.json({ success: true, count: properties.length, data: properties });
});
/** Get single property by slug */
exports.getPropertyBySlug = (0, validate_1.asyncHandler)(async (req, res) => {
    const property = await Property_1.Property.findOne({ slug: req.params.slug });
    if (!property) {
        throw (0, errorHandler_1.createError)('Property not found', 404);
    }
    res.json({ success: true, data: property });
});
/** Create property (admin only) */
exports.createProperty = (0, validate_1.asyncHandler)(async (req, res) => {
    const property = await Property_1.Property.create(req.body);
    res.status(201).json({ success: true, data: property });
});
/** Update property (admin only) */
exports.updateProperty = (0, validate_1.asyncHandler)(async (req, res) => {
    const property = await Property_1.Property.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!property) {
        throw (0, errorHandler_1.createError)('Property not found', 404);
    }
    res.json({ success: true, data: property });
});
/** Delete property (admin only) */
exports.deleteProperty = (0, validate_1.asyncHandler)(async (req, res) => {
    const property = await Property_1.Property.findByIdAndDelete(req.params.id);
    if (!property) {
        throw (0, errorHandler_1.createError)('Property not found', 404);
    }
    res.json({ success: true, message: 'Property deleted' });
});
/** Get featured properties for homepage */
exports.getFeaturedProperties = (0, validate_1.asyncHandler)(async (_req, res) => {
    const properties = await Property_1.Property.find({ featured: true, isAvailable: true }).limit(6);
    res.json({ success: true, data: properties });
});
//# sourceMappingURL=propertyController.js.map
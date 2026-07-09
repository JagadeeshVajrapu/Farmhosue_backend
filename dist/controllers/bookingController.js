"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAvailability = exports.cancelBooking = exports.updateBookingStatus = exports.getAllBookings = exports.getMyBookings = exports.createBooking = exports.bookingValidation = void 0;
const express_validator_1 = require("express-validator");
const Booking_1 = require("../models/Booking");
const Property_1 = require("../models/Property");
const validate_1 = require("../middleware/validate");
const errorHandler_1 = require("../middleware/errorHandler");
const bookingId_1 = require("../utils/bookingId");
const notification_service_1 = require("../services/notification.service");
exports.bookingValidation = [
    (0, express_validator_1.body)('propertyId').notEmpty().withMessage('Property is required'),
    (0, express_validator_1.body)('checkIn').isISO8601().withMessage('Valid check-in date required'),
    (0, express_validator_1.body)('checkOut').isISO8601().withMessage('Valid check-out date required'),
    (0, express_validator_1.body)('guests').isInt({ min: 1 }).withMessage('At least 1 guest required'),
    (0, express_validator_1.body)('adults').optional().isInt({ min: 1 }),
    (0, express_validator_1.body)('children').optional().isInt({ min: 0 }),
    (0, express_validator_1.body)('guestName').trim().notEmpty().withMessage('Guest name is required'),
    (0, express_validator_1.body)('guestEmail').isEmail().withMessage('Valid email required'),
    (0, express_validator_1.body)('guestPhone').trim().notEmpty().withMessage('Phone is required'),
    (0, express_validator_1.body)('eventType')
        .optional()
        .isIn(['stay', 'wedding', 'corporate', 'birthday', 'party', 'other']),
    (0, express_validator_1.body)('eventName').optional().trim().notEmpty(),
    (0, express_validator_1.body)('paymentMethod')
        .optional()
        .isIn(['card', 'upi', 'bank_transfer', 'pay_at_property']),
    (0, express_validator_1.body)('cateringRequired').optional().isBoolean(),
    (0, express_validator_1.body)('decorationRequired').optional().isBoolean(),
];
/** Check date overlap for a property */
const hasDateConflict = async (propertyId, checkIn, checkOut, excludeBookingId) => {
    const filter = {
        property: propertyId,
        status: { $in: ['pending', 'confirmed'] },
        $or: [{ checkIn: { $lt: checkOut }, checkOut: { $gt: checkIn } }],
    };
    if (excludeBookingId) {
        filter._id = { $ne: excludeBookingId };
    }
    const conflict = await Booking_1.Booking.findOne(filter);
    return !!conflict;
};
const PAYMENT_LABELS = {
    card: 'Credit / Debit Card',
    upi: 'UPI',
    bank_transfer: 'Bank Transfer',
    pay_at_property: 'Pay at Property',
};
function formatDate(date) {
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}
/** Create a new booking */
exports.createBooking = (0, validate_1.asyncHandler)(async (req, res) => {
    const { propertyId, checkIn, checkOut, guests, adults, children, specialRequests, guestName, guestEmail, guestPhone, guestAddress, eventType = 'stay', eventName, cateringRequired = false, decorationRequired = false, dietaryRequirements, paymentMethod = 'pay_at_property', } = req.body;
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    if (checkOutDate <= checkInDate) {
        throw (0, errorHandler_1.createError)('Check-out must be after check-in', 400);
    }
    const property = await Property_1.Property.findById(propertyId);
    if (!property || !property.isAvailable) {
        throw (0, errorHandler_1.createError)('Property not available', 404);
    }
    if (guests > property.maxGuests) {
        throw (0, errorHandler_1.createError)(`Maximum ${property.maxGuests} guests allowed`, 400);
    }
    const conflict = await hasDateConflict(propertyId, checkInDate, checkOutDate);
    if (conflict) {
        throw (0, errorHandler_1.createError)('Selected dates are not available', 409);
    }
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    const totalPrice = nights * property.pricePerNight;
    const bookingId = (0, bookingId_1.generateBookingId)();
    const booking = await Booking_1.Booking.create({
        bookingId,
        user: req.user._id,
        property: propertyId,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        guests,
        adults: adults ?? guests,
        children: children ?? 0,
        totalPrice,
        specialRequests,
        guestName,
        guestEmail,
        guestPhone,
        guestAddress,
        eventType,
        eventName: eventName || `${eventType} at Vidhaan`,
        cateringRequired,
        decorationRequired,
        dietaryRequirements,
        paymentMethod,
    });
    await booking.populate('property', 'name slug images pricePerNight');
    const propertyName = typeof booking.property === 'object' && 'name' in booking.property
        ? booking.property.name
        : 'Vidhaan Farmhouse';
    (0, notification_service_1.notifyBookingCreated)({
        bookingId,
        guestName,
        guestEmail,
        guestPhone,
        propertyName,
        checkIn: formatDate(checkInDate),
        checkOut: formatDate(checkOutDate),
        guests,
        totalPrice,
        eventType,
        eventName: eventName || `${eventType} at Vidhaan`,
        paymentMethod: PAYMENT_LABELS[paymentMethod] || paymentMethod,
    });
    res.status(201).json({ success: true, data: booking });
});
/** Get user's bookings */
exports.getMyBookings = (0, validate_1.asyncHandler)(async (req, res) => {
    const bookings = await Booking_1.Booking.find({ user: req.user._id })
        .populate('property', 'name slug images pricePerNight location')
        .sort({ createdAt: -1 });
    res.json({ success: true, data: bookings });
});
/** Get all bookings (admin) */
exports.getAllBookings = (0, validate_1.asyncHandler)(async (_req, res) => {
    const bookings = await Booking_1.Booking.find()
        .populate('property', 'name slug')
        .populate('user', 'name email')
        .sort({ createdAt: -1 });
    res.json({ success: true, count: bookings.length, data: bookings });
});
/** Update booking status (admin) */
exports.updateBookingStatus = (0, validate_1.asyncHandler)(async (req, res) => {
    const { status, paymentStatus } = req.body;
    const booking = await Booking_1.Booking.findByIdAndUpdate(req.params.id, { ...(status && { status }), ...(paymentStatus && { paymentStatus }) }, { new: true, runValidators: true }).populate('property', 'name slug');
    if (!booking) {
        throw (0, errorHandler_1.createError)('Booking not found', 404);
    }
    res.json({ success: true, data: booking });
});
/** Cancel booking */
exports.cancelBooking = (0, validate_1.asyncHandler)(async (req, res) => {
    const booking = await Booking_1.Booking.findById(req.params.id);
    if (!booking) {
        throw (0, errorHandler_1.createError)('Booking not found', 404);
    }
    const isOwner = booking.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) {
        throw (0, errorHandler_1.createError)('Not authorized to cancel this booking', 403);
    }
    booking.status = 'cancelled';
    await booking.save();
    res.json({ success: true, data: booking });
});
/** Check availability for dates */
exports.checkAvailability = (0, validate_1.asyncHandler)(async (req, res) => {
    const { propertyId, checkIn, checkOut } = req.query;
    if (!propertyId || !checkIn || !checkOut) {
        throw (0, errorHandler_1.createError)('propertyId, checkIn, and checkOut are required', 400);
    }
    const conflict = await hasDateConflict(propertyId, new Date(checkIn), new Date(checkOut));
    res.json({ success: true, available: !conflict });
});
//# sourceMappingURL=bookingController.js.map
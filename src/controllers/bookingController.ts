import { Response } from 'express';
import { body } from 'express-validator';
import { Booking } from '../models/Booking';
import { Property } from '../models/Property';
import { AuthRequest } from '../types';
import { asyncHandler } from '../middleware/validate';
import { createError } from '../middleware/errorHandler';
import { generateBookingId } from '../utils/bookingId';
import { notifyBookingCreated } from '../services/notification.service';

export const bookingValidation = [
  body('propertyId').notEmpty().withMessage('Property is required'),
  body('checkIn').isISO8601().withMessage('Valid check-in date required'),
  body('checkOut').isISO8601().withMessage('Valid check-out date required'),
  body('guests').isInt({ min: 1 }).withMessage('At least 1 guest required'),
  body('adults').optional().isInt({ min: 1 }),
  body('children').optional().isInt({ min: 0 }),
  body('guestName').trim().notEmpty().withMessage('Guest name is required'),
  body('guestEmail').isEmail().withMessage('Valid email required'),
  body('guestPhone').trim().notEmpty().withMessage('Phone is required'),
  body('eventType')
    .optional()
    .isIn(['stay', 'wedding', 'corporate', 'birthday', 'party', 'other']),
  body('eventName').optional().trim().notEmpty(),
  body('paymentMethod')
    .optional()
    .isIn(['card', 'upi', 'bank_transfer', 'pay_at_property']),
  body('cateringRequired').optional().isBoolean(),
  body('decorationRequired').optional().isBoolean(),
];

/** Check date overlap for a property */
const hasDateConflict = async (
  propertyId: string,
  checkIn: Date,
  checkOut: Date,
  excludeBookingId?: string
): Promise<boolean> => {
  const filter: Record<string, unknown> = {
    property: propertyId,
    status: { $in: ['pending', 'confirmed'] },
    $or: [{ checkIn: { $lt: checkOut }, checkOut: { $gt: checkIn } }],
  };

  if (excludeBookingId) {
    filter._id = { $ne: excludeBookingId };
  }

  const conflict = await Booking.findOne(filter);
  return !!conflict;
};

const PAYMENT_LABELS: Record<string, string> = {
  card: 'Credit / Debit Card',
  upi: 'UPI',
  bank_transfer: 'Bank Transfer',
  pay_at_property: 'Pay at Property',
};

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

/** Create a new booking */
export const createBooking = asyncHandler(async (req: AuthRequest, res: Response) => {
  const {
    propertyId,
    checkIn,
    checkOut,
    guests,
    adults,
    children,
    specialRequests,
    guestName,
    guestEmail,
    guestPhone,
    guestAddress,
    eventType = 'stay',
    eventName,
    cateringRequired = false,
    decorationRequired = false,
    dietaryRequirements,
    paymentMethod = 'pay_at_property',
  } = req.body;

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  if (checkOutDate <= checkInDate) {
    throw createError('Check-out must be after check-in', 400);
  }

  const property = await Property.findById(propertyId);
  if (!property || !property.isAvailable) {
    throw createError('Property not available', 404);
  }

  if (guests > property.maxGuests) {
    throw createError(`Maximum ${property.maxGuests} guests allowed`, 400);
  }

  const conflict = await hasDateConflict(propertyId, checkInDate, checkOutDate);
  if (conflict) {
    throw createError('Selected dates are not available', 409);
  }

  const nights = Math.ceil(
    (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const totalPrice = nights * property.pricePerNight;

  const bookingId = generateBookingId();

  const booking = await Booking.create({
    bookingId,
    user: req.user!._id,
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

  const propertyName =
    typeof booking.property === 'object' && 'name' in booking.property
      ? (booking.property as { name: string }).name
      : 'Vidhaan Farmhouse';

  notifyBookingCreated({
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
export const getMyBookings = asyncHandler(async (req: AuthRequest, res: Response) => {
  const bookings = await Booking.find({ user: req.user!._id })
    .populate('property', 'name slug images pricePerNight location')
    .sort({ createdAt: -1 });

  res.json({ success: true, data: bookings });
});

/** Get all bookings (admin) */
export const getAllBookings = asyncHandler(async (_req: AuthRequest, res: Response) => {
  const bookings = await Booking.find()
    .populate('property', 'name slug')
    .populate('user', 'name email')
    .sort({ createdAt: -1 });

  res.json({ success: true, count: bookings.length, data: bookings });
});

/** Update booking status (admin) */
export const updateBookingStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { status, paymentStatus } = req.body;

  const booking = await Booking.findByIdAndUpdate(
    req.params.id,
    { ...(status && { status }), ...(paymentStatus && { paymentStatus }) },
    { new: true, runValidators: true }
  ).populate('property', 'name slug');

  if (!booking) {
    throw createError('Booking not found', 404);
  }

  res.json({ success: true, data: booking });
});

/** Cancel booking */
export const cancelBooking = asyncHandler(async (req: AuthRequest, res: Response) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    throw createError('Booking not found', 404);
  }

  const isOwner = booking.user.toString() === req.user!._id.toString();
  const isAdmin = req.user!.role === 'admin';

  if (!isOwner && !isAdmin) {
    throw createError('Not authorized to cancel this booking', 403);
  }

  booking.status = 'cancelled';
  await booking.save();

  res.json({ success: true, data: booking });
});

/** Check availability for dates */
export const checkAvailability = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { propertyId, checkIn, checkOut } = req.query;

  if (!propertyId || !checkIn || !checkOut) {
    throw createError('propertyId, checkIn, and checkOut are required', 400);
  }

  const conflict = await hasDateConflict(
    propertyId as string,
    new Date(checkIn as string),
    new Date(checkOut as string)
  );

  res.json({ success: true, available: !conflict });
});

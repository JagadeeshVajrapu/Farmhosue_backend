import mongoose, { Schema } from 'mongoose';
import { IBooking } from '../types';

const bookingSchema = new Schema<IBooking>(
  {
    bookingId: { type: String, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    property: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    guests: { type: Number, required: true, min: 1 },
    adults: { type: Number, required: true, min: 1, default: 1 },
    children: { type: Number, default: 0, min: 0 },
    totalPrice: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },
    specialRequests: { type: String },
    guestName: { type: String, required: true },
    guestEmail: { type: String, required: true },
    guestPhone: { type: String, required: true },
    guestAddress: { type: String },
    eventType: {
      type: String,
      enum: ['stay', 'wedding', 'corporate', 'birthday', 'party', 'other'],
      default: 'stay',
    },
    eventName: { type: String, required: true },
    cateringRequired: { type: Boolean, default: false },
    decorationRequired: { type: Boolean, default: false },
    dietaryRequirements: { type: String },
    paymentMethod: {
      type: String,
      enum: ['card', 'upi', 'bank_transfer', 'pay_at_property'],
      default: 'pay_at_property',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

bookingSchema.index({ property: 1, checkIn: 1, checkOut: 1 });
bookingSchema.index({ user: 1 });

export const Booking = mongoose.model<IBooking>('Booking', bookingSchema);

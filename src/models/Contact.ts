import mongoose, { Schema } from 'mongoose';
import { IContact } from '../types';

const contactSchema = new Schema<IContact>(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    eventType: { type: String, required: true, trim: true },
    preferredDate: { type: Date, required: true },
    guestCount: { type: Number, required: true, min: 1, max: 500 },
    message: { type: String, required: true, trim: true, minlength: 10 },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Booked', 'Closed'],
      default: 'New',
    },
  },
  { timestamps: true }
);

contactSchema.index({ status: 1, createdAt: -1 });
contactSchema.index({ email: 1 });

export const Contact = mongoose.model<IContact>('Contact', contactSchema);

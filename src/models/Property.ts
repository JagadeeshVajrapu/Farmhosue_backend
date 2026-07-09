import mongoose, { Schema } from 'mongoose';
import { IProperty } from '../types';

const propertySchema = new Schema<IProperty>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    shortDescription: { type: String, required: true },
    type: {
      type: String,
      enum: ['villa', 'cottage', 'suite', 'farmhouse'],
      required: true,
    },
    pricePerNight: { type: Number, required: true, min: 0 },
    maxGuests: { type: Number, required: true, min: 1 },
    bedrooms: { type: Number, required: true, min: 1 },
    bathrooms: { type: Number, required: true, min: 1 },
    amenities: [{ type: String }],
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String },
        alt: { type: String, default: '' },
      },
    ],
    featured: { type: Boolean, default: false },
    isAvailable: { type: Boolean, default: true },
    size: { type: Number, required: true },
    location: { type: String, default: 'Vidhaan Estate, New Delhi NCR' },
  },
  { timestamps: true }
);

propertySchema.index({ featured: 1, isAvailable: 1 });

export const Property = mongoose.model<IProperty>('Property', propertySchema);

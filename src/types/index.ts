import { Request } from 'express';
import { Document, Types } from 'mongoose';

export type UserRole = 'guest' | 'admin' | 'staff';

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  isActive: boolean;
  comparePassword(candidatePassword: string): Promise<boolean>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProperty extends Document {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  type: 'villa' | 'cottage' | 'suite' | 'farmhouse';
  pricePerNight: number;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  images: { url: string; publicId: string; alt: string }[];
  featured: boolean;
  isAvailable: boolean;
  size: number;
  location: string;
  createdAt: Date;
  updatedAt: Date;
}

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';
export type PaymentMethod = 'card' | 'upi' | 'bank_transfer' | 'pay_at_property';
export type EventType = 'stay' | 'wedding' | 'corporate' | 'birthday' | 'party' | 'other';

export interface IBooking extends Document {
  _id: Types.ObjectId;
  bookingId: string;
  user: Types.ObjectId;
  property: Types.ObjectId;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  adults: number;
  children: number;
  totalPrice: number;
  status: BookingStatus;
  specialRequests?: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guestAddress?: string;
  eventType: EventType;
  eventName: string;
  cateringRequired: boolean;
  decorationRequired: boolean;
  dietaryRequirements?: string;
  paymentMethod: PaymentMethod;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  createdAt: Date;
  updatedAt: Date;
}

export interface IReview extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  property: Types.ObjectId;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthRequest extends Request {
  user?: IUser;
}

export interface JwtPayload {
  id: string;
  role: UserRole;
}

export type ContactStatus = 'New' | 'Contacted' | 'Booked' | 'Closed';

export interface IContact extends Document {
  _id: Types.ObjectId;
  name: string;
  phone: string;
  email: string;
  eventType: string;
  preferredDate: Date;
  guestCount: number;
  message: string;
  status: ContactStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateContactInput {
  name: string;
  phone: string;
  email: string;
  eventType: string;
  preferredDate: Date;
  guestCount: number;
  message: string;
}

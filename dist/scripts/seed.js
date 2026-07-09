"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = require("../models/User");
const Property_1 = require("../models/Property");
const database_1 = require("../config/database");
dotenv_1.default.config();
const properties = [
    {
        name: 'The Grand Vidhaan Villa',
        slug: 'grand-vidhaan-villa',
        description: 'An opulent private villa nestled within 12 acres of manicured gardens. Featuring floor-to-ceiling windows, a private infinity pool, and bespoke interiors crafted by renowned designers. Experience unparalleled luxury in the heart of nature.',
        shortDescription: 'Opulent private villa with infinity pool and bespoke interiors',
        type: 'villa',
        pricePerNight: 45000,
        maxGuests: 8,
        bedrooms: 4,
        bathrooms: 4,
        size: 6500,
        amenities: [
            'Private Infinity Pool',
            'Butler Service',
            'Gourmet Kitchen',
            'Home Theatre',
            'Wine Cellar',
            'Private Garden',
            'Outdoor Dining',
            'WiFi',
            'Air Conditioning',
        ],
        images: [
            {
                url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1920&q=80',
                alt: 'Grand Vidhaan Villa exterior',
            },
            {
                url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80',
                alt: 'Luxury villa living room',
            },
        ],
        featured: true,
        location: 'Vidhaan Estate, Chhatarpur, New Delhi',
    },
    {
        name: 'Serenity Cottage',
        slug: 'serenity-cottage',
        description: 'A charming boutique cottage offering intimate luxury for couples and small families. Surrounded by ancient trees and flowering gardens, this retreat features a private jacuzzi, fireplace, and panoramic valley views.',
        shortDescription: 'Intimate boutique cottage with private jacuzzi and valley views',
        type: 'cottage',
        pricePerNight: 28000,
        maxGuests: 4,
        bedrooms: 2,
        bathrooms: 2,
        size: 2800,
        amenities: [
            'Private Jacuzzi',
            'Fireplace',
            'Valley Views',
            'Garden Terrace',
            'Breakfast Included',
            'WiFi',
            'Air Conditioning',
        ],
        images: [
            {
                url: 'https://images.unsplash.com/photo-1518780664697-55e3ad7cd119?w=1920&q=80',
                alt: 'Serenity Cottage',
            },
        ],
        featured: true,
        location: 'Vidhaan Estate, Chhatarpur, New Delhi',
    },
    {
        name: 'Royal Farmhouse Suite',
        slug: 'royal-farmhouse-suite',
        description: 'The crown jewel of Vidhaan Estate. This expansive farmhouse suite spans two levels with heritage architecture blended with modern luxury. Features a private lake view, spa room, and dedicated concierge.',
        shortDescription: 'Heritage farmhouse suite with lake view and private spa',
        type: 'farmhouse',
        pricePerNight: 65000,
        maxGuests: 12,
        bedrooms: 6,
        bathrooms: 5,
        size: 9000,
        amenities: [
            'Private Spa Room',
            'Lake View',
            'Concierge Service',
            'Private Chef',
            'Banquet Hall',
            'Swimming Pool',
            'Tennis Court',
            'Helipad Access',
            'WiFi',
        ],
        images: [
            {
                url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80',
                alt: 'Royal Farmhouse Suite',
            },
        ],
        featured: true,
        location: 'Vidhaan Estate, Chhatarpur, New Delhi',
    },
    {
        name: 'Garden View Suite',
        slug: 'garden-view-suite',
        description: 'Elegant suite overlooking our award-winning botanical gardens. Perfect for discerning travelers seeking refined comfort with easy access to estate amenities.',
        shortDescription: 'Elegant suite with botanical garden views',
        type: 'suite',
        pricePerNight: 18000,
        maxGuests: 2,
        bedrooms: 1,
        bathrooms: 1,
        size: 1200,
        amenities: ['Garden View', 'Room Service', 'Mini Bar', 'WiFi', 'Air Conditioning'],
        images: [
            {
                url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1920&q=80',
                alt: 'Garden View Suite',
            },
        ],
        featured: false,
        location: 'Vidhaan Estate, Chhatarpur, New Delhi',
    },
];
const seed = async () => {
    try {
        await (0, database_1.connectDB)();
        await Property_1.Property.deleteMany({});
        await User_1.User.deleteMany({ email: 'admin@vidhaan.com' });
        await Property_1.Property.insertMany(properties);
        await User_1.User.create({
            name: 'Admin',
            email: 'admin@vidhaan.com',
            password: 'admin123',
            role: 'admin',
        });
        console.log('✅ Database seeded successfully');
        console.log('   Admin: admin@vidhaan.com / admin123');
        console.log(`   Properties: ${properties.length} created`);
        await mongoose_1.default.disconnect();
        process.exit(0);
    }
    catch (error) {
        console.error('Seed error:', error);
        process.exit(1);
    }
};
seed();
//# sourceMappingURL=seed.js.map
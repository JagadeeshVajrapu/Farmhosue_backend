"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Booking = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const bookingSchema = new mongoose_1.Schema({
    bookingId: { type: String, required: true, unique: true },
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    property: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Property', required: true },
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
}, { timestamps: true });
bookingSchema.index({ property: 1, checkIn: 1, checkOut: 1 });
bookingSchema.index({ user: 1 });
exports.Booking = mongoose_1.default.model('Booking', bookingSchema);
//# sourceMappingURL=Booking.js.map
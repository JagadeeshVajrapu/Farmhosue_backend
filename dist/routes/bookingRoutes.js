"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bookingController_1 = require("../controllers/bookingController");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const router = (0, express_1.Router)();
router.get('/availability', bookingController_1.checkAvailability);
router.post('/', auth_1.protect, bookingController_1.bookingValidation, validate_1.validate, bookingController_1.createBooking);
router.get('/my', auth_1.protect, bookingController_1.getMyBookings);
router.get('/', auth_1.protect, (0, auth_1.authorize)('admin', 'staff'), bookingController_1.getAllBookings);
router.patch('/:id/status', auth_1.protect, (0, auth_1.authorize)('admin', 'staff'), bookingController_1.updateBookingStatus);
router.patch('/:id/cancel', auth_1.protect, bookingController_1.cancelBooking);
exports.default = router;
//# sourceMappingURL=bookingRoutes.js.map
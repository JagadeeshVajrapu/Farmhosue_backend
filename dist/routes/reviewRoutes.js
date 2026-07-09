"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reviewController_1 = require("../controllers/reviewController");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const router = (0, express_1.Router)();
router.get('/property/:propertyId', reviewController_1.getPropertyReviews);
router.post('/', auth_1.protect, reviewController_1.reviewValidation, validate_1.validate, reviewController_1.createReview);
router.get('/pending', auth_1.protect, (0, auth_1.authorize)('admin'), reviewController_1.getPendingReviews);
router.patch('/:id/approve', auth_1.protect, (0, auth_1.authorize)('admin'), reviewController_1.approveReview);
exports.default = router;
//# sourceMappingURL=reviewRoutes.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const propertyController_1 = require("../controllers/propertyController");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const router = (0, express_1.Router)();
router.get('/', propertyController_1.getProperties);
router.get('/featured', propertyController_1.getFeaturedProperties);
router.get('/:slug', propertyController_1.getPropertyBySlug);
router.post('/', auth_1.protect, (0, auth_1.authorize)('admin'), propertyController_1.propertyValidation, validate_1.validate, propertyController_1.createProperty);
router.put('/:id', auth_1.protect, (0, auth_1.authorize)('admin'), propertyController_1.updateProperty);
router.delete('/:id', auth_1.protect, (0, auth_1.authorize)('admin'), propertyController_1.deleteProperty);
exports.default = router;
//# sourceMappingURL=propertyRoutes.js.map
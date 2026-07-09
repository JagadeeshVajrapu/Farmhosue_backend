"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const contactController_1 = require("../controllers/contactController");
const validate_1 = require("../middleware/validate");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Public
router.post('/', contactController_1.contactValidation, validate_1.validate, contactController_1.createContact);
// Admin
router.get('/export', auth_1.protect, (0, auth_1.authorize)('admin', 'staff'), contactController_1.exportContacts);
router.get('/', auth_1.protect, (0, auth_1.authorize)('admin', 'staff'), contactController_1.getContacts);
router.get('/:id', auth_1.protect, (0, auth_1.authorize)('admin', 'staff'), contactController_1.getContactById);
router.patch('/:id/status', auth_1.protect, (0, auth_1.authorize)('admin', 'staff'), contactController_1.statusValidation, validate_1.validate, contactController_1.updateContactStatus);
router.delete('/:id', auth_1.protect, (0, auth_1.authorize)('admin', 'staff'), contactController_1.deleteContact);
exports.default = router;
//# sourceMappingURL=contactRoutes.js.map
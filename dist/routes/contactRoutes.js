"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const contactController_1 = require("../controllers/contactController");
const validate_1 = require("../middleware/validate");
const auth_1 = require("../middleware/auth");
const requireDatabase_1 = require("../middleware/requireDatabase");
const router = (0, express_1.Router)();
// Public — email only, no database
router.post('/', contactController_1.contactValidation, validate_1.validate, contactController_1.createContact);
// Admin — requires MongoDB
router.get('/export', requireDatabase_1.requireDatabase, auth_1.protect, (0, auth_1.authorize)('admin', 'staff'), contactController_1.exportContacts);
router.get('/', requireDatabase_1.requireDatabase, auth_1.protect, (0, auth_1.authorize)('admin', 'staff'), contactController_1.getContacts);
router.get('/:id', requireDatabase_1.requireDatabase, auth_1.protect, (0, auth_1.authorize)('admin', 'staff'), contactController_1.getContactById);
router.patch('/:id/status', requireDatabase_1.requireDatabase, auth_1.protect, (0, auth_1.authorize)('admin', 'staff'), contactController_1.statusValidation, validate_1.validate, contactController_1.updateContactStatus);
router.delete('/:id', requireDatabase_1.requireDatabase, auth_1.protect, (0, auth_1.authorize)('admin', 'staff'), contactController_1.deleteContact);
exports.default = router;
//# sourceMappingURL=contactRoutes.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const uploadController_1 = require("../controllers/uploadController");
const cloudinary_1 = require("../config/cloudinary");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.post('/single', auth_1.protect, (0, auth_1.authorize)('admin'), cloudinary_1.upload.single('image'), uploadController_1.uploadImage);
router.post('/multiple', auth_1.protect, (0, auth_1.authorize)('admin'), cloudinary_1.upload.array('images', 10), uploadController_1.uploadImages);
exports.default = router;
//# sourceMappingURL=uploadRoutes.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImages = exports.uploadImage = void 0;
const validate_1 = require("../middleware/validate");
const errorHandler_1 = require("../middleware/errorHandler");
const cloudinary_1 = require("../config/cloudinary");
/** Handle Cloudinary file upload */
exports.uploadImage = (0, validate_1.asyncHandler)(async (req, res) => {
    if (!req.file?.buffer) {
        throw (0, errorHandler_1.createError)('No file uploaded', 400);
    }
    const data = await (0, cloudinary_1.uploadImageBuffer)(req.file.buffer);
    res.json({
        success: true,
        data,
    });
});
/** Handle multiple image uploads */
exports.uploadImages = (0, validate_1.asyncHandler)(async (req, res) => {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        throw (0, errorHandler_1.createError)('No files uploaded', 400);
    }
    const images = await Promise.all(req.files.map((file) => {
        if (!file.buffer) {
            throw (0, errorHandler_1.createError)('Invalid file upload', 400);
        }
        return (0, cloudinary_1.uploadImageBuffer)(file.buffer);
    }));
    res.json({ success: true, data: images });
});
//# sourceMappingURL=uploadController.js.map
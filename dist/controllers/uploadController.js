"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImages = exports.uploadImage = void 0;
const validate_1 = require("../middleware/validate");
const errorHandler_1 = require("../middleware/errorHandler");
/** Handle Cloudinary file upload */
exports.uploadImage = (0, validate_1.asyncHandler)(async (req, res) => {
    if (!req.file) {
        throw (0, errorHandler_1.createError)('No file uploaded', 400);
    }
    const file = req.file;
    res.json({
        success: true,
        data: {
            url: file.path,
            publicId: file.filename,
        },
    });
});
/** Handle multiple image uploads */
exports.uploadImages = (0, validate_1.asyncHandler)(async (req, res) => {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        throw (0, errorHandler_1.createError)('No files uploaded', 400);
    }
    const images = req.files.map((file) => {
        const f = file;
        return { url: f.path, publicId: f.filename };
    });
    res.json({ success: true, data: images });
});
//# sourceMappingURL=uploadController.js.map
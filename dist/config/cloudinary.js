"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudinary = exports.upload = void 0;
exports.uploadImageBuffer = uploadImageBuffer;
const cloudinary_1 = require("cloudinary");
Object.defineProperty(exports, "cloudinary", { enumerable: true, get: function () { return cloudinary_1.v2; } });
const multer_1 = __importDefault(require("multer"));
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp']);
const fileFilter = (_req, file, cb) => {
    if (ALLOWED_MIME_TYPES.has(file.mimetype)) {
        cb(null, true);
        return;
    }
    cb(new Error('Only JPG, PNG, and WebP images are allowed'));
};
/** Memory storage — files are uploaded to Cloudinary in the controller */
exports.upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter,
});
/** Upload a buffer to Cloudinary (v2 API — no multer-storage-cloudinary) */
function uploadImageBuffer(buffer) {
    return new Promise((resolve, reject) => {
        const stream = cloudinary_1.v2.uploader.upload_stream({
            folder: 'vidhaan-farmhouse',
            resource_type: 'image',
            transformation: [{ width: 1920, height: 1080, crop: 'limit', quality: 'auto' }],
        }, (error, result) => {
            if (error || !result) {
                reject(error ?? new Error('Cloudinary upload failed'));
                return;
            }
            resolve({
                url: result.secure_url,
                publicId: result.public_id,
            });
        });
        stream.end(buffer);
    });
}
//# sourceMappingURL=cloudinary.js.map
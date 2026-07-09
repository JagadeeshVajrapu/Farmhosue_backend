import { Router } from 'express';
import { uploadImage, uploadImages } from '../controllers/uploadController';
import { upload } from '../config/cloudinary';
import { protect, authorize } from '../middleware/auth';

const router = Router();

router.post('/single', protect, authorize('admin'), upload.single('image'), uploadImage);
router.post('/multiple', protect, authorize('admin'), upload.array('images', 10), uploadImages);

export default router;

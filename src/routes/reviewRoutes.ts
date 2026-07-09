import { Router } from 'express';
import {
  getPropertyReviews,
  createReview,
  approveReview,
  getPendingReviews,
  reviewValidation,
} from '../controllers/reviewController';
import { protect, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

router.get('/property/:propertyId', getPropertyReviews);
router.post('/', protect, reviewValidation, validate, createReview);
router.get('/pending', protect, authorize('admin'), getPendingReviews);
router.patch('/:id/approve', protect, authorize('admin'), approveReview);

export default router;

import { Router } from 'express';
import {
  getProperties,
  getPropertyBySlug,
  createProperty,
  updateProperty,
  deleteProperty,
  getFeaturedProperties,
  propertyValidation,
} from '../controllers/propertyController';
import { protect, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

router.get('/', getProperties);
router.get('/featured', getFeaturedProperties);
router.get('/:slug', getPropertyBySlug);

router.post('/', protect, authorize('admin'), propertyValidation, validate, createProperty);
router.put('/:id', protect, authorize('admin'), updateProperty);
router.delete('/:id', protect, authorize('admin'), deleteProperty);

export default router;

import { Router } from 'express';
import {
  createContact,
  contactValidation,
  getContacts,
  getContactById,
  updateContactStatus,
  deleteContact,
  exportContacts,
  statusValidation,
} from '../controllers/contactController';
import { validate } from '../middleware/validate';
import { protect, authorize } from '../middleware/auth';

const router = Router();

// Public
router.post('/', contactValidation, validate, createContact);

// Admin
router.get('/export', protect, authorize('admin', 'staff'), exportContacts);
router.get('/', protect, authorize('admin', 'staff'), getContacts);
router.get('/:id', protect, authorize('admin', 'staff'), getContactById);
router.patch('/:id/status', protect, authorize('admin', 'staff'), statusValidation, validate, updateContactStatus);
router.delete('/:id', protect, authorize('admin', 'staff'), deleteContact);

export default router;

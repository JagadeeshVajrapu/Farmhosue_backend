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
import { requireDatabase } from '../middleware/requireDatabase';

const router = Router();

// Public — email only, no database
router.post('/', contactValidation, validate, createContact);

// Admin — requires MongoDB
router.get('/export', requireDatabase, protect, authorize('admin', 'staff'), exportContacts);
router.get('/', requireDatabase, protect, authorize('admin', 'staff'), getContacts);
router.get('/:id', requireDatabase, protect, authorize('admin', 'staff'), getContactById);
router.patch('/:id/status', requireDatabase, protect, authorize('admin', 'staff'), statusValidation, validate, updateContactStatus);
router.delete('/:id', requireDatabase, protect, authorize('admin', 'staff'), deleteContact);

export default router;

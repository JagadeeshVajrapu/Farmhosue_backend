import { Router } from 'express';
import {
  createBooking,
  getMyBookings,
  getAllBookings,
  updateBookingStatus,
  cancelBooking,
  checkAvailability,
  bookingValidation,
} from '../controllers/bookingController';
import { protect, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

router.get('/availability', checkAvailability);
router.post('/', protect, bookingValidation, validate, createBooking);
router.get('/my', protect, getMyBookings);
router.get('/', protect, authorize('admin', 'staff'), getAllBookings);
router.patch('/:id/status', protect, authorize('admin', 'staff'), updateBookingStatus);
router.patch('/:id/cancel', protect, cancelBooking);

export default router;

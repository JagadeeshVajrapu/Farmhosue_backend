import { Router } from 'express';
import {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  registerValidation,
  loginValidation,
} from '../controllers/authController';
import { protect } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

export default router;

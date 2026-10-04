import { Router } from 'express';
import {
  login,
  registerCustomer,
  logout,
  getProfile,
  updateAdminProfile,
  changeAdminPassword,
} from '../controllers/authController.js';
import { verifyAdminToken, verifyAnyToken } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/login', login);
router.post('/register', registerCustomer);
router.post('/logout', logout);
router.get('/me', verifyAnyToken, getProfile);
router.put('/profile', verifyAdminToken, updateAdminProfile);
router.put('/change-password', verifyAdminToken, changeAdminPassword);

export default router;

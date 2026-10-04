import { Router } from 'express';
import {
  createBooking,
  getBookings,
  searchBookings,
  trackBookingPublic,
  getBookingById,
  updateBooking,
  deleteBooking,
} from '../controllers/bookingController.js';
import { verifyAdminToken } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/', createBooking);
router.get('/track/:bookingId', trackBookingPublic);
router.get('/search', searchBookings);
router.get('/', getBookings);
router.get('/:id', getBookingById);
router.put('/:id', verifyAdminToken, updateBooking);
router.delete('/:id', verifyAdminToken, deleteBooking);

export default router;

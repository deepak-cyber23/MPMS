import { Router } from 'express';
import { getBookingReport, getEnquiryReport } from '../controllers/reportController.js';
import { verifyAdminToken } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/bookings', verifyAdminToken, getBookingReport);
router.get('/enquiries', verifyAdminToken, getEnquiryReport);

export default router;

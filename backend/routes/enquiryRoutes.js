import { Router } from 'express';
import {
  createEnquiry,
  getEnquiries,
  getEnquiryById,
  updateEnquiry,
  deleteEnquiry,
} from '../controllers/enquiryController.js';
import { verifyAdminToken } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/', createEnquiry);
router.get('/', verifyAdminToken, getEnquiries);
router.get('/:id', verifyAdminToken, getEnquiryById);
router.put('/:id', verifyAdminToken, updateEnquiry);
router.delete('/:id', verifyAdminToken, deleteEnquiry);

export default router;

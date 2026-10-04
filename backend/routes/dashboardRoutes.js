import { Router } from 'express';
import {
  getDashboardStats,
  getMongoCollectionsSnapshot,
} from '../controllers/dashboardController.js';
import { verifyAdminToken } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/stats', verifyAdminToken, getDashboardStats);
router.get('/mongodb-collections', getMongoCollectionsSnapshot);

export default router;

import { Router } from 'express';
import { getPages, updatePage } from '../controllers/pageController.js';
import { verifyAdminToken } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', getPages);
router.put('/:slug', verifyAdminToken, updatePage);

export default router;

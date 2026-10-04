import { Router } from 'express';
import { getUsers, getUserById } from '../controllers/userController.js';
import { verifyAdminToken } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', verifyAdminToken, getUsers);
router.get('/:id', verifyAdminToken, getUserById);

export default router;

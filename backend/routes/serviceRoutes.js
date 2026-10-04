import { Router } from 'express';
import {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} from '../controllers/serviceController.js';
import { verifyAdminToken } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', getServices);
router.get('/:id', getServiceById);
router.post('/', verifyAdminToken, createService);
router.put('/:id', verifyAdminToken, updateService);
router.delete('/:id', verifyAdminToken, deleteService);

export default router;

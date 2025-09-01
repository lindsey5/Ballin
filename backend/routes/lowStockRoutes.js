import express from 'express';
import { adminRequireAuth } from '../middlewares/authRequire.js';
import { getLowStockNotifications, markAsRead } from '../controllers/lowStockController.js';

const router = express.Router();

router.get('/', adminRequireAuth, getLowStockNotifications);
router.put('/:id', adminRequireAuth, markAsRead);

const lowStockRoutes = router;

export default lowStockRoutes;
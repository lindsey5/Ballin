import express from 'express';
import { adminRequireAuth } from '../middlewares/authRequire.js';
import { getLowStockNotifications, markAllAsRead, markAsRead } from '../controllers/lowStockController.js';

const router = express.Router();

router.get('/', adminRequireAuth, getLowStockNotifications);
router.put('/:id', adminRequireAuth, markAsRead);
router.put('/', adminRequireAuth, markAllAsRead);

const lowStockRoutes = router;

export default lowStockRoutes;
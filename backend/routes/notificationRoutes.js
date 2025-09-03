import express from 'express';
import { adminRequireAuth, customerRequireAuth } from '../middlewares/authRequire.js';
import { adminMarkAllReadNotifications, adminMarkReadNotificationById, customerMarkAllReadNotifications, customerMarkReadNotificationById, getAdminNotifications, getCustomerNotifications } from '../controllers/notificationController.js';
const router = express.Router();

router.get('/', customerRequireAuth, getCustomerNotifications);
router.get('/admin', adminRequireAuth, getAdminNotifications);
router.put('/admin', adminRequireAuth, adminMarkAllReadNotifications);
router.put('/admin/:id', adminRequireAuth, adminMarkReadNotificationById);
router.put('/', customerRequireAuth, customerMarkAllReadNotifications);
router.put('/:id', customerRequireAuth, customerMarkReadNotificationById);

const notificationRoutes = router;

export default notificationRoutes;
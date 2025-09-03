import express from 'express';
import { adminRequireAuth, customerRequireAuth } from '../middlewares/authRequire.js';
import { adminMarkAllReadNotifications, customerMarkAllReadNotifications, getAdminNotifications, getCustomerNotifications } from '../controllers/notificationController.js';
const router = express.Router();

router.get('/', customerRequireAuth, getCustomerNotifications);
router.get('/admin', adminRequireAuth, getAdminNotifications);
router.put('/admin', adminRequireAuth, adminMarkAllReadNotifications);
router.put('/', customerRequireAuth, customerMarkAllReadNotifications);

const notificationRoutes = router;

export default notificationRoutes;
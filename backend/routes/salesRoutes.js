import express from 'express';
import { getOverallSales, getSalesPerMonth, getSalesThisMonth, getSalesThisWeek, getSalesThisYear, getSalesToday } from '../controllers/salesController.js';
import { adminRequireAuth } from '../middlewares/authRequire.js';


const router = express.Router();

router.get('/', adminRequireAuth, getOverallSales);
router.get('/today', adminRequireAuth, getSalesToday);
router.get('/month', adminRequireAuth, getSalesThisMonth);
router.get('/per-month', adminRequireAuth, getSalesPerMonth);
router.get('/week', adminRequireAuth, getSalesThisWeek);
router.get('/year', adminRequireAuth, getSalesThisYear);

const salesRoutes = router

export default salesRoutes;
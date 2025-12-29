import express from 'express';
import { protect } from '../middleware/authMiddleware';
import {
    getOverview,
    getIncomeCategoryStats,
    getExpenseCategoryStats,
    getMonthlyStats,
    getDailyStats,
    getYearlyStats,
} from '../controllers/analyticsController';

const router = express.Router();

router.use(protect);

router.get('/overview', getOverview);
router.get('/categories/income', getIncomeCategoryStats);
router.get('/categories/expense', getExpenseCategoryStats);
router.get('/monthly', getMonthlyStats);
router.get('/daily', getDailyStats);
router.get('/yearly', getYearlyStats);

export default router;

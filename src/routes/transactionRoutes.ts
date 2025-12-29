import express from 'express';
import { protect } from '../middleware/authMiddleware';
import {
    getTransactions,
    addIncome,
    addExpense,
    transfer,
    reverseTransaction,
} from '../controllers/transactionController';

const router = express.Router();

router.use(protect);

router.get('/', getTransactions);
router.post('/income', addIncome);
router.post('/expense', addExpense);
router.post('/transfer', transfer);
router.post('/:id/reverse', reverseTransaction);

export default router;

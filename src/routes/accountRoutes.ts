import express from 'express';
import { protect } from '../middleware/authMiddleware';
import {
    createAccount,
    getAccounts,
    getAccountById,
    updateAccount,
    deleteAccount,
} from '../controllers/accountController';

const router = express.Router();

router.use(protect); // All account routes are protected

router.route('/').post(createAccount).get(getAccounts);
router.route('/:id').get(getAccountById).put(updateAccount).delete(deleteAccount);

export default router;

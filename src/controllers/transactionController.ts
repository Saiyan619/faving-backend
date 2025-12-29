import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import * as transactionService from '../services/transactionService';

export const getTransactions = async (req: AuthRequest, res: Response) => {
    try {
        const data = await transactionService.getTransactions(req.user.id, req.query);
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const addIncome = async (req: AuthRequest, res: Response) => {
    try {
        const { accountId, amount, category, note, date } = req.body;
        const transaction = await transactionService.addIncome(req.user.id, accountId, amount, category, note, date);
        res.status(201).json(transaction);
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
};

export const addExpense = async (req: AuthRequest, res: Response) => {
    try {
        const { accountId, amount, category, note, date } = req.body;
        const transaction = await transactionService.addExpense(req.user.id, accountId, amount, category, note, date);
        res.status(201).json(transaction);
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
};

export const transfer = async (req: AuthRequest, res: Response) => {
    try {
        const { fromAccountId, toAccountId, amount, note, date } = req.body;
        const result = await transactionService.transfer(req.user.id, fromAccountId, toAccountId, amount, note, date);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
};

export const reverseTransaction = async (req: AuthRequest, res: Response) => {
    try {
        const transaction = await transactionService.reverseTransaction(req.user.id, req.params.id);
        res.json(transaction);
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
};

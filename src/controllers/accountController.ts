import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import * as accountService from '../services/accountService';

export const createAccount = async (req: AuthRequest, res: Response) => {
    try {
        const account = await accountService.createAccount(req.user.id, req.body);
        res.status(201).json(account);
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
};

export const getAccounts = async (req: AuthRequest, res: Response) => {
    try {
        const accounts = await accountService.getAccounts(req.user.id);
        res.json(accounts);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const getAccountById = async (req: AuthRequest, res: Response) => {
    try {
        const account = await accountService.getAccountById(req.user.id, req.params.id);
        res.json(account);
    } catch (error) {
        res.status(404).json({ message: (error as Error).message });
    }
};

export const updateAccount = async (req: AuthRequest, res: Response) => {
    try {
        const account = await accountService.updateAccount(req.user.id, req.params.id, req.body);
        res.json(account);
    } catch (error) {
        res.status(404).json({ message: (error as Error).message });
    }
};

export const deleteAccount = async (req: AuthRequest, res: Response) => {
    try {
        const account = await accountService.deleteAccount(req.user.id, req.params.id);
        res.json({ message: 'Account removed', account });
    } catch (error) {
        res.status(404).json({ message: (error as Error).message });
    }
};

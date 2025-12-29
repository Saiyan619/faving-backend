import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import * as analyticsService from '../services/analyticsService';

export const getOverview = async (req: AuthRequest, res: Response) => {
    try {
        const data = await analyticsService.getOverview(req.user.id);
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const getIncomeCategoryStats = async (req: AuthRequest, res: Response) => {
    try {
        const data = await analyticsService.getCategoryStats(req.user.id, 'income');
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const getExpenseCategoryStats = async (req: AuthRequest, res: Response) => {
    try {
        const data = await analyticsService.getCategoryStats(req.user.id, 'expense');
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const getMonthlyStats = async (req: AuthRequest, res: Response) => {
    try {
        const data = await analyticsService.getMonthlyStats(req.user.id);
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const getDailyStats = async (req: AuthRequest, res: Response) => {
    try {
        const data = await analyticsService.getDailyStats(req.user.id);
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const getYearlyStats = async (req: AuthRequest, res: Response) => {
    try {
        const data = await analyticsService.getYearlyStats(req.user.id);
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

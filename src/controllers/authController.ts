import { Request, Response } from 'express';
import * as authService from '../services/authService';

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;
        const user = await authService.registerUser(name, email, password);

        // Set cookie
        res.cookie('jwt', user.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        });

        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await authService.loginUser(email, password);

        // Set cookie
        res.cookie('jwt', user.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        });

        res.json(user);
    } catch (error) {
        res.status(401).json({ message: (error as Error).message });
    }
};

export const logout = (req: Request, res: Response) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out successfully' });
};

export const getMe = async (req: Request, res: Response) => {
    try {
        const user = await authService.getUserById((req as any).user.id);
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ message: 'User not found' });
    }
};

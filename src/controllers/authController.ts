import { Request, Response } from 'express';
import * as authService from '../services/authService';

// Helper function to determine if connection is secure (handles proxies)
const isSecureConnection = (req: Request): boolean => {
    // Check explicit environment variable first
    if (process.env.SECURE_COOKIE === 'true') return true;
    if (process.env.SECURE_COOKIE === 'false') return false;
    
    // Check if behind a proxy (common in production)
    const forwardedProto = req.headers['x-forwarded-proto'];
    if (forwardedProto === 'https') return true;
    
    // Check direct connection
    return req.secure;
};

// Helper function to get cookie options
const getCookieOptions = (req: Request): any => {
    const isProduction = process.env.NODE_ENV === 'production';
    const isSecure = isSecureConnection(req);
    
    const cookieOptions: any = {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    };

    if (isProduction) {
        // Production: use 'none' for cross-origin, requires secure
        // If secure is true, use 'none', otherwise use 'lax'
        cookieOptions.secure = isSecure;
        cookieOptions.sameSite = isSecure ? 'none' : 'lax';
    } else {
        // Development: use 'lax' and allow http
        cookieOptions.secure = false;
        cookieOptions.sameSite = 'lax';
    }

    return cookieOptions;
};

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;
        const user = await authService.registerUser(name, email, password);

        res.cookie('jwt', user.token, getCookieOptions(req));

        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await authService.loginUser(email, password);

        res.cookie('jwt', user.token, getCookieOptions(req));

        res.json(user);
    } catch (error) {
        res.status(401).json({ message: (error as Error).message });
    }
};

export const logout = (req: Request, res: Response) => {
    const cookieOptions = getCookieOptions(req);
    cookieOptions.expires = new Date(0);
    delete cookieOptions.maxAge;
    
    res.cookie('jwt', '', cookieOptions);
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

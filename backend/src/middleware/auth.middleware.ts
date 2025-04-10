import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/user.model';

interface JwtPayload {
    id: string;
    role: string;
}

// Extend Express Request type to include 'user' property
declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}

export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // Get token from cookies or Authorization header
        let token = req.cookies.jwt;

        // If no cookie, check Authorization header
        if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        // Check if token exists
        if (!token) {
            res.status(401).json({ success: false, message: 'Not authorized, no token' });
            return;
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

        // Get user from token
        const user = await User.findById(decoded.id);
        if (!user) {
            res.status(401).json({ success: false, message: 'User not found' });
            return;
        }

        // Set user in request object
        req.user = user;

        // Add to your auth middleware temporarily
        console.log('Cookies:', req.cookies);
        console.log('Auth header:', req.headers.authorization);

        next();
    } catch (error) {
        res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
};

export const restrictTo = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Not authorized, no user' });
            return;
        }

        if (!roles.includes(req.user.role)) {
            res.status(403).json({
                success: false,
                message: `Role '${req.user.role}' is not allowed to perform this action`
            });
            return;
        }

        next();
    };
}; 
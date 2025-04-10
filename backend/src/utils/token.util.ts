import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { Response } from 'express';
import { IUser } from '../models/user.model';
import { createJwtOptions } from './jwt-helper';

export const generateToken = (user: IUser): string => {
    const secret: Secret = process.env.JWT_SECRET || 'fallback_secret';
    const jwtExpiry = process.env.JWT_EXPIRES_IN || '1d';

    return jwt.sign(
        {
            id: user._id,
            role: user.role
        },
        secret,
        createJwtOptions(jwtExpiry)
    );
};

export const sendTokenCookie = (user: IUser, statusCode: number, res: Response): void => {
    const token = generateToken(user);

    // Set JWT as HttpOnly cookie
    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000
    });

    // Remove password from output
    const userObject = user.toObject();
    delete (userObject as any).password;

    res.status(statusCode).json({
        success: true,
        token,
        data: {
            user: userObject
        }
    });
};

// ... existing code ...
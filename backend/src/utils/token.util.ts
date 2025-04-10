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
    const cookieOptions = {
        expires: new Date(
            Date.now() + parseInt((process.env.COOKIE_EXPIRES_IN || '1') as string) * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' as const : 'lax' as const
    };

    res.cookie('jwt', token, cookieOptions);

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
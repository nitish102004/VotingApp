import { Request, Response } from 'express';
import User from '../models/user.model';
import AadhaarWhitelist from '../models/aadhaarWhitelist.model';
import { sendTokenCookie } from '../utils/token.util';

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
export const signup = async (req: Request, res: Response): Promise<void> => {
    try {
        const { aadhaarNumber, fullName, age, password } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ aadhaarNumber });
        if (userExists) {
            res.status(400).json({ success: false, message: 'User already exists' });
            return;
        }

        // Check if the Aadhaar number is in the whitelist
        const whitelistedAadhaar = await AadhaarWhitelist.findOne({ aadhaarNumber });
        if (!whitelistedAadhaar) {
            res.status(403).json({
                success: false,
                message: 'You are not authorized to register. Your Aadhaar number is not in the approved list.'
            });
            return;
        }

        // Check if the Aadhaar number has already been used
        if (whitelistedAadhaar.isUsed) {
            res.status(403).json({
                success: false,
                message: 'This Aadhaar number has already been used for registration.'
            });
            return;
        }

        // Check if first user, assign role as admin
        const isFirstUser = (await User.countDocuments({})) === 0;
        const role = isFirstUser ? 'admin' : 'voter';

        // Create user
        const user = await User.create({
            aadhaarNumber,
            fullName,
            age,
            password,
            role
        });

        // Mark the Aadhaar number as used
        whitelistedAadhaar.isUsed = true;
        await whitelistedAadhaar.save();

        // Send token
        sendTokenCookie(user, 201, res);
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message || 'User registration failed'
        });
    }
};

// @desc    Login a user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { aadhaarNumber, password } = req.body;

        // Validate inputs
        if (!aadhaarNumber || !password) {
            res.status(400).json({ success: false, message: 'Please provide Aadhaar number and password' });
            return;
        }

        // Find user
        const user = await User.findOne({ aadhaarNumber }).select('+password');
        if (!user) {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
            return;
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
            return;
        }

        // Send token
        sendTokenCookie(user, 200, res);
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message || 'Login failed'
        });
    }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private
export const logout = (req: Request, res: Response): void => {
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });

    res.status(200).json({ success: true, message: 'User logged out successfully' });
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await User.findById(req.user?._id);

        res.status(200).json({
            success: true,
            data: {
                user
            }
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to get current user'
        });
    }
}; 
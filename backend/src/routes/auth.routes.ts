import express from 'express';
import { signup, login, logout, getCurrentUser } from '../controllers/auth.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

// Protected routes
router.get('/me', protect, getCurrentUser);

export default router; 
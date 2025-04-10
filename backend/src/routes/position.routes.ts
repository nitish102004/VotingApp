import express from 'express';
import {
    createPosition,
    getPositions,
    getPosition,
    updatePosition,
    deletePosition
} from '../controllers/position.controller';
import { protect, restrictTo } from '../middleware/auth.middleware';

const router = express.Router();

// Public routes
router.get('/', getPositions);
router.get('/:id', getPosition);

// Admin-only routes
router.post('/', protect, restrictTo('admin'), createPosition);
router.put('/:id', protect, restrictTo('admin'), updatePosition);
router.delete('/:id', protect, restrictTo('admin'), deletePosition);

export default router; 
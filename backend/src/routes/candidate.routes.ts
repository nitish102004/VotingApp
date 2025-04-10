import express from 'express';
import {
    createCandidate,
    getCandidates,
    getCandidate,
    updateCandidate,
    deleteCandidate
} from '../controllers/candidate.controller';
import { protect, restrictTo } from '../middleware/auth.middleware';

const router = express.Router();

// Public routes
router.get('/', getCandidates);
router.get('/:id', getCandidate);

// Admin-only routes
router.post('/', protect, restrictTo('admin'), createCandidate);
router.put('/:id', protect, restrictTo('admin'), updateCandidate);
router.delete('/:id', protect, restrictTo('admin'), deleteCandidate);

export default router; 
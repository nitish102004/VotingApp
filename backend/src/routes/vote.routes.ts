import express from 'express';
import { castVote, checkVoteStatus } from '../controllers/vote.controller';
import { protect, restrictTo } from '../middleware/auth.middleware';

const router = express.Router();

// Voter-only routes
router.post('/', protect, restrictTo('voter'), castVote);
router.get('/status/:positionId', protect, restrictTo('voter'), checkVoteStatus);

export default router; 
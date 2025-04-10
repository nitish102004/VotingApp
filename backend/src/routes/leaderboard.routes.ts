import express from 'express';
import { getLeaderboard } from '../controllers/leaderboard.controller';

const router = express.Router();

// Public route
router.get('/', getLeaderboard);

export default router; 
import { Request, Response } from 'express';
import Vote from '../models/vote.model';
import Candidate, { ICandidate } from '../models/candidate.model';
import mongoose from 'mongoose';
import { io } from '../index';

// Extend Express Request type to include 'io' property
declare global {
    namespace Express {
        interface Request {
            io: any;
        }
    }
}

// @desc    Cast a vote
// @route   POST /api/votes
// @access  Private/Voter
export const castVote = async (req: Request, res: Response): Promise<void> => {
    try {
        const { candidateId, positionId } = req.body;
        const userId = req.user?._id;

        // Check if user is admin (admins can't vote)
        if (req.user?.role === 'admin') {
            res.status(403).json({ success: false, message: 'Admins are not allowed to vote' });
            return;
        }

        // Check if candidate exists
        const candidate = await Candidate.findById(candidateId);
        if (!candidate) {
            res.status(404).json({ success: false, message: 'Candidate not found' });
            return;
        }

        // Check if candidate belongs to the specified position
        if ((candidate.position as mongoose.Types.ObjectId).toString() !== positionId) {
            res.status(400).json({
                success: false,
                message: 'Candidate does not belong to the specified position'
            });
            return;
        }

        // Check if user has already voted for this position
        const existingVote = await Vote.findOne({ user: userId, position: positionId });
        if (existingVote) {
            res.status(400).json({
                success: false,
                message: 'You have already voted for this position'
            });
            return;
        }

        // Create vote
        const vote = await Vote.create({
            user: userId,
            candidate: candidateId,
            position: positionId
        });

        // Emit socket event to update leaderboard
        const leaderboardData = await getLeaderboardData();
        req.io.emit('leaderboardUpdate', leaderboardData);

        res.status(201).json({
            success: true,
            data: {
                vote
            }
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message || 'Vote casting failed'
        });
    }
};

// @desc    Check voter status for a position
// @route   GET /api/votes/status/:positionId
// @access  Private/Voter
export const checkVoteStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const { positionId } = req.params;
        const userId = req.user?._id;

        const vote = await Vote.findOne({ user: userId, position: positionId });

        res.status(200).json({
            success: true,
            data: {
                hasVoted: !!vote,
                votedFor: vote ? vote.candidate : null
            }
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to check vote status'
        });
    }
};

// Helper function to get leaderboard data
const getLeaderboardData = async () => {
    const results = await Vote.aggregate([
        {
            $lookup: {
                from: 'positions',
                localField: 'position',
                foreignField: '_id',
                as: 'positionDetails'
            }
        },
        {
            $unwind: '$positionDetails'
        },
        {
            $lookup: {
                from: 'candidates',
                localField: 'candidate',
                foreignField: '_id',
                as: 'candidateDetails'
            }
        },
        {
            $unwind: '$candidateDetails'
        },
        {
            $group: {
                _id: {
                    position: '$position',
                    candidate: '$candidate'
                },
                position: { $first: '$positionDetails.name' },
                candidate: { $first: '$candidateDetails.name' },
                count: { $sum: 1 }
            }
        },
        {
            $sort: {
                'position': 1,
                'count': -1,
                'candidate': 1
            }
        }
    ]);

    // Group by position for easier frontend rendering
    const groupedResults: { [key: string]: any[] } = {};

    results.forEach((item) => {
        const positionId = item._id.position.toString();

        if (!groupedResults[positionId]) {
            groupedResults[positionId] = [];
        }

        groupedResults[positionId].push({
            candidate: item.candidate,
            count: item.count,
            positionName: item.position
        });
    });

    return groupedResults;
}; 
import { Request, Response } from 'express';
import Vote from '../models/vote.model';

// @desc    Get leaderboard data
// @route   GET /api/leaderboard
// @access  Public
export const getLeaderboard = async (req: Request, res: Response): Promise<void> => {
    try {
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
                    positionId: { $first: '$position' },
                    positionName: { $first: '$positionDetails.name' },
                    candidateName: { $first: '$candidateDetails.name' },
                    votes: { $sum: 1 }
                }
            },
            {
                $sort: {
                    'positionName': 1,
                    'votes': -1
                }
            }
        ]);

        // Transform the data for easier consumption by the frontend
        // Group by position
        const positionMap: { [key: string]: any } = {};

        results.forEach(result => {
            const positionId = result.positionId.toString();

            if (!positionMap[positionId]) {
                positionMap[positionId] = {
                    id: positionId,
                    name: result.positionName,
                    candidates: []
                };
            }

            positionMap[positionId].candidates.push({
                id: result._id.candidate,
                name: result.candidateName,
                votes: result.votes
            });
        });

        // Convert to array
        const leaderboard = Object.values(positionMap);

        res.status(200).json({
            success: true,
            data: leaderboard
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to fetch leaderboard data'
        });
    }
}; 
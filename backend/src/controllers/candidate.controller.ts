import { Request, Response } from 'express';
import Candidate from '../models/candidate.model';
import Position from '../models/position.model';

// @desc    Create a new candidate
// @route   POST /api/candidates
// @access  Private/Admin
export const createCandidate = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, position, bio } = req.body;

        // Check if position exists
        const positionExists = await Position.findById(position);
        if (!positionExists) {
            res.status(404).json({ success: false, message: 'Position not found' });
            return;
        }

        // Create candidate
        const candidate = await Candidate.create({
            name,
            position,
            bio
        });

        res.status(201).json({
            success: true,
            data: {
                candidate
            }
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message || 'Candidate creation failed'
        });
    }
};

// @desc    Get all candidates
// @route   GET /api/candidates
// @access  Public
export const getCandidates = async (req: Request, res: Response): Promise<void> => {
    try {
        // Filter by position if provided
        const filter = req.query.position ? { position: req.query.position } : {};

        const candidates = await Candidate.find(filter).populate('position', 'name');

        res.status(200).json({
            success: true,
            count: candidates.length,
            data: {
                candidates
            }
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to fetch candidates'
        });
    }
};

// @desc    Get single candidate
// @route   GET /api/candidates/:id
// @access  Public
export const getCandidate = async (req: Request, res: Response): Promise<void> => {
    try {
        const candidate = await Candidate.findById(req.params.id).populate('position', 'name');

        if (!candidate) {
            res.status(404).json({ success: false, message: 'Candidate not found' });
            return;
        }

        res.status(200).json({
            success: true,
            data: {
                candidate
            }
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to fetch candidate'
        });
    }
};

// @desc    Update candidate
// @route   PUT /api/candidates/:id
// @access  Private/Admin
export const updateCandidate = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, position, bio } = req.body;

        let candidate = await Candidate.findById(req.params.id);

        if (!candidate) {
            res.status(404).json({ success: false, message: 'Candidate not found' });
            return;
        }

        // Check if position exists if updating position
        if (position) {
            const positionExists = await Position.findById(position);
            if (!positionExists) {
                res.status(404).json({ success: false, message: 'Position not found' });
                return;
            }
        }

        candidate = await Candidate.findByIdAndUpdate(
            req.params.id,
            { name, position, bio },
            { new: true, runValidators: true }
        ).populate('position', 'name');

        res.status(200).json({
            success: true,
            data: {
                candidate
            }
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message || 'Candidate update failed'
        });
    }
};

// @desc    Delete candidate
// @route   DELETE /api/candidates/:id
// @access  Private/Admin
export const deleteCandidate = async (req: Request, res: Response): Promise<void> => {
    try {
        const candidate = await Candidate.findById(req.params.id);

        if (!candidate) {
            res.status(404).json({ success: false, message: 'Candidate not found' });
            return;
        }

        await candidate.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message || 'Candidate deletion failed'
        });
    }
}; 
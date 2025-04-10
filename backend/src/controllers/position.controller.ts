import { Request, Response } from 'express';
import Position from '../models/position.model';

// @desc    Create a new position
// @route   POST /api/positions
// @access  Private/Admin
export const createPosition = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, description } = req.body;

        // Check if position already exists
        const positionExists = await Position.findOne({ name });
        if (positionExists) {
            res.status(400).json({ success: false, message: 'Position already exists' });
            return;
        }

        // Create position
        const position = await Position.create({
            name,
            description
        });

        res.status(201).json({
            success: true,
            data: {
                position
            }
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message || 'Position creation failed'
        });
    }
};

// @desc    Get all positions
// @route   GET /api/positions
// @access  Public
export const getPositions = async (req: Request, res: Response): Promise<void> => {
    try {
        const positions = await Position.find({});

        res.status(200).json({
            success: true,
            count: positions.length,
            data: {
                positions
            }
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to fetch positions'
        });
    }
};

// @desc    Get single position
// @route   GET /api/positions/:id
// @access  Public
export const getPosition = async (req: Request, res: Response): Promise<void> => {
    try {
        const position = await Position.findById(req.params.id);

        if (!position) {
            res.status(404).json({ success: false, message: 'Position not found' });
            return;
        }

        res.status(200).json({
            success: true,
            data: {
                position
            }
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to fetch position'
        });
    }
};

// @desc    Update position
// @route   PUT /api/positions/:id
// @access  Private/Admin
export const updatePosition = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, description } = req.body;

        let position = await Position.findById(req.params.id);

        if (!position) {
            res.status(404).json({ success: false, message: 'Position not found' });
            return;
        }

        position = await Position.findByIdAndUpdate(
            req.params.id,
            { name, description },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            data: {
                position
            }
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message || 'Position update failed'
        });
    }
};

// @desc    Delete position
// @route   DELETE /api/positions/:id
// @access  Private/Admin
export const deletePosition = async (req: Request, res: Response): Promise<void> => {
    try {
        const position = await Position.findById(req.params.id);

        if (!position) {
            res.status(404).json({ success: false, message: 'Position not found' });
            return;
        }

        await position.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message || 'Position deletion failed'
        });
    }
}; 
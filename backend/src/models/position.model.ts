import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IPosition extends Document {
    name: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}

const positionSchema = new Schema<IPosition>(
    {
        name: {
            type: String,
            required: [true, 'Position name is required'],
            unique: true,
            trim: true
        },
        description: {
            type: String,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

const Position: Model<IPosition> = mongoose.model<IPosition>('Position', positionSchema);
export default Position; 
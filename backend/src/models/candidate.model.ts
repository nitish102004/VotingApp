import mongoose, { Document, Model, Schema } from 'mongoose';
import { IPosition } from './position.model';

export interface ICandidate extends Document {
    name: string;
    position: mongoose.Types.ObjectId | IPosition['_id'];
    bio?: string;
    createdAt: Date;
    updatedAt: Date;
}

const candidateSchema = new Schema<ICandidate>(
    {
        name: {
            type: String,
            required: [true, 'Candidate name is required'],
            trim: true
        },
        position: {
            type: Schema.Types.ObjectId,
            ref: 'Position',
            required: [true, 'Position is required']
        },
        bio: {
            type: String,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

const Candidate: Model<ICandidate> = mongoose.model<ICandidate>('Candidate', candidateSchema);
export default Candidate; 
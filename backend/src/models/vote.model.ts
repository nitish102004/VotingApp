import mongoose, { Document, Model, Schema } from 'mongoose';
import { IUser } from './user.model';
import { ICandidate } from './candidate.model';
import { IPosition } from './position.model';

export interface IVote extends Document {
    user: IUser['_id'];
    candidate: ICandidate['_id'];
    position: IPosition['_id'];
    createdAt: Date;
}

const voteSchema = new Schema<IVote>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User is required']
        },
        candidate: {
            type: Schema.Types.ObjectId,
            ref: 'Candidate',
            required: [true, 'Candidate is required']
        },
        position: {
            type: Schema.Types.ObjectId,
            ref: 'Position',
            required: [true, 'Position is required']
        }
    },
    {
        timestamps: true
    }
);

// Create a compound index to ensure a user can only vote once per position
voteSchema.index({ user: 1, position: 1 }, { unique: true });

const Vote: Model<IVote> = mongoose.model<IVote>('Vote', voteSchema);
export default Vote; 
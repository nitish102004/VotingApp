import mongoose from 'mongoose';

export interface IAadhaarWhitelist extends mongoose.Document {
    aadhaarNumber: string;
    isUsed: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const AadhaarWhitelistSchema = new mongoose.Schema({
    aadhaarNumber: {
        type: String,
        required: [true, 'Aadhaar number is required'],
        unique: true,
        trim: true,
        validate: {
            validator: function (v: string) {
                return /^\d{12}$/.test(v);
            },
            message: props => `${props.value} is not a valid Aadhaar number!`
        }
    },
    isUsed: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Create index on aadhaarNumber for faster lookups
AadhaarWhitelistSchema.index({ aadhaarNumber: 1 });

const AadhaarWhitelist = mongoose.model<IAadhaarWhitelist>('AadhaarWhitelist', AadhaarWhitelistSchema);

export default AadhaarWhitelist; 
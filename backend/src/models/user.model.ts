import mongoose, { Document, Model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
    aadhaarNumber: string;
    fullName: string;
    age: number;
    password: string;
    role: 'admin' | 'voter';
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
    {
        aadhaarNumber: {
            type: String,
            required: [true, 'Aadhaar number is required'],
            unique: true,
            trim: true,
            minlength: 12,
            maxlength: 12
        },
        fullName: {
            type: String,
            required: [true, 'Full name is required'],
            trim: true
        },
        age: {
            type: Number,
            required: [true, 'Age is required'],
            min: [18, 'Must be at least 18 years old']
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters long'],
            select: false
        },
        role: {
            type: String,
            enum: ['admin', 'voter'],
            default: 'voter'
        }
    },
    {
        timestamps: true
    }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
    // Only hash the password if it's modified (or new)
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error: any) {
        next(error);
    }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);
export default User; 
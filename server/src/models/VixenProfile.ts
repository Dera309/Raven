import mongoose, { Schema, Document } from 'mongoose';

export interface IVixenProfile extends Document {
    user: mongoose.Types.ObjectId;
    stageName: string;
    bio?: string;
    measurements?: {
        height?: string;
        bust?: string;
        waist?: string;
        hips?: string;
        shoeSize?: string;
    };
    location: string;
    rate?: number;
    currency: string;
    isAvailable: boolean;
    portfolio: {
        url: string;
        type: 'image' | 'video';
        publicId: string;
        description?: string;
    }[];
    featured: boolean; // For ad prioritization
    featuredExpiresAt?: Date;
    rating: number;
    reviewCount: number;
}

const VixenProfileSchema: Schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    stageName: { type: String, required: true },
    bio: { type: String },
    measurements: {
        height: { type: String },
        bust: { type: String },
        waist: { type: String },
        hips: { type: String },
        shoeSize: { type: String }
    },
    location: { type: String, required: true },
    rate: { type: Number },
    currency: { type: String, default: 'NGN' },
    isAvailable: { type: Boolean, default: true },
    portfolio: [{
        url: { type: String, required: true },
        type: { type: String, enum: ['image', 'video'], required: true },
        publicId: { type: String, required: true },
        description: { type: String }
    }],
    featured: { type: Boolean, default: false },
    featuredExpiresAt: { type: Date },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 }
}, {
    timestamps: true
});

export default mongoose.model<IVixenProfile>('VixenProfile', VixenProfileSchema);

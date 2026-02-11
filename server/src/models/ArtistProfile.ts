import mongoose, { Schema, Document } from 'mongoose';

export interface IArtistProfile extends Document {
    user: mongoose.Types.ObjectId;
    stageName: string;
    bio?: string;
    genre: string[];
    location?: string;
    website?: string;
    socialLinks?: {
        instagram?: string;
        twitter?: string;
        youtube?: string;
    };
    portfolio: {
        url: string;
        type: 'image' | 'video';
        publicId: string;
        description?: string;
    }[];
}

const ArtistProfileSchema: Schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    stageName: { type: String, required: true },
    bio: { type: String },
    genre: [{ type: String }],
    location: { type: String },
    website: { type: String },
    socialLinks: {
        instagram: { type: String },
        twitter: { type: String },
        youtube: { type: String }
    },
    portfolio: [{
        url: { type: String, required: true },
        type: { type: String, enum: ['image', 'video'], required: true },
        publicId: { type: String, required: true },
        description: { type: String }
    }]
}, {
    timestamps: true
});

export default mongoose.model<IArtistProfile>('ArtistProfile', ArtistProfileSchema);

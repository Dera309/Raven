import mongoose, { Schema, Document } from 'mongoose';

export enum UserRole {
    ARTIST = 'artist',
    VIXEN = 'vixen',
    ADMIN = 'admin'
}

export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    role: UserRole;
    phone?: string;
    isVerified: boolean;
    loginAttempts: number;
    lockUntil?: Date;
    profileImage?: string;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: Object.values(UserRole), default: UserRole.ARTIST },
    phone: { type: String },
    isVerified: { type: Boolean, default: false },
    loginAttempts: { type: Number, required: true, default: 0 },
    lockUntil: { type: Date },
    profileImage: { type: String },
}, {
    timestamps: true
});

export default mongoose.model<IUser>('User', UserSchema);

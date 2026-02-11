import mongoose, { Schema, Document } from 'mongoose';

export enum AdTier {
    WEEKLY = '7_days',
    MONTHLY = '30_days',
    QUARTERLY = '90_days'
}

export interface IAd extends Document {
    user: mongoose.Types.ObjectId;
    tier: AdTier;
    amountPaid: number;
    startDate: Date;
    endDate: Date;
    status: 'active' | 'expired';
    paymentReference: string;
}

const AdSchema: Schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    tier: { type: String, enum: Object.values(AdTier), required: true },
    amountPaid: { type: Number, required: true },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, required: true },
    status: { type: String, enum: ['active', 'expired'], default: 'active' },
    paymentReference: { type: String, required: true }
}, {
    timestamps: true
});

export default mongoose.model<IAd>('Ad', AdSchema);

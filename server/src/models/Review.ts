import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
    booking: mongoose.Types.ObjectId;
    reviewer: mongoose.Types.ObjectId;
    reviewee: mongoose.Types.ObjectId;
    rating: number;
    comment?: string;
}

const ReviewSchema: Schema = new Schema({
    booking: { type: Schema.Types.ObjectId, ref: 'Booking', required: true },
    reviewer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    reviewee: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, maxlength: 500 }
}, {
    timestamps: true
});

export default mongoose.model<IReview>('Review', ReviewSchema);

import mongoose, { Schema, Document } from 'mongoose';

export enum BookingStatus {
    PENDING = 'pending',
    ACCEPTED = 'accepted',
    DECLINED = 'declined',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled'
}

export interface IBooking extends Document {
    artist: mongoose.Types.ObjectId;
    vixen: mongoose.Types.ObjectId;
    projectTitle: string;
    description: string;
    date: Date;
    location: string;
    rateOffered: number;
    status: BookingStatus;
    paymentStatus: 'pending' | 'paid' | 'released' | 'refunded';
}

const BookingSchema: Schema = new Schema({
    artist: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    vixen: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    projectTitle: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    rateOffered: { type: Number, required: true },
    status: { type: String, enum: Object.values(BookingStatus), default: BookingStatus.PENDING },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'released', 'refunded'], default: 'pending' }
}, {
    timestamps: true
});

export default mongoose.model<IBooking>('Booking', BookingSchema);

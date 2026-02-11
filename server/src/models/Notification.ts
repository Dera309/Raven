import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
    recipient: mongoose.Types.ObjectId;
    sender?: mongoose.Types.ObjectId; // Optional, system notifications might no have sender
    type: 'booking_request' | 'booking_status' | 'message' | 'review' | 'ad_expiry' | 'system';
    title: string;
    message: string;
    isRead: boolean;
    relatedId?: string; // ID of related booking, message, etc.
}

const NotificationSchema: Schema = new Schema({
    recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    sender: { type: Schema.Types.ObjectId, ref: 'User' },
    type: { type: String, required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    relatedId: { type: String }
}, {
    timestamps: true
});

export default mongoose.model<INotification>('Notification', NotificationSchema);

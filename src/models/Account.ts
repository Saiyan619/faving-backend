import mongoose, { Schema, Document } from 'mongoose';

export interface IAccount extends Document {
    userId: mongoose.Types.ObjectId;
    name: string;
    type: string;
    currency: string;
    balance: number; // Stored in cents
}

const AccountSchema: Schema = new Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        name: { type: String, required: true },
        type: { type: String, required: true },
        currency: { type: String, required: true },
        balance: { type: Number, required: true, default: 0 },
    },
    { timestamps: true }
);

export default mongoose.model<IAccount>('Account', AccountSchema);

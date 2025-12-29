import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
    userId: mongoose.Types.ObjectId;
    accountId: mongoose.Types.ObjectId;
    type: 'income' | 'expense' | 'transfer_in' | 'transfer_out';
    amount: number;
    category: string;
    note?: string;
    date: Date;
    status: 'active' | 'reversed';
    linkedTransferId?: mongoose.Types.ObjectId; // For transfers
}

const TransactionSchema: Schema = new Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
        type: {
            type: String,
            enum: ['income', 'expense', 'transfer_in', 'transfer_out'],
            required: true,
        },
        amount: { type: Number, required: true }, // Stored in cents
        category: { type: String, required: true },
        note: { type: String },
        date: { type: Date, required: true, default: Date.now },
        status: { type: String, enum: ['active', 'reversed'], default: 'active' },
        linkedTransferId: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' },
    },
    { timestamps: true }
);

// Indexes for performance
TransactionSchema.index({ userId: 1, date: -1 });
TransactionSchema.index({ accountId: 1 });

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);

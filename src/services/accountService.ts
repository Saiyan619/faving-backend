import Account, { IAccount } from '../models/Account';
import mongoose from 'mongoose';

export const createAccount = async (userId: string, data: Partial<IAccount>) => {
    const account = await Account.create({ ...data, userId: new mongoose.Types.ObjectId(userId) });
    return account;
};

export const getAccounts = async (userId: string) => {
    return await Account.find({ userId });
};

export const getAccountById = async (userId: string, accountId: string) => {
    const account = await Account.findOne({ _id: accountId, userId: new mongoose.Types.ObjectId(userId) });
    if (!account) throw new Error('Account not found');
    return account;
};

export const updateAccount = async (userId: string, accountId: string, data: Partial<IAccount>) => {
    const account = await Account.findOneAndUpdate(
        { _id: accountId, userId: new mongoose.Types.ObjectId(userId) },
        data,
        { new: true }
    );
    if (!account) throw new Error('Account not found');
    return account;
};

export const deleteAccount = async (userId: string, accountId: string) => {
    // Soft delete logic could be implemented here if needed, but for now we'll do a hard delete as per initial simple CRUD, 
    // or we can just remove it. The requirements mentioned "optional soft delete".
    // Let's implement hard delete for simplicity unless "soft" is strictly required. 
    // If soft delete is needed, we would add a `deletedAt` field. 
    // Given "Transactions are not physically removed", let's assume accounts MIGHT want soft delete, 
    // but for now let's stick to standard delete or just return the deleted object.
    const account = await Account.findOneAndDelete({ _id: accountId, userId: new mongoose.Types.ObjectId(userId) });
    if (!account) throw new Error('Account not found');
    return account;
};

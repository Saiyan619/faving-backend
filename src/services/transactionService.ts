import mongoose from 'mongoose';
import Transaction, { ITransaction } from '../models/Transaction';
import Account from '../models/Account';

export const getTransactions = async (userId: string, query: any) => {
    const { page = 1, limit = 10, accountId, type } = query;
    const filter: any = { userId: new mongoose.Types.ObjectId(userId) };

    if (accountId) filter.accountId = new mongoose.Types.ObjectId(accountId);
    if (type) filter.type = type;

    const transactions = await Transaction.find(filter)
        .sort({ date: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .populate('accountId', 'name type currency');

    const count = await Transaction.countDocuments(filter);

    return {
        transactions,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
    };
};

export const addIncome = async (userId: string, accountId: string, amount: number, category: string, note?: string, date?: Date) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const transaction = await Transaction.create(
            [{
                userId: new mongoose.Types.ObjectId(userId),
                accountId: new mongoose.Types.ObjectId(accountId),
                type: 'income',
                amount,
                category,
                note,
                date: date || new Date(),
                status: 'active'
            }],
            { session }
        );

        await Account.findByIdAndUpdate(
            accountId,
            { $inc: { balance: amount } },
            { session, new: true }
        );

        await session.commitTransaction();
        session.endSession();
        return transaction[0];
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};

export const addExpense = async (userId: string, accountId: string, amount: number, category: string, note?: string, date?: Date) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const transaction = await Transaction.create(
            [{
                userId: new mongoose.Types.ObjectId(userId),
                accountId: new mongoose.Types.ObjectId(accountId),
                type: 'expense',
                amount,
                category,
                note,
                date: date || new Date(),
                status: 'active'
            }],
            { session }
        );

        await Account.findByIdAndUpdate(
            accountId,
            { $inc: { balance: -amount } },
            { session, new: true }
        );

        await session.commitTransaction();
        session.endSession();
        return transaction[0];
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};

export const transfer = async (userId: string, fromAccountId: string, toAccountId: string, amount: number, note?: string, date?: Date) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const tOut = await Transaction.create(
            [{
                userId: new mongoose.Types.ObjectId(userId),
                accountId: new mongoose.Types.ObjectId(fromAccountId),
                type: 'transfer_out',
                amount,
                category: 'Transfer',
                note,
                date: date || new Date(),
                status: 'active'
            }],
            { session }
        );

        const tIn = await Transaction.create(
            [{
                userId: new mongoose.Types.ObjectId(userId),
                accountId: new mongoose.Types.ObjectId(toAccountId),
                type: 'transfer_in',
                amount,
                category: 'Transfer',
                note,
                date: date || new Date(),
                status: 'active',
                linkedTransferId: tOut[0]._id as mongoose.Types.ObjectId
            }],
            { session }
        );

        // Update linked ID for the first transaction
        tOut[0].linkedTransferId = tIn[0]._id as mongoose.Types.ObjectId;
        await tOut[0].save({ session });

        await Account.findByIdAndUpdate(fromAccountId, { $inc: { balance: -amount } }, { session });
        await Account.findByIdAndUpdate(toAccountId, { $inc: { balance: amount } }, { session });

        await session.commitTransaction();
        session.endSession();
        return { from: tOut[0], to: tIn[0] };
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};

export const reverseTransaction = async (userId: string, transactionId: string) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const transaction = await Transaction.findOne({ _id: transactionId, userId }).session(session);
        if (!transaction) throw new Error('Transaction not found');
        if (transaction.status === 'reversed') throw new Error('Transaction already reversed');

        transaction.status = 'reversed';
        await transaction.save({ session });

        let balanceChange = 0;
        if (transaction.type === 'income' || transaction.type === 'transfer_in') {
            balanceChange = -transaction.amount;
        } else if (transaction.type === 'expense' || transaction.type === 'transfer_out') {
            balanceChange = transaction.amount;
        }

        await Account.findByIdAndUpdate(
            transaction.accountId,
            { $inc: { balance: balanceChange } },
            { session }
        );

        // Handle linked transfers
        if (transaction.linkedTransferId) {
            const linkedTransaction = await Transaction.findById(transaction.linkedTransferId).session(session);
            if (linkedTransaction && linkedTransaction.status !== 'reversed') {
                linkedTransaction.status = 'reversed';
                await linkedTransaction.save({ session });

                let linkedBalanceChange = 0;
                if (linkedTransaction.type === 'income' || linkedTransaction.type === 'transfer_in') {
                    linkedBalanceChange = -linkedTransaction.amount;
                } else if (linkedTransaction.type === 'expense' || linkedTransaction.type === 'transfer_out') {
                    linkedBalanceChange = linkedTransaction.amount;
                }

                await Account.findByIdAndUpdate(
                    linkedTransaction.accountId,
                    { $inc: { balance: linkedBalanceChange } },
                    { session }
                );
            }
        }

        await session.commitTransaction();
        session.endSession();
        return transaction;
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};

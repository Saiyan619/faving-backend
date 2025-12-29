import mongoose from 'mongoose';
import Transaction from '../models/Transaction';

export const getOverview = async (userId: string) => {
    const stats = await Transaction.aggregate([
        {
            $match: {
                userId: new mongoose.Types.ObjectId(userId),
                status: 'active'
            }
        },
        {
            $group: {
                _id: null,
                totalIncome: {
                    $sum: {
                        $cond: [{ $in: ['$type', ['income', 'transfer_in']] }, '$amount', 0]
                    }
                },
                totalExpense: {
                    $sum: {
                        $cond: [{ $in: ['$type', ['expense', 'transfer_out']] }, '$amount', 0]
                    }
                }
            }
        }
    ]);

    const result = stats[0] || { totalIncome: 0, totalExpense: 0 };
    return {
        ...result,
        netBalance: result.totalIncome - result.totalExpense
    };
};

export const getCategoryStats = async (userId: string, type: string = 'expense') => {
    const stats = await Transaction.aggregate([
        {
            $match: {
                userId: new mongoose.Types.ObjectId(userId),
                status: 'active',
                type: type
            }
        },
        {
            $group: {
                _id: '$category',
                total: { $sum: '$amount' },
                count: { $sum: 1 }
            }
        },
        {
            $project: {
                _id: 1,
                category: '$_id',
                total: 1,
                count: 1
            }
        },
        { $sort: { total: -1 } }
    ]);

    return stats;
};

export const getMonthlyStats = async (userId: string) => {
    const stats = await Transaction.aggregate([
        {
            $match: {
                userId: new mongoose.Types.ObjectId(userId),
                status: 'active'
            }
        },
        {
            $group: {
                _id: {
                    year: { $year: '$date' },
                    month: { $month: '$date' }
                },
                totalIncome: {
                    $sum: {
                        $cond: [{ $in: ['$type', ['income', 'transfer_in']] }, '$amount', 0]
                    }
                },
                totalExpense: {
                    $sum: {
                        $cond: [{ $in: ['$type', ['expense', 'transfer_out']] }, '$amount', 0]
                    }
                }
            }
        },
        { $sort: { '_id.year': -1, '_id.month': -1 } }
    ]);

    return stats;
};

export const getDailyStats = async (userId: string) => {
    const stats = await Transaction.aggregate([
        {
            $match: {
                userId: new mongoose.Types.ObjectId(userId),
                status: 'active'
            }
        },
        {
            $group: {
                _id: {
                    year: { $year: '$date' },
                    month: { $month: '$date' },
                    day: { $dayOfMonth: '$date' }
                },
                totalIncome: {
                    $sum: {
                        $cond: [{ $in: ['$type', ['income', 'transfer_in']] }, '$amount', 0]
                    }
                },
                totalExpense: {
                    $sum: {
                        $cond: [{ $in: ['$type', ['expense', 'transfer_out']] }, '$amount', 0]
                    }
                }
            }
        },
        { $sort: { '_id.year': -1, '_id.month': -1, '_id.day': -1 } }
    ]);

    return stats;
};

export const getYearlyStats = async (userId: string) => {
    const stats = await Transaction.aggregate([
        {
            $match: {
                userId: new mongoose.Types.ObjectId(userId),
                status: 'active'
            }
        },
        {
            $group: {
                _id: {
                    year: { $year: '$date' }
                },
                totalIncome: {
                    $sum: {
                        $cond: [{ $in: ['$type', ['income', 'transfer_in']] }, '$amount', 0]
                    }
                },
                totalExpense: {
                    $sum: {
                        $cond: [{ $in: ['$type', ['expense', 'transfer_out']] }, '$amount', 0]
                    }
                }
            }
        },
        { $sort: { '_id.year': -1 } }
    ]);

    return stats;
};

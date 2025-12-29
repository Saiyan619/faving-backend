import User, { IUser } from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const generateToken = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_SECRET as string, {
        expiresIn: '30d',
    });
};

export const registerUser = async (name: string, email: string, password: string) => {
    const userExists = await User.findOne({ email });

    if (userExists) {
        throw new Error('User already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
        name,
        email,
        passwordHash,
    });

    if (user) {
        return {
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken((user._id as any).toString()),
        };
    } else {
        throw new Error('Invalid user data');
    }
};

export const loginUser = async (email: string, password: string) => {
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.passwordHash))) {
        return {
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken((user._id as any).toString()),
        };
    } else {
        throw new Error('Invalid email or password');
    }
};

export const getUserById = async (id: string) => {
    const user = await User.findById(id).select('-passwordHash');
    if (user) {
        return {
            _id: user._id,
            name: user.name,
            email: user.email,
        };
    } else {
        throw new Error('User not found');
    }
};

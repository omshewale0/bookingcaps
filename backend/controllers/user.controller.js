// 1. Remove 'require' completely. Use 'import ... from ...'
import { hash } from 'bcrypt';
import { validationResult } from 'express-validator';
import userModel from '../models/user.model.js';
import { createUser } from '../services/user.services.js';
import blacklistTokenModel from '../models/blacklistToken.model.js';

// 2. Use 'export const' instead of 'module.exports'
export const registerUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { fullname, email, password } = req.body;

    const isUserAlreadyExist = await userModel.findOne({ email })
    if (isUserAlreadyExist) {
        return res.status(400).json({ massage: 'User already exist' });
    }

    // Note: You are using userModel.hashPassword, so the 'hash' import 
    // at the top is actually unused, but I fixed the syntax anyway.
    const hashedPassword = await userModel.hashPassword(password);

    const user = await createUser({
        fullname,
        email,
        password: hashedPassword
    });

    const token = user.generateAuthToken();

    res.status(201).json({ token, user });
};

export const loginUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).select('+password');
    if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = user.generateAuthToken();

    res.cookie('token', token);

    res.status(200).json({ token, user });
};

export const getuserProfile = async (req, res, next) => {
    res.status(200).json(req.user);
};

export const logoutUser = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    await blacklistTokenModel.create({ token });
    res.clearCookie('token');
    res.status(200).json({ message: 'Logout successful' });
};
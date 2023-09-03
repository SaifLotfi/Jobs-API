import { StatusCodes } from 'http-status-codes';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

const register = async (req, res) => {
    const user = await User.create({...req.body});
    res.status(StatusCodes.CREATED).json(user);
};

const login = async (req, res) => {
    res.send('login user');
};

export {
    register,
    login,
};

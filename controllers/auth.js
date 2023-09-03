import { StatusCodes } from 'http-status-codes';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const register = async (req, res) => {
    const user = await User.create({ ...req.body });
    
    res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token:user.createJwt() });
};

const login = async (req, res) => {
    res.send('login user');
};

export { register, login };

import { StatusCodes } from 'http-status-codes';
import User from '../models/User.js';
import {BadRequestError,UnauthenticatedError} from '../errors/index.js';
import  bcrypt  from 'bcryptjs';

const register = async (req, res) => {
    const user = await User.create({ ...req.body });
    
    res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token:user.createJwt() });
};

const login = async (req, res) => {
    const {email,password} = req.body;
    if(!email||!password){
        throw new BadRequestError('Please Provide email and password!');
    }
    const user = await User.findOne({email});
    if(!user){
        throw new UnauthenticatedError('Invalid Credintials!');
    }
    const isPasswordCorrect = await user.comparePasswords(password);
    if(!isPasswordCorrect){
        throw new UnauthenticatedError('Invalid Credintials!');
    }
    
    res.status(StatusCodes.OK).json({ user: { name: user.name }, token:user.createJwt() });
};

export { register, login };

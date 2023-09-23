import { StatusCodes } from 'http-status-codes';
import User from '../models/User.js';
import {BadRequestError,NotFoundError,UnauthenticatedError} from '../errors/index.js';
import  bcrypt  from 'bcryptjs';
import Token from '../models/Token'

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

const requestResetPassword = async (req, res) => {
    const {email} = req.body;
    if(!email){
        throw new BadRequestError('Please Provide email!');
    }
    const user = await User.findOne({email});
    if(!user){
        throw new NotFoundError('User not found!');
    }
    let token = Token.findOne({userId:user._id});
    if(token){
        await token.deleteOne();
    }
    token = crypto.randomBytes(32).toString('hex');
    const resetPassowrdToken = new Token({
        userId :user._id,
        token
    });
    await resetPassowrdToken.save();
}


export { register, login };

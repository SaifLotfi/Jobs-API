import { StatusCodes } from 'http-status-codes';
import User from '../models/User.js';
import {
    BadRequestError,
    NotFoundError,
    UnauthenticatedError,
} from '../errors/index.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import Token from '../models/Token.js';
import sendEmail from '../util/sendEmail.js';

const generateResetPWToken = async(userId)=>{
    console.log('ahpe');
    let token = await Token.findOne({ userId});
    if (token) {
        await token.remove();
    }
    token = crypto.randomBytes(32).toString('hex');
    const hashedToken = await bcrypt.hash(token, 12);
    const resetPassowrdToken = new Token({
        userId,
        token:hashedToken,
    });
    await resetPassowrdToken.save();
    return token;
}

const register = async (req, res) => {
    const user = await User.create({ ...req.body });

    res.status(StatusCodes.CREATED).json({
        user: { name: user.name },
        token: user.createJwt(),
    });
};

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new BadRequestError('Please Provide email and password!');
    }
    const user = await User.findOne({ email });
    if (!user) {
        throw new UnauthenticatedError('Invalid Credintials!');
    }
    const isPasswordCorrect = await user.comparePasswords(password);
    if (!isPasswordCorrect) {
        throw new UnauthenticatedError('Invalid Credintials!');
    }

    res.status(StatusCodes.OK).json({
        user: { name: user.name },
        token: user.createJwt(),
    });
};

const requestResetPassword = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        throw new BadRequestError('Please Provide email!');
    }
    const user = await User.findOne({ email });
    if (!user) {
        throw new NotFoundError('User not found!');
    }
    const token = await generateResetPWToken(user._id);
    sendEmail(
        email,
        'Password Reset Request',
        `
        UserId: ${user._id} , Password Reset Token: ${token}
        `
    );
    res.status(StatusCodes.OK).json({ message: 'Reset Token Sent!' });
};

const resetPassword = async (req, res) => {
    const {userId,token,password} = req.body;
    if (!userId || !token || !password) {
        throw new BadRequestError('Please Provide all values!');
    }
    const storedToken = await Token.findOne({userId});
    if (!storedToken) {
        throw new NotFoundError('Invalid or expired password reset token!');
    }
    const isTokenValid = await bcrypt.compare(token, storedToken.token);
    if (!isTokenValid) {
        throw new NotFoundError('Invalid or expired password reset token!');
    }
    storedToken.deleteOne();
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.findByIdAndUpdate(userId, {$set:{password:hashedPassword}},{new:true});
    sendEmail(user.email, 'Password Reset Successful', 'Your password has been reset successfully!');
    res.status(StatusCodes.OK).json({ message: 'Password Updated!' });
}


export { register, login, requestResetPassword,resetPassword,generateResetPWToken };

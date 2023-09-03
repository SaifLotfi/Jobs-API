import jwt from 'jsonwebtoken';
import { UnauthenticatedError } from '../errors/index.js';
import User from '../models/User.js';

const isAuth = (req, res, next) => {

    const authToken = req.get('Authorization').split(' ')[1];
    if (!authToken) {
        throw new UnauthenticatedError('No Token Provided!');
    }

    try {
        const decodedToken = jwt.verify(authToken, process.env.JWT_SECRET);
        req.user = {userId:decodedToken.userId,name:decodedToken.name};
        next();
    } catch (err) {
        
        throw new UnauthenticatedError('Authentication Invalid!');
    }
};
export default isAuth;
import jwt from 'jsonwebtoken';
import { UnauthenticatedError } from '../errors/index.js';

const isAuth = (req, res, next) => {
    let authToken;
    const authHeader = req.get('Authorization');
    if (authHeader) {
        authToken = authHeader.split(' ')[1];
    }
    if (!authToken) {
        throw new UnauthenticatedError('No Token Provided!');
    }

    try {
        const decodedToken = jwt.verify(authToken, process.env.JWT_SECRET);
        req.user = { userId: decodedToken.userId, name: decodedToken.name };
        next();
    } catch (err) {
        throw new UnauthenticatedError('Authentication Invalid!');
    }
};
export default isAuth;

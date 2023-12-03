import isAuth from '../../middleware/authentication.js';
import jwt from 'jsonwebtoken';
import { UnauthenticatedError } from '../../errors/index.js';
import User from '../../models/User.js';
describe.only('isAuth', () => {
    beforeEach(() => {
        jest.restoreAllMocks();
    });
    it('should decode the token and attach the user to the request object if authenticated,then call next function', () => {
        const req = {
            get: jest.fn().mockReturnValue('Bearer token'),
        };
        const mockJwtVerify = jest.spyOn(jwt, 'verify');
        mockJwtVerify.mockReturnValue({ userId: '123', name: 'test' });
        const res = {};
        const next = jest.fn();
        isAuth(req, res, next);
        expect(req.user).toBeDefined();
        expect(req.user).toMatchObject({ userId: '123', name: 'test' });
        expect(next).toHaveBeenCalled();
    });

    it('should throw an error if the token is not provided', () => {
        const req = {
            get: jest.fn().mockReturnValue('Bearer '),
        };
        // expect(()=>isAuth(req, {}, ()=>{})).toThrow(UnauthenticatedError);
        expect(isAuth.bind(this, req, {}, () => {})).toThrow(
            UnauthenticatedError
        );
    });

    it('should throw an error if token is invalid', () => {
        const req = {
            get: jest.fn().mockReturnValue('Bearer token'),
        };
        // const mockJwtVerify = jest.spyOn(jwt, 'verify');
        // mockJwtVerify.mockImplementation(() => {
        //     throw new Error();
        // });
        const res = {};
        expect(isAuth.bind(this, req, res, () => {})).toThrow(
            UnauthenticatedError
        );
    });
});

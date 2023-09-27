import {
    login,
    register,
    requestResetPassword,
    
} from '../controllers/auth.js';
import * as authModule from '../controllers/auth.js';
import User from '../models/User.js';
import Token from '../models/Token.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { StatusCodes } from 'http-status-codes';
import {
    BadRequestError,
    UnauthenticatedError,
    NotFoundError,
} from '../errors/index.js';
import sendEmail from '../util/sendEmail.js';
jest.mock('../util/sendEmail.js', () => ({
    __esModule: true, // this property makes it work
    default: jest.fn(),
}));

describe('Auth Controller', () => {
    describe('register', () => {
        const createdUser = {
            name: 'test',
            email: 'testing@email.com',
            password: 'testingeverytime',
            createJwt: jest.fn().mockReturnValue('jwt'),
        };
        const mockCreateUser = jest.spyOn(User, 'create');
        mockCreateUser.mockResolvedValue(createdUser);
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const req = {
            body: {
                name: 'test',
                email: 'testing@email.com',
                password: 'testingeverytime',
            },
        };
        it('should create a new user', async () => {
            await register(req, res);
            expect(mockCreateUser).toHaveBeenCalledWith({ ...req.body });
            expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
            expect(res.json).toHaveBeenCalledWith({
                user: { name: createdUser.name },
                token: createdUser.createJwt(),
            });
        });
    });

    describe('login', () => {
        const name = 'test';
        const email = 'XXXXXXXXXXXXXXXXX';
        const password = 'XXXXXXXXXXXXXXXX';
        const createdUser = {
            name: 'test',
            email: 'XXXXXXXXXXXXXXXXX',
            password: 'XXXXXXXXXXXXXXXX',
            createJwt: jest.fn().mockReturnValue('jwt'),
            comparePasswords: jest.fn().mockResolvedValue(true),
        };
        const mockFindUser = jest.spyOn(User, 'findOne');
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        let req = {
            body: {
                email: 'XXXXXXXXXXXXXXXXX',
                password: 'XXXXXXXXXXXXXXXX',
            },
        };
        it('should login a user', async () => {
            mockFindUser.mockResolvedValue(createdUser);
            await login(req, res);
            expect(mockFindUser).toHaveBeenCalledWith({ email });
            expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
            expect(res.json).toHaveBeenCalledWith({
                user: { name: createdUser.name },
                token: createdUser.createJwt(),
            });
        });

        it('should throw an error if user was not found', async () => {
            mockFindUser.mockResolvedValue(null);
            expect(login(req, res)).rejects.toThrow(UnauthenticatedError);
        });
        it('should throw an error if password was incorrect', async () => {
            createdUser.comparePasswords.mockResolvedValue(false);
            mockFindUser.mockResolvedValue(createdUser);
            expect(login(req, res)).rejects.toThrow(UnauthenticatedError);
        });
        it('should throw an error if password or email were not provided in the request', async () => {
            req = { body: {} };
            expect(login(req, res)).rejects.toThrow(BadRequestError);
        });
    });

    describe('generateResetPWToken', () => {
        afterEach(() => {
            jest.restoreAllMocks();
        });
        it('should generate reset password token', async () => {
            // Mock Token.findOne to return null (no existing token)
            jest.spyOn(Token, 'findOne').mockResolvedValue(null);
            jest.spyOn(Token.prototype, 'save').mockResolvedValue(null);

            // Mock crypto.randomBytes to return a known token value
            const randomBytesSpy = jest
                .spyOn(crypto, 'randomBytes')
                .mockReturnValue(
                    Buffer.from(
                        '4f29ee632e64ad60efc2a48c601f3da872e30262a31a4581a2b869df1b827133'
                    )
                );

            // Mock bcrypt.hash to return a known hashed token value
            const bcryptHashSpy = jest
                .spyOn(bcrypt, 'hash')
                .mockResolvedValue('hashedToken');

            // Call the generateResetPWToken function
            const userId = '650ec9cb8cfed0e4b30a202a';
            const token = await generateResetPWToken(userId);

            // Assertions
            expect(token).toBe(
                '34663239656536333265363461643630656663326134386336303166336461383732653330323632613331613435383161326238363964663162383237313333'
            );

            // Verify function calls
            expect(Token.findOne).toHaveBeenCalledWith({ userId });
            expect(randomBytesSpy).toHaveBeenCalledWith(32);
            expect(bcryptHashSpy).toHaveBeenCalledWith(token, 12);
            expect(Token.prototype.save).toHaveBeenCalled();
        });
    });

    describe.only('requestResetPassword', () => {
        beforeEach(() => {
            jest.restoreAllMocks();
        });
        it('should throw an error if email was not provided in the request', async () => {
            const req = { body: {} };
            expect(requestResetPassword(req, {})).rejects.toThrow(
                BadRequestError
            );
        });
        it('should throw an error if there was no such user with this email', async () => {
            const mockFindUser = jest.spyOn(User, 'findOne');
            mockFindUser.mockResolvedValue(null);
            const req = { body: { email: 'x@x.com' } };
            expect(requestResetPassword(req, {})).rejects.toThrow(
                NotFoundError
            );
        });
        it.only('should send an email and return success message', async () => {//not working
            const user = { _id: 'userID' };
            const mockFindUser = jest.spyOn(User, 'findOne');
            mockFindUser.mockResolvedValue(user);
            jest.spyOn(authModule,'generateResetPWToken').mockImplementation(() => 'token');
            // const mockGenerateResetPWToken = jest.spyOn(authModule,'generateResetPWToken');
            // mockGenerateResetPWToken.mockImplementation(() => 'token');
            // jest.mock('../controllers/auth.js');
            // authModule.generateResetPWToken.mockResolvedValue('token');
            // jest.mock('../controllers/auth.js', () => {
            //     const originalModule = jest.requireActual('../foo-bar-baz');
            //     return {
            //         __esModule: true,
            //         ...originalModule,
            //         generateResetPWToken: jest.fn().mockResolvedValue('token'),
            //     };
            // });
            // const ape = await generateResetPWToken();
            // console.log(ape)

            
            

            const req = { body: { email: 'x@x.com' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            await requestResetPassword(req, res);
            // expect(async()=>{await requestResetPassword(req, res)}).not.toThrow(Error);
            expect(mockFindUser).toHaveBeenCalledWith({ email: 'x@x.com' });
            expect(mockGenerateResetPWToken).toHaveBeenCalledWith(user._id);
            expect(sendEmail).toHaveBeenCalledWith(
                req.body.email,
                'Password Reset Request',
                `
                UserId: ${user._id} , Password Reset Token: token
                `
            );
            expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Reset Token Sent!',
            });
        });
    });
});

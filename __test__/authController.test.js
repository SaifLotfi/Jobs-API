import { login, register } from '../controllers/auth.js';
import User from '../models/User.js';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, UnauthenticatedError } from '../errors/index.js';
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
        })
        it('should throw an error if password or email were not provided in the request', async () => {
            req = { body: {} };
            expect(login(req, res)).rejects.toThrow(BadRequestError);
        });
    });
});

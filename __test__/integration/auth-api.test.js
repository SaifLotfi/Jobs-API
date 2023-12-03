import User from '../../models/User.js';
import request from 'supertest';
import server from '../../app.js';
import mongoose from '../../config/config.js';
import Token from '../../models/Token.js';
import { generateResetPWToken } from '../../controllers/auth.js';
jest.setTimeout(40000);

beforeEach(async () => {
    await Token.deleteMany();
    await User.deleteMany();
});
afterAll(async () => {
    await Token.deleteMany();
    await User.deleteMany();
    server.close();
    await mongoose.disconnect();
});
describe('Register Testing', () => {
    it('should register the user and giveback 201 status code', async () => {
        const res = await request(server)
            .post('/api/v1/auth/register')
            .send({
                name: 'user',
                email: 'user@email.com',
                password: 'password',
            })
            .expect(201);
        expect(res.body.user.name).toMatch('user');
        expect(res.body.token).toMatch('');
    });
    it('should throw an error if any of the required user fields is missing', async () => {
        const res = await request(server)
            .post('/api/v1/auth/register')
            .send({
                name: 'user',
            })
            .expect(400);
        expect(res.body.msg).toMatch('is required!');
    });
});

describe('Login Testing', () => {
    it('should log the user in and giveback 201 status code', async () => {
        const user = await User.create({
            name: 'ape',
            email: 'ape@email.com',
            password: 'IamTheApe',
        });
        const res = await request(server)
            .post('/api/v1/auth/login')
            .send({
                email: 'ape@email.com',
                password: 'IamTheApe',
            })
            .expect(200);
        expect(res.body.user.name).toMatch('ape');
        expect(res.body.token).toMatch('');
    });
    it('should throw an error if the email or password are missing', async () => {
        const res = await request(server)
            .post('/api/v1/auth/login')
            .send({
                email: 'ape@email.com',
            })
            .expect(400);
        expect(res.body.msg).toMatch('Please Provide');
    });
    it('should throw an error if the email or password are wrong', async () => {
        const res = await request(server)
            .post('/api/v1/auth/login')
            .send({
                email: 'aper@email.com',
                password: 'helko',
            })
            .expect(401);
        expect(res.body.msg).toMatch('Invalid');
    });
});

describe('Request Reset Password Testing', () => {
    it('should log the user in and giveback 201 status code', async () => {
        const user = await User.create({
            name: 'ape',
            email: 'ape@email.com',
            password: 'IamTheApe',
        });
        const res = await request(server)
            .post('/api/v1/auth/reset-password')
            .send({
                email: 'ape@email.com',
            })
            .expect(200);
        expect(res.body.message).toMatch('Token Sent!');
    });
    it('should throw an error if the email is missing', async () => {
        const res = await request(server)
            .post('/api/v1/auth/reset-password')
            .expect(400);
        expect(res.body.msg).toMatch('Please Provide email!');
    });
    it('should throw an error if the email is not found', async () => {
        const res = await request(server)
            .post('/api/v1/auth/reset-password')
            .send({
                email: 'aper@email.com',
            })
            .expect(404);
        expect(res.body.msg).toMatch('User not found');
    });
});

describe('Reset Password Testing', () => {
    it('should reset the password', async () => {
        const user = await User.create({
            name: 'ape',
            email: 'ape@email.com',
            password: 'IamTheApe',
        });
        const token = await generateResetPWToken(user._id);
        const res2 = await request(server)
            .patch('/api/v1/auth/reset-password')
            .send({
                userId: user._id,
                token,
                password: 'new ape',
            })
            .expect(200);
        expect(res2.body.message).toMatch('Updated');
    });
    it('should throw an error if the email,token or password is missing',async()=>{
        const res = await request(server)
            .patch('/api/v1/auth/reset-password')
            .send({
                userId: 'dummy',
            })
        expect(res.body.msg).toMatch('Please Provide ')
    });
    it('should throw an error if the tokne is not found or expired',async()=>{
        const res = await request(server)
            .patch('/api/v1/auth/reset-password')
            .send({
                userId: '64ef02811ad65ee89abd5da3',
                token:'hehe',
                password:'stop being an ape'
            })
        expect(res.body.msg).toMatch('Invalid or expired ')
    });
});

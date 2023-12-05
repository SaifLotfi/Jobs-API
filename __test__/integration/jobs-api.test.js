import User from '../../models/User.js';
import request from 'supertest';
import server from '../../app.js';
import mongoose from '../../config/config.js';
import Job from '../../models/Job.js';
let user;
let authRes;
beforeAll(async () => {
    authRes = await request(server)
        .post('/api/v1/auth/register')
        .send({
            name: 'user',
            email: 'user@email.com',
            password: 'password',
        })
        .expect(201);
});
beforeEach(async () => {
    await Job.deleteMany();
});
afterAll(async () => {
    await User.deleteMany();
    await Job.deleteMany();
    server.close();
    await mongoose.disconnect();
});

describe('Create Job', () => {
    it('should create a job and return 200 status code.', async () => {
        const job = { company: 'Jobify', position: 'backend-dev' };
        const res = await request(server)
            .post('/api/v1/jobs')
            .set('Authorization', 'Bearer ' + authRes.body.token)
            .send(job)
            .expect(201);
        expect(res.body.job).toMatchObject(job);
    });
    it('should throw a bad request error if any of the required fields are missing.', async () => {
        const res = await request(server)
            .post('/api/v1/jobs')
            .set('Authorization', 'Bearer ' + authRes.body.token)
            .send({ position: 'backend-dev' })
            .expect(400);
    });
});

describe('Get Job', () => {
    it('should return the job object and 200 status code ', async () => {
        const user = await User.findOne({ name: authRes.body.user.name });
        const job = await Job.create({
            company: 'comp',
            position: 'pos',
            createdBy: user._id,
        });
        const res = await request(server)
            .get(`/api/v1/jobs/${job._id}`)
            .set('Authorization', 'Bearer ' + authRes.body.token)
            .expect(200);
        expect(res.body.job).toMatchObject({
            company: job.company,
        });
    });
    it('should throw not found error if the id of the job is not found', async () => {
        const res = await request(server)
            .get(`/api/v1/jobs/64eda921249a6be22ce5cbc6`)
            .set('Authorization', 'Bearer ' + authRes.body.token)
            .expect(404);
    });
});

describe('Update Job', () => {
    it('should update the job and give back 200 status code', async () => {
        const user = await User.findOne({ name: authRes.body.user.name });
        const job = await Job.create({
            company: 'comp',
            position: 'pos',
            createdBy: user._id,
        });
        const res = await request(server)
            .patch(`/api/v1/jobs/${job._id}`)
            .set('Authorization', 'Bearer ' + authRes.body.token)
            .send({
                company: 'comp2',
                position: 'pos2',
            })
            .expect(200);
        expect(res.body.job).toMatchObject({
            company: 'comp2',
            position: 'pos2',
        });
    });
    it('should return a badrequest error if the required fields are sent empty', async () => {
        const user = await User.findOne({ name: authRes.body.user.name });
        const job = await Job.create({
            company: 'comp',
            position: 'pos',
            createdBy: user._id,
        });
        const res = await request(server)
            .patch(`/api/v1/jobs/${job._id}`)
            .set('Authorization', 'Bearer ' + authRes.body.token)
            .send({
                company: '',
            })
            .expect(400);
    });
    it('should return a notfound error if the job is not found', async () => {
        const res = await request(server)
            .patch(`/api/v1/jobs/64eda921249a6be22ce5cbc6`)
            .set('Authorization', 'Bearer ' + authRes.body.token)
            .send({
                company: 'asdf',
                position: 'asdfas',
            })
            .expect(404);
    });
});

describe('Delete Job', () => {
    it('should delete the job and give back 200 status code', async () => {
        const user = await User.findOne({ name: authRes.body.user.name });
        const job = await Job.create({
            company: 'comp',
            position: 'pos',
            createdBy: user._id,
        });
        const res = await request(server)
            .delete(`/api/v1/jobs/${job._id}`)
            .set('Authorization', 'Bearer ' + authRes.body.token)
            .expect(200);
    });
    it('should return a notfound error if the job is not found', async () => {
        const res = await request(server)
            .delete(`/api/v1/jobs/64eda921249a6be22ce5cbc6`)
            .set('Authorization', 'Bearer ' + authRes.body.token)
            .expect(404);
    });
});

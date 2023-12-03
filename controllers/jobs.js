import { StatusCodes } from 'http-status-codes';
import Job from '../models/Job.js';
import { BadRequestError, NotFoundError } from '../errors/index.js';

const getAllJobs = async (req, res) => {
    const jobs = await Job.find({ createdBy: req.user.userId }).sort(
        'createdAt'
    );
    res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};

const getJob = async (req, res) => {
    const {
        user: { userId },
        params: { id: jobId },
    } = req;
    const job = await Job.findOne({ _id: jobId, createdBy: userId });
    if (!job) {
        throw new NotFoundError(`no such job with id : ${jobId}`);
    }
    res.status(StatusCodes.OK).json({ job });
};

const createJob = async (req, res) => {
    req.body.createdBy = req.user.userId;
    const job = new Job(req.body);

    await job.save();

    res.status(StatusCodes.CREATED).json({ job });
};

const updateJob = async (req, res) => {
    const {
        body: { company, position },
        user: { userId },
        params: { id: jobId },
    } = req;

    if (company === '' || position === '') {
        throw new BadRequestError(
            'Company Or Position Fields cannot be Empty!'
        );
    }

    const job = await Job.findOneAndUpdate(
        { _id: jobId, createdBy: userId },
        req.body,
        { new: true, runValidators: true }
    );

    if (!job) {
        throw new NotFoundError(`no such job with id : ${jobId}`);
    }

    res.status(StatusCodes.OK).json({ job });
};

const deleteJob = async (req, res) => {
    const {
        user: { userId },
        params: { id: jobId },
    } = req;

    const job = await Job.findOneAndRemove({ _id: jobId, createdBy: userId });

    if (!job) {
        throw new NotFoundError(`no such job with id : ${jobId}`);
    }

    res.status(StatusCodes.OK).send();
};

export { getAllJobs, getJob, createJob, updateJob, deleteJob };

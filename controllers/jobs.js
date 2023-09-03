import { StatusCodes } from "http-status-codes";
import Job from "../models/Job.js";

const getAllJobs = async (req, res) => {
    res.send('get all jobs');
};

const getJob = async (req, res) => {
    res.send('get job');
};

const createJob = async (req, res) => {
    req.body.createdBy = req.user.userId;
    const job = new Job(req.body);
    
    await job.save();
    
    res.status(StatusCodes.CREATED).json({job});
};

const updateJob = async (req, res) => {
    res.send('update job');
};

const deleteJob = async (req, res) => {
    res.send('delete job');
};

export { getAllJobs, getJob, createJob, updateJob, deleteJob };

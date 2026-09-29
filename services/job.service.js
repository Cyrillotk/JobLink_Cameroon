const Job = require('../models/Job');
const jobRepo = require('../repositories/job.repository');

class ServiceError extends Error {}

async function createJob(employerId, data) {
  try {
    return await jobRepo.create({ ...data, employer: employerId });
  } catch (err) {
    if (err.code === 11000) {
      throw new ServiceError('You already have a listing with this title and location.');
    }
    throw err;
  }
}

async function updateJob(job, data) {
  Object.assign(job, data);
  await job.save();
  return job;
}

async function deleteJob(jobId) {
  return jobRepo.deleteById(jobId);
}

async function getOwnedJob(jobId, employerId) {
  const job = await Job.findById(jobId);
  if (!job) throw new ServiceError('That listing does not exist.');
  if (job.employer.toString() !== employerId) {
    throw new ServiceError('You do not have access to that listing.');
  }
  return job;
}

module.exports = { createJob, updateJob, deleteJob, getOwnedJob, ServiceError };
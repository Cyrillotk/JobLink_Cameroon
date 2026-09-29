const Job = require('../models/Job');
const Application = require('../models/Application');
const applicationRepo = require('../repositories/application.repository');

class ServiceError extends Error {}

async function apply(jobSeekerId, jobId, coverLetter) {
  const job = await Job.findById(jobId);
  if (!job) throw new ServiceError('That listing does not exist.');
  if (!job.isOpen) throw new ServiceError('This listing is no longer accepting applications.');

  const already = await applicationRepo.existsForJobSeekerAndJob(jobSeekerId, jobId);
  if (already) throw new ServiceError('You have already applied to this job.');

  try {
    return await applicationRepo.create({ jobSeeker: jobSeekerId, job: jobId, coverLetter });
  } catch (err) {
    if (err.code === 11000) {
      throw new ServiceError('You have already applied to this job.');
    }
    throw err;
  }
}

async function setStatus(applicationId, employerId, status) {
  const application = await Application.findById(applicationId).populate('job');
  if (!application) throw new ServiceError('That application does not exist.');
  if (application.job.employer.toString() !== employerId) {
    throw new ServiceError('You do not have access to that application.');
  }
  application.status = status;
  await application.save();
  return application;
}

module.exports = { apply, setStatus, ServiceError };
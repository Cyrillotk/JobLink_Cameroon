const Employer = require('../models/Employer');
const JobSeeker = require('../models/JobSeeker');

class ServiceError extends Error {}

async function updateEmployerProfile(employerId, data) {
  const employer = await Employer.findById(employerId);
  if (!employer) throw new ServiceError('Company profile not found.');
  Object.assign(employer, data);
  await employer.save();
  return employer;
}

async function updateJobSeekerProfile(jobSeekerId, data) {
  const seeker = await JobSeeker.findById(jobSeekerId);
  if (!seeker) throw new ServiceError('Profile not found.');
  Object.assign(seeker, data);
  await seeker.save();
  return seeker;
}

module.exports = { updateEmployerProfile, updateJobSeekerProfile, ServiceError };
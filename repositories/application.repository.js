const Application = require('../models/Application');

module.exports = {
  create: (data) => Application.create(data),
  findById: (id) => Application.findById(id).populate('job').populate('jobSeeker'),
  findByJobSeeker: (jobSeekerId) =>
    Application.find({ jobSeeker: jobSeekerId }).sort({ createdAt: -1 }).populate('job', 'title location'),
  findByJob: (jobId) =>
    Application.find({ job: jobId }).sort({ createdAt: -1 }).populate('jobSeeker', 'name email skills'),
  existsForJobSeekerAndJob: (jobSeekerId, jobId) =>
    Application.exists({ jobSeeker: jobSeekerId, job: jobId }),
};
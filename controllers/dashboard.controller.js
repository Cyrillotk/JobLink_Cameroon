const Job = require('../models/Job');
const Employer = require('../models/Employer');
const JobSeeker = require('../models/JobSeeker');
const Application = require('../models/Application');
const { ROLES } = require('../config/constants');

async function show(req, res, next) {
  try {
    const user = req.session.user;
    let stats = [];
    let recent = [];

    if (user.role === ROLES.EMPLOYER) {
      const jobIds = await Job.find({ employer: user.employerId }).distinct('_id');
      const [open, applications, shortlisted] = await Promise.all([
        Job.countDocuments({ employer: user.employerId, status: 'active' }),
        Application.countDocuments({ job: { $in: jobIds } }),
        Application.countDocuments({ job: { $in: jobIds }, status: 'Shortlisted' }),
      ]);
      stats = [
        { label: 'Open listings', value: open },
        { label: 'Applications received', value: applications },
        { label: 'Shortlisted', value: shortlisted },
      ];
      recent = await Application.find({ job: { $in: jobIds } })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('job', 'title')
        .populate('jobSeeker', 'name');
    } else if (user.role === ROLES.JOBSEEKER) {
      const [openJobs, sent, pending] = await Promise.all([
        Job.countDocuments({ status: 'active', deadline: { $gte: new Date() } }),
        Application.countDocuments({ jobSeeker: user.jobSeekerId }),
        Application.countDocuments({ jobSeeker: user.jobSeekerId, status: 'Pending' }),
      ]);
      stats = [
        { label: 'Opportunities open now', value: openJobs },
        { label: 'Applications sent', value: sent },
        { label: 'Awaiting a reply', value: pending },
      ];
      recent = await Application.find({ jobSeeker: user.jobSeekerId })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('job', 'title');
    } else {
      const [jobs, employers, seekers, applications] = await Promise.all([
        Job.countDocuments(),
        Employer.countDocuments(),
        JobSeeker.countDocuments(),
        Application.countDocuments(),
      ]);
      stats = [
        { label: 'Jobs', value: jobs },
        { label: 'Employers', value: employers },
        { label: 'Job seekers', value: seekers },
        { label: 'Applications', value: applications },
      ];
    }

    res.render('dashboard', { title: 'Dashboard', stats, recent });
  } catch (err) {
    next(err);
  }
}

module.exports = { show };
const Job = require('../models/Job');
const jobRepo = require('../repositories/job.repository');
const applicationRepo = require('../repositories/application.repository');
const jobService = require('../services/job.service');
const { JOB_TYPES, LOCATIONS, ROLES } = require('../config/constants');

async function index(req, res, next) {
  try {
    const { q, location, type } = req.query;
    const filter = { status: 'active', deadline: { $gte: new Date() } };
    if (location) filter.location = location;
    if (type) filter.type = type;
    if (q) filter.$text = { $search: q };

    const jobs = await Job.find(filter)
      .sort({ createdAt: -1 })
      .populate('employer', 'companyName location')
      .limit(50);

    res.render('jobs/index', { title: 'Browse jobs', jobs, JOB_TYPES, LOCATIONS, query: req.query });
  } catch (err) {
    next(err);
  }
}

async function mine(req, res, next) {
  try {
    const jobs = await jobRepo.findByEmployer(req.session.user.employerId);
    res.render('jobs/mine', { title: 'My listings', jobs });
  } catch (err) {
    next(err);
  }
}

function showNew(req, res) {
  const formData = req.session.formData || {};
  delete req.session.formData;
  res.render('jobs/new', { title: 'Post a job', JOB_TYPES, LOCATIONS, formData });
}

async function create(req, res, next) {
  try {
    await jobService.createJob(req.session.user.employerId, {
      title: req.body.title,
      description: req.body.description,
      requirements: req.body.requirements,
      location: req.body.location,
      type: req.body.type,
      deadline: req.body.deadline,
    });
    req.session.success = 'Listing published.';
    res.redirect('/jobs/mine');
  } catch (err) {
    if (err instanceof jobService.ServiceError) {
      req.session.error = err.message;
      req.session.formData = req.body;
      return res.redirect('/jobs/new');
    }
    next(err);
  }
}

async function show(req, res, next) {
  try {
    const job = await jobRepo.findById(req.params.id);
    if (!job) {
      return res.status(404).render('error', {
        title: 'Not found',
        status: 404,
        message: 'That listing does not exist.',
      });
    }

    let alreadyApplied = false;
    let applications = null;
    const user = req.session.user;

    if (user && user.role === ROLES.JOBSEEKER) {
      alreadyApplied = !!(await applicationRepo.existsForJobSeekerAndJob(user.jobSeekerId, job._id));
    }
    if (user && user.role === ROLES.EMPLOYER && job.employer._id.toString() === user.employerId) {
      applications = await applicationRepo.findByJob(job._id);
    }

    res.render('jobs/show', { title: job.title, job, alreadyApplied, applications });
  } catch (err) {
    next(err);
  }
}

async function showEdit(req, res, next) {
  try {
    const job = await jobService.getOwnedJob(req.params.id, req.session.user.employerId);
    res.render('jobs/edit', { title: 'Edit listing', job, JOB_TYPES, LOCATIONS });
  } catch (err) {
    if (err instanceof jobService.ServiceError) {
      req.session.error = err.message;
      return res.redirect('/jobs/mine');
    }
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const job = await jobService.getOwnedJob(req.params.id, req.session.user.employerId);
    await jobService.updateJob(job, {
      title: req.body.title,
      description: req.body.description,
      requirements: req.body.requirements,
      location: req.body.location,
      type: req.body.type,
      deadline: req.body.deadline,
      status: req.body.status,
    });
    req.session.success = 'Listing updated.';
    res.redirect('/jobs/mine');
  } catch (err) {
    if (err instanceof jobService.ServiceError) {
      req.session.error = err.message;
      return res.redirect('/jobs/mine');
    }
    next(err);
  }
}

async function destroy(req, res, next) {
  try {
    const job = await jobService.getOwnedJob(req.params.id, req.session.user.employerId);
    await jobService.deleteJob(job._id);
    req.session.success = 'Listing removed.';
    res.redirect('/jobs/mine');
  } catch (err) {
    if (err instanceof jobService.ServiceError) {
      req.session.error = err.message;
      return res.redirect('/jobs/mine');
    }
    next(err);
  }
}

module.exports = { index, mine, showNew, create, show, showEdit, update, destroy };
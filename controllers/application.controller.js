const applicationService = require('../services/application.service');
const applicationRepo = require('../repositories/application.repository');
const { ROLES } = require('../config/constants');

async function apply(req, res, next) {
  try {
    await applicationService.apply(req.session.user.jobSeekerId, req.params.jobId, req.body.coverLetter);
    req.session.success = 'Application sent.';
    res.redirect(`/jobs/${req.params.jobId}`);
  } catch (err) {
    if (err instanceof applicationService.ServiceError) {
      req.session.error = err.message;
      return res.redirect(`/jobs/${req.params.jobId}`);
    }
    next(err);
  }
}

async function mine(req, res, next) {
  try {
    const applications = await applicationRepo.findByJobSeeker(req.session.user.jobSeekerId);
    res.render('applications/mine', { title: 'My applications', applications });
  } catch (err) {
    next(err);
  }
}

async function show(req, res, next) {
  try {
    const application = await applicationRepo.findById(req.params.id);
    if (!application) {
      return res.status(404).render('error', {
        title: 'Not found',
        status: 404,
        message: 'That application does not exist.',
      });
    }

    const user = req.session.user;
    const isOwner =
      (user.role === ROLES.JOBSEEKER && application.jobSeeker._id.toString() === user.jobSeekerId) ||
      (user.role === ROLES.EMPLOYER && application.job.employer.toString() === user.employerId);

    if (!isOwner) {
      return res.status(403).render('error', {
        title: 'Not allowed',
        status: 403,
        message: 'You do not have access to that application.',
      });
    }

    res.render('applications/show', { title: 'Application', application });
  } catch (err) {
    next(err);
  }
}

async function updateStatus(req, res, next) {
  try {
    const application = await applicationService.setStatus(
      req.params.id,
      req.session.user.employerId,
      req.body.status
    );
    req.session.success = 'Status updated.';
    res.redirect(`/jobs/${application.job._id}`);
  } catch (err) {
    if (err instanceof applicationService.ServiceError) {
      req.session.error = err.message;
      return res.redirect('/jobs/mine');
    }
    next(err);
  }
}

module.exports = { apply, mine, show, updateStatus };
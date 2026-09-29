const Employer = require('../models/Employer');
const JobSeeker = require('../models/JobSeeker');
const profileService = require('../services/profile.service');
const { ROLES, LOCATIONS } = require('../config/constants');

async function show(req, res, next) {
  try {
    const user = req.session.user;

    if (user.role === ROLES.EMPLOYER) {
      const employer = await Employer.findById(user.employerId);
      return res.render('profile/employer', { title: 'My company profile', employer, LOCATIONS });
    }
    if (user.role === ROLES.JOBSEEKER) {
      const seeker = await JobSeeker.findById(user.jobSeekerId);
      return res.render('profile/jobseeker', { title: 'My profile', seeker });
    }
    res.redirect('/dashboard');
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const user = req.session.user;

    if (user.role === ROLES.EMPLOYER) {
      await profileService.updateEmployerProfile(user.employerId, {
        companyName: req.body.companyName,
        phone: req.body.phone,
        location: req.body.location,
        description: req.body.description,
      });
      req.session.user.displayName = req.body.companyName;
    } else if (user.role === ROLES.JOBSEEKER) {
      const skills = (req.body.skills || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      await profileService.updateJobSeekerProfile(user.jobSeekerId, {
        name: req.body.name,
        phone: req.body.phone,
        skills,
        education: req.body.education,
        experience: req.body.experience,
      });
      req.session.user.displayName = req.body.name;
    }

    req.session.success = 'Profile updated.';
    res.redirect('/profile');
  } catch (err) {
    if (err instanceof profileService.ServiceError) {
      req.session.error = err.message;
      return res.redirect('/profile');
    }
    next(err);
  }
}

module.exports = { show, update };
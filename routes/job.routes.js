const express = require('express');
const router = express.Router();
const controller = require('../controllers/job.controller');
const applicationController = require('../controllers/application.controller');
const { requireRole } = require('../middleware/auth');
const { validate, isFilled, isFutureDate } = require('../middleware/validate');
const { ROLES } = require('../config/constants');

const validateJob = validate((body) => {
  const errors = [];
  if (!isFilled(body.title)) errors.push('Title is required.');
  if (!isFilled(body.description)) errors.push('Description is required.');
  if (!isFilled(body.location)) errors.push('Location is required.');
  if (!isFilled(body.type)) errors.push('Job type is required.');
  if (!isFilled(body.deadline) || !isFutureDate(body.deadline)) {
    errors.push('Deadline must be a future date.');
  }
  return errors;
});

const validateApplication = validate((body) => {
  const errors = [];
  if (!body.coverLetter || body.coverLetter.trim().length < 20) {
    errors.push('Write at least 20 characters in your cover letter.');
  }
  return errors;
});

router.get('/jobs', controller.index);
router.get('/jobs/mine', requireRole(ROLES.EMPLOYER), controller.mine);
router.get('/jobs/new', requireRole(ROLES.EMPLOYER), controller.showNew);
router.post('/jobs', requireRole(ROLES.EMPLOYER), validateJob, controller.create);
router.get('/jobs/:id', controller.show);
router.get('/jobs/:id/edit', requireRole(ROLES.EMPLOYER), controller.showEdit);
router.put('/jobs/:id', requireRole(ROLES.EMPLOYER), validateJob, controller.update);
router.delete('/jobs/:id', requireRole(ROLES.EMPLOYER), controller.destroy);

router.post(
  '/jobs/:jobId/apply',
  requireRole(ROLES.JOBSEEKER),
  validateApplication,
  applicationController.apply
);

module.exports = router;
const express = require('express');
const router = express.Router();
const controller = require('../controllers/profile.controller');
const { requireAuth } = require('../middleware/auth');
const { validate, isFilled } = require('../middleware/validate');

const validateProfile = validate((body) => {
  const errors = [];
  if (body.companyName !== undefined && !isFilled(body.companyName)) {
    errors.push('Company name is required.');
  }
  if (body.name !== undefined && !isFilled(body.name)) {
    errors.push('Full name is required.');
  }
  return errors;
});

router.get('/profile', requireAuth, controller.show);
router.put('/profile', requireAuth, validateProfile, controller.update);

module.exports = router;
const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth.controller');
const { requireGuest, requireAuth } = require('../middleware/auth');
const { validate, isEmail, isFilled, minLen } = require('../middleware/validate');
const { ROLES } = require('../config/constants');

const validateRegister = validate((body) => {
  const errors = [];
  if (!minLen(body.username, 3)) errors.push('Username must be at least 3 characters.');
  if (!isEmail(body.email)) errors.push('Enter a valid email address.');
  if (!minLen(body.password, 8)) errors.push('Password must be at least 8 characters.');
  if (body.password !== body.confirmPassword) errors.push('The two passwords do not match.');
  if (![ROLES.EMPLOYER, ROLES.JOBSEEKER].includes(body.role)) {
    errors.push('Choose whether you are hiring or looking for work.');
  }
  if (body.role === ROLES.EMPLOYER) {
    if (!isFilled(body.companyName)) errors.push('Company name is required.');
    if (!isFilled(body.location)) errors.push('Company location is required.');
  }
  if (body.role === ROLES.JOBSEEKER && !isFilled(body.name)) {
    errors.push('Your full name is required.');
  }
  return errors;
});

const validateLogin = validate((body) => {
  const errors = [];
  if (!isFilled(body.identifier)) errors.push('Enter your email or username.');
  if (!isFilled(body.password)) errors.push('Enter your password.');
  return errors;
});

router.get('/register', requireGuest, controller.showRegister);
router.post('/register', requireGuest, validateRegister, controller.register);
router.get('/login', requireGuest, controller.showLogin);
router.post('/login', requireGuest, validateLogin, controller.login);
router.post('/logout', requireAuth, controller.logout);

module.exports = router;
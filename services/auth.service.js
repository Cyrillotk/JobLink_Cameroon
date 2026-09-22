const mongoose = require('mongoose');
const User = require('../models/User');
const Employer = require('../models/Employer');
const JobSeeker = require('../models/JobSeeker');
const userRepo = require('../repositories/user.repository');
const { ROLES } = require('../config/constants');

class ServiceError extends Error {}

// Creates the account and its matching profile in one transaction-like flow.
async function register({ username, email, password, role, companyName, name, location }) {
  if (await userRepo.findByEmail(email)) {
    throw new ServiceError('That email is already registered.');
  }
  if (await userRepo.findByUsername(username)) {
    throw new ServiceError('That username is taken.');
  }

  const passwordHash = await User.hashPassword(password);
  const user = await userRepo.create({ username, email, passwordHash, role });

  try {
    if (role === ROLES.EMPLOYER) {
      await Employer.create({
        owner: user._id,
        companyName,
        email: user.email,
        location,
      });
    } else if (role === ROLES.JOBSEEKER) {
      await JobSeeker.create({
        user: user._id,
        name,
        email: user.email,
      });
    }
  } catch (err) {
    await User.deleteOne({ _id: user._id });
    throw err;
  }

  return user;
}

async function login(identifier, password) {
  const user = await userRepo.findByEmailOrUsername(identifier);
  // Same message either way, so the form cannot be used to discover accounts.
  if (!user) throw new ServiceError('Those sign-in details did not match an account.');
  if (user.status !== 'active') throw new ServiceError('That account is suspended.');

  const ok = await user.verifyPassword(password);
  if (!ok) throw new ServiceError('Those sign-in details did not match an account.');

  return user;
}

// The only place the session shape is defined.
async function sessionPayload(user) {
  const payload = {
    id: user._id.toString(),
    username: user.username,
    email: user.email,
    role: user.role,
  };

  if (user.role === ROLES.EMPLOYER) {
    const employer = await Employer.findOne({ owner: user._id }).select('_id companyName');
    if (employer) {
      payload.employerId = employer._id.toString();
      payload.displayName = employer.companyName;
    }
  } else if (user.role === ROLES.JOBSEEKER) {
    const seeker = await JobSeeker.findOne({ user: user._id }).select('_id name');
    if (seeker) {
      payload.jobSeekerId = seeker._id.toString();
      payload.displayName = seeker.name;
    }
  }

  payload.displayName = payload.displayName || user.username;
  return payload;
}

module.exports = { register, login, sessionPayload, ServiceError };

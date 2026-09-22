const authService = require('../services/auth.service');
const { ROLES, LOCATIONS } = require('../config/constants');

function showRegister(req, res) {
  const formData = req.session.formData || {};
  delete req.session.formData;
  res.render('auth/register', {
    title: 'Create an account',
    roles: ROLES,
    locations: LOCATIONS,
    formData,
  });
}

async function register(req, res, next) {
  try {
    const user = await authService.register({
      username: req.body.username.trim(),
      email: req.body.email.trim(),
      password: req.body.password,
      role: req.body.role,
      companyName: req.body.companyName,
      name: req.body.name,
      location: req.body.location,
    });

    req.session.user = await authService.sessionPayload(user);
    req.session.success = 'Account created. Welcome to JobLink.';
    res.redirect('/dashboard');
  } catch (err) {
    if (err instanceof authService.ServiceError) {
      req.session.error = err.message;
      req.session.formData = req.body;
      return res.redirect('/register');
    }
    next(err);
  }
}

function showLogin(req, res) {
  res.render('auth/login', { title: 'Sign in' });
}

async function login(req, res, next) {
  try {
    const user = await authService.login(req.body.identifier, req.body.password);
    req.session.user = await authService.sessionPayload(user);
    const target = req.session.returnTo || '/dashboard';
    delete req.session.returnTo;
    req.session.success = `Signed in as ${req.session.user.displayName}.`;
    res.redirect(target);
  } catch (err) {
    if (err instanceof authService.ServiceError) {
      req.session.error = err.message;
      return res.redirect('/login');
    }
    next(err);
  }
}

function logout(req, res) {
  req.session.destroy(() => {
    res.clearCookie('joblink.sid');
    res.redirect('/login');
  });
}

module.exports = { showRegister, register, showLogin, login, logout };

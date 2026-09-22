const { ROLES } = require('../config/constants');

// Makes the signed-in user and flash messages available to every EJS view.
function locals(req, res, next) {
  res.locals.currentUser = req.session.user || null;
  res.locals.ROLES = ROLES;
  res.locals.success = req.session.success || null;
  res.locals.error = req.session.error || null;
  delete req.session.success;
  delete req.session.error;
  next();
}

function requireAuth(req, res, next) {
  if (!req.session.user) {
    req.session.error = 'Sign in to continue.';
    req.session.returnTo = req.originalUrl;
    return res.redirect('/login');
  }
  next();
}

function requireRole(...allowed) {
  return (req, res, next) => {
    if (!req.session.user) {
      req.session.error = 'Sign in to continue.';
      return res.redirect('/login');
    }
    if (!allowed.includes(req.session.user.role)) {
      return res.status(403).render('error', {
        title: 'Not allowed',
        status: 403,
        message: 'Your account does not have access to that page.',
      });
    }
    next();
  };
}

// Keeps signed-in users away from the sign-in and register pages.
function requireGuest(req, res, next) {
  if (req.session.user) return res.redirect('/dashboard');
  next();
}

module.exports = { locals, requireAuth, requireRole, requireGuest };

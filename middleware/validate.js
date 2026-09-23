const { LOCATIONS } = require('../config/constants');

const isEmail = (v) => typeof v === 'string' && /^\S+@\S+\.\S+$/.test(v.trim());
const isFilled = (v) => typeof v === 'string' && v.trim().length > 0;
const minLen = (v, n) => typeof v === 'string' && v.trim().length >= n;
const isFutureDate = (v) => {
  const d = new Date(v);
  return !Number.isNaN(d.valueOf()) && d > new Date();
};

function validate(fn) {
  return (req, res, next) => {
    const errors = fn(req.body);
    if (errors.length) {
      req.session.error = errors.join(' ');
      req.session.formData = req.body;
      return res.redirect('back');
    }
    next();
  };
}

module.exports = { isEmail, isFilled, minLen, isFutureDate, validate, LOCATIONS };
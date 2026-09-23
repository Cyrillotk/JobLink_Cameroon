const express = require('express');
const router = express.Router();
const dashboard = require('../controllers/dashboard.controller');
const { requireAuth } = require('../middleware/auth');

router.get('/', (req, res) => {
  if (req.session.user) return res.redirect('/dashboard');
  res.render('home', { title: 'Jobs and internships in Cameroon' });
});

router.get('/dashboard', requireAuth, dashboard.show);

module.exports = router;
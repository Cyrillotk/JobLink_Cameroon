const express = require('express');
const router = express.Router();
const controller = require('../controllers/application.controller');
const { requireRole } = require('../middleware/auth');
const { ROLES } = require('../config/constants');

router.get('/applications', requireRole(ROLES.JOBSEEKER), controller.mine);
router.get('/applications/:id', requireRole(ROLES.JOBSEEKER, ROLES.EMPLOYER), controller.show);
router.put('/applications/:id/status', requireRole(ROLES.EMPLOYER), controller.updateStatus);

module.exports = router;
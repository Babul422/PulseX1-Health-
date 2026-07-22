const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

router.get('/', (req, res) => res.redirect('/dashboard/patient'));
router.get('/:role', dashboardController.renderDashboard);

module.exports = router;

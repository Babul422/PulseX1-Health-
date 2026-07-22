const express = require('express');
const router = express.Router();
const volunteerController = require('../controllers/volunteerController');

router.get('/', volunteerController.getAllVolunteers);
router.put('/:id/status', volunteerController.updateStatus);

module.exports = router;

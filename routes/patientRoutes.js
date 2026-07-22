const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const { authenticateUser } = require('../middleware/authMiddleware');

router.get('/profile', authenticateUser, patientController.getMyProfile);
router.put('/profile', authenticateUser, patientController.updateProfile);

module.exports = router;

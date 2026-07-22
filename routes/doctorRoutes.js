const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const { authenticateUser } = require('../middleware/authMiddleware');

router.get('/', doctorController.getAllDoctors);
router.get('/:id', doctorController.getDoctorById);
router.put('/:id/status', authenticateUser, doctorController.updateStatus);

module.exports = router;

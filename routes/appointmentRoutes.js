const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { authenticateUser } = require('../middleware/authMiddleware');

router.post('/', authenticateUser, appointmentController.create);
router.get('/patient/:patientId', authenticateUser, appointmentController.getPatientAppointments);
router.get('/doctor/:doctorId', authenticateUser, appointmentController.getDoctorAppointments);
router.put('/:id/status', authenticateUser, appointmentController.updateStatus);

module.exports = router;

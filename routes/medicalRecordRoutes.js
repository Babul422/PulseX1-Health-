const express = require('express');
const router = express.Router();
const medicalRecordController = require('../controllers/medicalRecordController');
const { authenticateUser } = require('../middleware/authMiddleware');

router.post('/', authenticateUser, medicalRecordController.createRecord);
router.get('/patient/:patientId', authenticateUser, medicalRecordController.getPatientRecords);

module.exports = router;

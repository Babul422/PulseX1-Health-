const express = require('express');
const router = express.Router();
const hospitalController = require('../controllers/hospitalController');
const { authenticateUser } = require('../middleware/authMiddleware');

router.get('/', hospitalController.getAllHospitals);
router.get('/ambulances', hospitalController.getAllAmbulances);
router.get('/:id', hospitalController.getHospitalById);
router.put('/:id/beds', authenticateUser, hospitalController.updateBeds);
router.get('/:id/bloodbanks', hospitalController.getBloodBanks);
router.put('/bloodbanks/:bloodBankId', authenticateUser, hospitalController.updateBloodInventory);
router.put('/ambulances/:ambulanceId/status', authenticateUser, hospitalController.updateAmbulanceStatus);

module.exports = router;

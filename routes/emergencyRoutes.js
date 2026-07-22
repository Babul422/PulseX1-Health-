const express = require('express');
const router = express.Router();
const emergencyController = require('../controllers/emergencyController');

router.post('/sos', emergencyController.triggerSOS);
router.post('/', emergencyController.triggerSOS);
router.get('/', emergencyController.getAllRequests);
router.get('/:id', emergencyController.getRequestById);
router.put('/:id/status', emergencyController.updateStatus);

module.exports = router;

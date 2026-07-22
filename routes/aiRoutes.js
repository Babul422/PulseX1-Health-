const express = require('express');
const router = express.Router();
const triageController = require('../controllers/triageController');
const { validateTriageInput } = require('../middleware/validation');

router.post('/triage', validateTriageInput, triageController.analyzeTriage);

module.exports = router;

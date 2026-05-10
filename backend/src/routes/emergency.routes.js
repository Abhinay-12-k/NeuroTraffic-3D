const express = require('express');
const router = express.Router();
const emergencyController = require('../controllers/emergency.controller');

router.get('/status', emergencyController.getStatus);
router.post('/trigger', emergencyController.triggerEmergency);
router.post('/clear', emergencyController.clearEmergency);
router.get('/history', emergencyController.getHistory);

module.exports = router;

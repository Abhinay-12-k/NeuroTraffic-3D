const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics.controller');

router.get('/stats', analyticsController.getStats);
router.get('/prediction', analyticsController.getPrediction);
router.get('/heatmap', analyticsController.getHeatmap);
router.get('/waiting-times', analyticsController.getWaitingTimes);

module.exports = router;

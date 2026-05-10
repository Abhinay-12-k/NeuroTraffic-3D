const express = require('express');
const router = express.Router();
const trafficController = require('../controllers/traffic.controller');

router.get('/current', trafficController.getCurrentTraffic);
router.get('/history', trafficController.getHistory);

module.exports = router;

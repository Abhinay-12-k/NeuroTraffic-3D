const express = require('express');
const router = express.Router();
const signalController = require('../controllers/signal.controller');

router.get('/current', signalController.getCurrentSignals);
router.post('/override', signalController.overrideSignal);

module.exports = router;

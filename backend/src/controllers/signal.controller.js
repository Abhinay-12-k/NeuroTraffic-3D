const signalOptimizer = require('../services/signalOptimizer');

const getCurrentSignals = (req, res) => {
  res.json(signalOptimizer.getCurrentState());
};

const overrideSignal = (req, res) => {
  const { lane, color, duration } = req.body;
  if (!lane || !color || !duration) {
    return res.status(400).json({ error: 'Missing lane, color, or duration' });
  }
  signalOptimizer.setManualOverride(lane, color, duration);
  res.json({ success: true, message: `Overridden ${lane} to ${color} for ${duration}s` });
};

module.exports = { getCurrentSignals, overrideSignal };

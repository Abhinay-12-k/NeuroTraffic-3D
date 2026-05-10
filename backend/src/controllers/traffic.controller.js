const trafficSimulator = require('../services/trafficSimulator');
const firebaseService = require('../services/firebaseService');

const getCurrentTraffic = (req, res) => {
  res.json(trafficSimulator.getCurrentState());
};

const getHistory = async (req, res) => {
  try {
    const history = await firebaseService.getHistory(24);
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getCurrentTraffic, getHistory };

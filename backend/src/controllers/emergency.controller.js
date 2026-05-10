const trafficSimulator = require('../services/trafficSimulator');
const firebaseService = require('../services/firebaseService');

const getStatus = (req, res) => {
  const lanes = trafficSimulator.lanes;
  let hasEmergency = false;
  let activeLanes = [];
  
  Object.keys(lanes).forEach(lane => {
    if (lanes[lane].vehicles.ambulance) {
      hasEmergency = true;
      activeLanes.push(lane);
    }
  });

  res.json({ hasEmergency, activeLanes });
};

const triggerEmergency = (req, res) => {
  const { lane } = req.body;
  if (!lane) return res.status(400).json({ error: 'Lane required' });
  
  trafficSimulator.triggerEmergency(lane);
  res.json({ success: true, message: `Emergency triggered on ${lane}` });
};

const clearEmergency = (req, res) => {
  const { lane } = req.body;
  if (!lane) return res.status(400).json({ error: 'Lane required' });
  
  trafficSimulator.clearEmergency(lane);
  res.json({ success: true, message: `Emergency cleared on ${lane}` });
};

const getHistory = async (req, res) => {
  try {
    const history = await firebaseService.getEmergencyEvents(20);
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getStatus, triggerEmergency, clearEmergency, getHistory };

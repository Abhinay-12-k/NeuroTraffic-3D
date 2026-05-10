const trafficSimulator = require('../services/trafficSimulator');
const axios = require('axios');

const getStats = (req, res) => {
  const state = trafficSimulator.getCurrentState();
  if (!state) return res.status(503).json({ error: 'Simulation not initialized' });
  
  res.json({
    totalVehicles: state.aggregates.totalVehicles,
    avgWaitTime: state.aggregates.avgWaitTime,
    emissionLevel: state.aggregates.co2Saved
  });
};

const getPrediction = async (req, res) => {
  const state = trafficSimulator.getCurrentState();
  if (!state) return res.status(503).json({ error: 'Simulation not initialized' });
  
  const northLane = state.lanes.NORTH;
  try {
    const response = await axios.post(`${process.env.AI_SERVICE_URL || 'http://localhost:8000'}/predict`, {
      hour: new Date().getHours(),
      day_of_week: new Date().getDay(),
      vehicle_count: northLane.totalVehicles,
      density: northLane.density,
      trend: 1,
      is_rush_hour: state.mode === 'NORMAL' // rough approximation
    });
    res.json(response.data);
  } catch (error) {
    res.status(200).json({ congestion_level: 1, predicted_peak_in_minutes: 30 }); // Silent fallback
  }
};

const getHeatmap = (req, res) => {
  const state = trafficSimulator.getCurrentState();
  if (!state) return res.json([]);
  
  const heatmapData = Object.keys(state.lanes).map(lane => ({
    lane,
    density: state.lanes[lane].density,
    count: state.lanes[lane].totalVehicles
  }));
  res.json(heatmapData);
};

const getWaitingTimes = (req, res) => {
  const state = trafficSimulator.getCurrentState();
  if (!state) return res.json([]);
  
  const waitData = Object.keys(state.lanes).map(lane => ({
    lane,
    waitTime: state.lanes[lane].avgWaitTime
  }));
  res.json(waitData);
};

module.exports = { getStats, getPrediction, getHeatmap, getWaitingTimes };

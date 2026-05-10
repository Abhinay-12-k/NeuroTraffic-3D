const express = require('express');
const cors = require('cors');
require('dotenv').config();

const trafficRoutes = require('./routes/traffic.routes');
const signalRoutes = require('./routes/signal.routes');
const emergencyRoutes = require('./routes/emergency.routes');
const analyticsRoutes = require('./routes/analytics.routes');

const app = express();

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/traffic', trafficRoutes);
app.use('/api/signals', signalRoutes);
app.use('/api/emergency', emergencyRoutes);
app.use('/api/analytics', analyticsRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ status: 'error', message: err.message });
});

module.exports = app;

const trafficSimulator = require('./trafficSimulator');
const signalOptimizer = require('./signalOptimizer');

// Persistent vehicle registry — vehicles keep their identity across cycles
const vehicleRegistry = {
  NORTH: [],
  SOUTH: [],
  EAST: [],
  WEST: []
};

const VEHICLE_COLORS = ['#00D4FF', '#00FF88', '#FFD700', '#9D4EDD', '#ffffff', '#FF6B6B', '#4ECDC4', '#45B7D1'];
const VEHICLE_TYPES_PROB = ['car', 'car', 'car', 'car', 'car', 'bus', 'truck', 'car'];
const SPACING = 0.06; // space between vehicles in laneProgress units

function updateVehiclePhysics(laneKey, laneState, signalData) {
  const targetCount = Math.min(laneState.vehicleCount, 25); // Max 25 rendered vehicles per lane
  let vehicles = vehicleRegistry[laneKey];
  const isGreen  = signalData.color === 'green';
  const isYellow = signalData.color === 'yellow';

  // 1. Remove vehicles that have fully exited
  vehicles = vehicles.filter(v => v.laneProgress < 2.0);

  // 2. If we have fewer vehicles than target, spawn new ones AT THE BACK OF QUEUE
  while (vehicles.length < targetCount) {
    const backProgress = vehicles.length === 0
      ? 0.95  // First vehicle goes to stop line
      : vehicles[vehicles.length - 1].laneProgress - SPACING; // Each one further back

    // Don't spawn off-screen
    if (backProgress < 0.02) break;

    vehicles.push({
      id: `${laneKey}_${Math.random().toString(36).substr(2, 9)}`,
      type: VEHICLE_TYPES_PROB[Math.floor(Math.random() * VEHICLE_TYPES_PROB.length)],
      laneProgress: Math.max(0.02, backProgress),
      state: 'stopped',
      speed: 0,
      color: VEHICLE_COLORS[Math.floor(Math.random() * VEHICLE_COLORS.length)]
    });
  }

  // 3. If we have MORE vehicles than target (queue draining on green), just let exits handle it
  // 4. Update positions
  vehicles.forEach((v, i) => {
    const frontVehicle = i === 0 ? null : vehicles[i - 1];
    const frontProgress = frontVehicle ? frontVehicle.laneProgress : (isGreen ? 2.5 : 0.95);
    const maxProgress   = frontProgress - SPACING;

    if (isGreen) {
      // All vehicles try to advance
      const newProgress = v.laneProgress + 0.035;
      v.laneProgress = Math.min(newProgress, maxProgress);
      v.state = v.laneProgress > 1.0 ? 'crossing' : 'moving';
      v.speed = 0.035;
    } else if (isYellow) {
      // Slow advance if not yet at stop line
      if (v.laneProgress < 0.93) {
        const newProgress = v.laneProgress + 0.015;
        v.laneProgress = Math.min(newProgress, Math.min(0.93, maxProgress));
        v.state = 'approaching';
        v.speed = 0.015;
      } else {
        v.state = 'stopped';
        v.speed = 0;
      }
    } else {
      // RED: advance to queue position but STOP at stop line
      const stopAt = Math.min(0.95 - (i * SPACING), maxProgress);
      if (v.laneProgress < stopAt - 0.001) {
        // Slide forward to fill gap
        v.laneProgress = Math.min(v.laneProgress + 0.02, stopAt);
        v.state = 'approaching';
        v.speed = 0.02;
      } else {
        v.state = 'stopped';
        v.speed = 0;
      }
    }
  });

  vehicleRegistry[laneKey] = vehicles;
  return vehicles;
}

const INSIGHT_TEMPLATES = [
  (lane, density) => `${lane} lane at ${Math.round(density * 100)}% capacity — extending green phase.`,
  (lane, wait) => `${lane} queue building — avg wait ${Math.round(wait)}s. Preemption triggered.`,
  (lane) => `AI routing ${lane} traffic via adaptive cycle adjustment.`,
  (lane, density) => density > 0.7 ? `Critical congestion on ${lane} — priority override active.` : `${lane} flow optimal — maintaining current phase.`,
  (lane, wait) => `Starvation prevention: ${lane} granted priority after ${Math.round(wait)}s wait.`,
  () => `Eco mode active — reducing idle emissions across all lanes.`,
  (lane) => `Signal synchronization optimized for ${lane} corridor.`,
];

function generateInsights(lanes, signals) {
  const laneKeys = Object.keys(lanes);
  const insights = [];
  const used = new Set();

  // Sort by congestion
  const sorted = laneKeys.sort((a, b) => lanes[b].density - lanes[a].density);

  sorted.slice(0, 3).forEach((lane, idx) => {
    const laneData = lanes[lane];
    const templateIdx = (idx * 2 + Math.floor(Date.now() / 10000)) % INSIGHT_TEMPLATES.length;
    const key = `${templateIdx}`;
    if (!used.has(key)) {
      used.add(key);
      insights.push({
        message: INSIGHT_TEMPLATES[templateIdx](lane, laneData.density, laneData.waitTime),
        severity: laneData.density > 0.7 ? 'critical' : laneData.density > 0.4 ? 'warning' : 'info',
        timestamp: new Date().toISOString()
      });
    }
  });

  // Add signal phase insight
  insights.push({
    message: `Active phase: ${signals.currentPhase} — ${signals.mode} mode, cycle optimized.`,
    severity: 'info',
    timestamp: new Date().toISOString()
  });

  return insights.slice(0, 5);
}

function calculateAggregates(lanes) {
  let totalVehicles = 0;
  let totalWait = 0;
  let maxDensity = 0;
  let peakLane = 'NORTH';

  Object.keys(lanes).forEach(laneKey => {
    const lane = lanes[laneKey];
    totalVehicles += lane.vehicleCount;
    totalWait += lane.waitTime;
    if (lane.density > maxDensity) {
      maxDensity = lane.density;
      peakLane = laneKey;
    }
  });

  const avgWaitTime = totalWait / 4;
  const optimizationScore = Math.max(0, Math.min(100, Math.round(100 - (maxDensity * 40) - (avgWaitTime * 0.3))));
  const co2Saved = parseFloat((totalVehicles * 0.12).toFixed(2));

  return { totalVehicles, avgWaitTime: parseFloat(avgWaitTime.toFixed(1)), optimizationScore, co2Saved, emissionRate: 0.045, peakLane };
}

function buildGlobalState() {
  const traffic = trafficSimulator.getCurrentState();
  const signals = signalOptimizer.getCurrentState();

  const lanes = {};
  Object.keys(traffic.lanes).forEach(laneKey => {
    const laneData = traffic.lanes[laneKey];
    const signalData = signals.signals[laneKey];

    const vehiclePositions = updateVehiclePhysics(laneKey, laneData, signalData);

    lanes[laneKey] = {
      id: laneKey,
      totalVehicles: laneData.vehicleCount,
      waitingVehicles: vehiclePositions.filter(v => v.state === 'stopped').length,
      movingVehicles: vehiclePositions.filter(v => v.state !== 'stopped').length,
      vehicleTypes: {
        cars: laneData.vehicles.cars,
        buses: laneData.vehicles.buses,
        trucks: laneData.vehicles.trucks,
        motorcycles: laneData.vehicles.bikes
      },
      signal: signalData.color.toUpperCase(),
      signalTimeRemaining: Math.max(0, signalData.timeRemaining),
      nextSignal: 'GREEN',
      density: laneData.density,
      avgWaitTime: laneData.waitTime,
      throughput: signalData.color === 'green' ? 30 : 0,
      queueLength: laneData.vehicleCount * 5,
      vehiclePositions: vehiclePositions.map(v => ({ ...v, targetSpeed: 0.04, queueIndex: 0, scale: [1,1,1] }))
    };
  });

  const emergencyLane = Object.keys(traffic.lanes).find(l => traffic.lanes[l].vehicles.ambulance) || null;

  return {
    timestamp: Date.now(),
    junctionId: 'alpha',
    mode: signals.mode === 'emergency' ? 'EMERGENCY' : 'NORMAL',
    lanes,
    emergency: {
      active: !!emergencyLane,
      lane: emergencyLane,
      vehicleType: 'ambulance',
      corridorActive: !!emergencyLane,
      timeRemaining: emergencyLane ? 15 : 0,
      ambulanceProgress: emergencyLane ? 0.5 : 0
    },
    aggregates: calculateAggregates(traffic.lanes),
    insights: generateInsights(traffic.lanes, signals),
    currentPhase: signals.currentPhase || 'NORTH',
    cycleProgress: 0.5,
    cycleMode: signals.mode === 'emergency' ? 'EMERGENCY' : 'NORMAL'
  };
}

module.exports = { buildGlobalState };

const firebaseService = require('./firebaseService');

const LANES = ['NORTH', 'SOUTH', 'EAST', 'WEST'];

// Persistent Map to ensure absolute vehicle identity
let vehicleMap = new Map();

let laneStates = {
  NORTH: { signal: 'GREEN', timeRemaining: 25 },
  SOUTH: { signal: 'RED',   timeRemaining: 25 },
  EAST:  { signal: 'RED',   timeRemaining: 25 },
  WEST:  { signal: 'RED',   timeRemaining: 25 },
};

// Simulation Constants
const MAX_SPEED = 0.005; 
const MIN_GAP = 0.18; 
const STOP_LINE = 0.85; 
const EXIT_LINE = 3.5; 

let currentGreenLane = 'NORTH';
let greenPhaseIndex = 0;
const PHASE_ORDER = ['NORTH', 'SOUTH', 'EAST', 'WEST'];
let phaseTimer = 25;

function updateSimulation() {
  const allVehs = Array.from(vehicleMap.values());
  
  // Check for newly spawned ambulances to log the emergency event once
  allVehs.forEach(v => {
    if (v.type === 'ambulance' && !v.detected) {
      v.detected = true;
      // Note: Signal logic is handled in tickSignals continuously to prevent it from dropping
    }
  });

  LANES.forEach(lane => {
    const laneVehs = allVehs.filter(v => v.lane === lane).sort((a, b) => b.progress - a.progress);
    const signal = laneStates[lane].signal;
    laneVehs.forEach((v, idx) => {
      const prevV = idx > 0 ? laneVehs[idx-1] : null;
      let target = MAX_SPEED;
      if (v.progress < STOP_LINE && v.progress > STOP_LINE - 0.2 && (signal === 'RED' || signal === 'YELLOW')) target = 0;
      if (prevV && (prevV.progress - v.progress) < MIN_GAP) target = 0;
      v.progress += target;
      
      // Cleanup with logging
      if (v.progress > EXIT_LINE) {
        if (v.type === 'ambulance') {
          firebaseService.saveEmergencyEvent({
            lane: v.lane,
            type: 'Ambulance',
            status: 'cleared',
            duration: '15s',
            message: 'Vehicle successfully passed junction.'
          });
        }
        vehicleMap.delete(v.id);
      }
    });
  });
}

function spawnVehicles() {
  LANES.forEach(lane => {
    const laneVehs = Array.from(vehicleMap.values()).filter(v => v.lane === lane);
    const entryVeh = laneVehs.sort((a,b) => a.progress - b.progress)[0];
    if ((!entryVeh || entryVeh.progress > 0.3) && Math.random() < 0.25) {
      const id = `veh-${lane}-${Date.now()}-${Math.floor(Math.random()*1000)}`;
      
      // 5% chance of random ambulance for AI detection demo
      const isAmbulance = Math.random() < 0.05;
      const types = ['car', 'car', 'bus', 'truck'];
      const type = isAmbulance ? 'ambulance' : types[Math.floor(Math.random()*types.length)];
      
      if (isAmbulance) {
          firebaseService.saveEmergencyEvent({
            lane: lane,
            type: 'Ambulance',
            status: 'active',
            message: 'AI detected incoming emergency vehicle.'
          });
      }

      vehicleMap.set(id, {
        id, lane, progress: 0, type,
        color: isAmbulance ? '#ffffff' : ['#00D4FF', '#FFD700', '#00FF88', '#FF6B6B', '#ffffff'][Math.floor(Math.random()*5)],
        detected: false
      });
    }
  });
}

let vipCorridorRoute = null;
let vipTimer = 0;

function tickSignals() {
  // 1. VIP Corridor has absolute highest priority
  if (vipCorridorRoute) {
    vipTimer--;
    if (vipTimer <= 0) {
      const route = vipCorridorRoute;
      vipCorridorRoute = null;
      firebaseService.saveEmergencyEvent({
        lane: route === 'ALPHA' ? 'N → S' : 'E → W',
        type: 'VIP Convoy',
        status: 'cleared',
        message: `VIP Corridor ${route} automatically cleared.`
      });
      // fall through to normal traffic logic to resume
    } else {
      if (vipCorridorRoute === 'ALPHA') {
        LANES.forEach(l => {
          laneStates[l].signal = (l === 'NORTH' || l === 'SOUTH') ? 'GREEN' : 'RED';
          laneStates[l].timeRemaining = (l === 'NORTH' || l === 'SOUTH') ? vipTimer : 0;
        });
      } else if (vipCorridorRoute === 'BETA') {
        LANES.forEach(l => {
          laneStates[l].signal = (l === 'EAST' || l === 'WEST') ? 'GREEN' : 'RED';
          laneStates[l].timeRemaining = (l === 'EAST' || l === 'WEST') ? vipTimer : 0;
        });
      }
      return; // Do not process normal phases
    }
  }

  // 2. Ambulance Priority (Green Corridor)
  const allVehs = Array.from(vehicleMap.values());
  const ambulance = allVehs.find(v => v.type === 'ambulance');
  if (ambulance) {
    // Force the green light to the ambulance's lane continuously
    currentGreenLane = ambulance.lane;
    phaseTimer = 40; // Freeze the normal cycle timer
    
    // Sync the underlying phase index so when ambulance leaves, it resumes cleanly
    greenPhaseIndex = PHASE_ORDER.indexOf(ambulance.lane);
    
    LANES.forEach(l => {
      laneStates[l].signal = (l === currentGreenLane) ? 'GREEN' : 'RED';
      laneStates[l].timeRemaining = (l === currentGreenLane) ? 99 : 0;
    });
    return;
  }

  // 3. Normal Round-Robin Phase Cycle
  phaseTimer--;
  if (phaseTimer <= 0) {
    greenPhaseIndex = (greenPhaseIndex + 1) % 4;
    currentGreenLane = PHASE_ORDER[greenPhaseIndex];
    phaseTimer = 25;
  }
  LANES.forEach(l => {
    laneStates[l].signal = (l === currentGreenLane) ? (phaseTimer < 4 ? 'YELLOW' : 'GREEN') : 'RED';
    laneStates[l].timeRemaining = (l === currentGreenLane) ? phaseTimer : 0;
  });
}

function buildGlobalState() {
  const allVehs = Array.from(vehicleMap.values());
  const totalVehicles = allVehs.length;
  
  // Generate dynamic AI insights
  const insights = [
    { 
      id: 1, 
      severity: totalVehicles > 30 ? 'critical' : (totalVehicles > 15 ? 'warning' : 'normal'),
      message: totalVehicles > 30 ? 'CRITICAL CONGESTION: AI Engine suggests forced East-West clearance.' : 
               (totalVehicles > 15 ? 'Moderate traffic detected. Optimizing green wave timings.' : 'Traffic flow optimal. Maintaining eco-mode simulation.'),
      timestamp: Date.now()
    }
  ];

  if (allVehs.some(v => v.type === 'ambulance')) {
    insights.unshift({
      id: 2,
      severity: 'critical',
      message: 'EMERGENCY DETECTED: Activating Green Corridor pre-emption.',
      timestamp: Date.now()
    });
  }

  const state = {
    timestamp: Date.now(),
    junctionId: 'ALPHA-01',
    mode: vipCorridorRoute ? 'VIP CORRIDOR' : (allVehs.some(v => v.type === 'ambulance') ? 'EMERGENCY' : 'NORMAL'),
    vipRoute: vipCorridorRoute, // crucial for frontend sync
    insights,
    lanes: {},
    aggregates: {
      totalVehicles,
      avgWaitTime: 22,
      optimizationScore: 98,
      co2Saved: 15.4,
      emissionRate: 0.02
    }
  };
  let totalWaitTime = 0;

  LANES.forEach(lane => {
    const vehs = allVehs.filter(v => v.lane === lane);
    
    // Dynamic wait time calculation based on vehicle count and signal state
    let waitTime = vehs.length * 2.5; 
    if (laneStates[lane].signal === 'RED') {
      waitTime += laneStates[lane].timeRemaining;
    }
    // Add some random jitter for realism
    waitTime += Math.floor(Math.random() * 5);
    
    totalWaitTime += waitTime;

    state.lanes[lane] = {
      id: lane,
      totalVehicles: vehs.length,
      signal: laneStates[lane].signal,
      signalTimeRemaining: laneStates[lane].timeRemaining,
      density: Math.min(1.0, vehs.length / 25),
      avgWaitTime: Math.round(waitTime),
      vehiclePositions: vehs.map(v => ({ id: v.id, type: v.type, laneProgress: v.progress, color: v.color }))
    };
  });

  state.aggregates.avgWaitTime = Math.round(totalWaitTime / 4);
  return state;
}

function startSimulation(io) {
  setInterval(updateSimulation, 1000/60);
  setInterval(() => {
    tickSignals();
    spawnVehicles();
    io.emit('state:sync', buildGlobalState());
  }, 1000);
}

module.exports = {
  startSimulation,
  triggerEmergency: (lane) => {
    const id = `amb-${Date.now()}`;
    vehicleMap.set(id, { id, lane, type: 'ambulance', progress: 0.5, color: '#ff0000', detected: false });
    currentGreenLane = lane;
    phaseTimer = 40;
    
    firebaseService.saveEmergencyEvent({
      lane: lane,
      type: 'Ambulance',
      status: 'active',
      message: 'Manual emergency override triggered.'
    });
  },
  clearEmergency: () => {
    for (const [id, v] of vehicleMap) if (v.type === 'ambulance') vehicleMap.delete(id);
  },
  triggerVipCorridor: (route) => {
    vipCorridorRoute = route;
    vipTimer = 30; // Auto-clear after 30 seconds
    firebaseService.saveEmergencyEvent({
      lane: route === 'ALPHA' ? 'N → S' : 'E → W',
      type: 'VIP Convoy',
      status: 'active',
      message: `VIP Corridor ${route} activated.`
    });
  },
  clearVipCorridor: (route) => {
    if (vipCorridorRoute === route) {
      vipCorridorRoute = null;
      firebaseService.saveEmergencyEvent({
        lane: route === 'ALPHA' ? 'N → S' : 'E → W',
        type: 'VIP Convoy',
        status: 'cleared',
        message: `VIP Corridor ${route} cleared.`
      });
    }
  },
  buildGlobalState,
  getCurrentState: buildGlobalState
};

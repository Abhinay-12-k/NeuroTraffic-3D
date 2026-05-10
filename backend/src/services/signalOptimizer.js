const EventEmitter = require('events');

class SignalOptimizer extends EventEmitter {
  constructor() {
    super();
    this.signals = {
      NORTH: { color: 'red', timeRemaining: 0 },
      SOUTH: { color: 'red', timeRemaining: 0 },
      EAST:  { color: 'red', timeRemaining: 0 },
      WEST:  { color: 'red', timeRemaining: 0 }
    };
    this.currentPhase = 'NORTH'; 
    this.mode = 'normal';
    this.predictions = { NORTH: {}, SOUTH: {}, EAST: {}, WEST: {} };
    this.starvationCounters = { NORTH: 0, SOUTH: 0, EAST: 0, WEST: 0 };
    this.isTransitioning = false;
    
    setInterval(() => this.tick(), 1000);
  }

  updatePrediction(lane, data) {
    this.predictions[lane] = data;
  }

  calculatePriorityScores(lanes) {
    const scores = {};
    const weights = {
      density: 200, // Even higher density weight for better responsiveness
      waitTime: 2.5, 
      aiPrediction: 60,
      starvation: 35
    };

    Object.keys(lanes).forEach(lane => {
      const data = lanes[lane];
      const prediction = this.predictions[lane] || { congestion_level: 0 };
      
      const densityScore = (data.density || 0) * weights.density;
      const waitScore = (data.waitTime || 0) * weights.waitTime;
      const aiScore = (prediction.congestion_level || 0) * weights.aiPrediction;
      const starvationScore = this.starvationCounters[lane] * weights.starvation;

      scores[lane] = densityScore + waitScore + aiScore + starvationScore;
    });

    return scores;
  }

  updateFromTraffic(lanes) {
    if (this.mode === 'emergency' || this.isTransitioning || this.mode === 'manual') return;
    
    let emergencyLane = null;
    Object.keys(lanes).forEach(lane => {
      if (lanes[lane].vehicles.ambulance) emergencyLane = lane;
    });

    if (emergencyLane) {
      if (this.currentPhase !== emergencyLane) this.activateEmergencyMode(emergencyLane);
      return;
    }

    const scores = this.calculatePriorityScores(lanes);
    const currentSignal = this.signals[this.currentPhase];
    const currentLaneData = lanes[this.currentPhase];

    const topLane = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
    const topScore = scores[topLane];
    const currentScore = scores[this.currentPhase] || 0;

    let shouldSwitch = currentSignal.timeRemaining <= 0;

    if (!shouldSwitch && this.currentPhase) {
      if (currentLaneData && currentLaneData.vehicleCount < 3 && topScore > currentScore + 30) {
        shouldSwitch = true;
      }
      if (topScore > currentScore + 180) { // Critical priority threshold
        shouldSwitch = true;
      }
    }

    if (shouldSwitch) {
      this.initiateSwitch(topLane, lanes);
    }
  }

  initiateSwitch(nextPhase, lanes) {
    if (nextPhase === this.currentPhase && this.signals[this.currentPhase].timeRemaining > 0) return;

    const prevPhase = this.currentPhase;
    if (prevPhase && prevPhase !== nextPhase && this.signals[prevPhase].color === 'green') {
      this.isTransitioning = true;
      this.signals[prevPhase].color = 'yellow';
      this.signals[prevPhase].timeRemaining = 3;
      
      setTimeout(() => {
        this.executeSwitch(nextPhase, lanes);
      }, 3000);
    } else {
      this.executeSwitch(nextPhase, lanes);
    }
    
    this.emitUpdate();
  }

  executeSwitch(nextPhase, lanes) {
    this.isTransitioning = false;
    const oldPhase = this.currentPhase;
    this.currentPhase = nextPhase;

    Object.keys(this.starvationCounters).forEach(l => {
      if (l === nextPhase) this.starvationCounters[l] = 0;
      else if (l !== oldPhase) this.starvationCounters[l] += 1;
    });

    const data = lanes[nextPhase] || { density: 0 };
    let greenTime = 20 + Math.floor(data.density * 40);
    if (this.predictions[nextPhase]?.congestion_level >= 2) greenTime += 15;

    Object.keys(this.signals).forEach(lane => {
      if (lane === nextPhase) {
        this.signals[lane].color = 'green';
        this.signals[lane].timeRemaining = greenTime;
      } else {
        this.signals[lane].color = 'red';
        this.signals[lane].timeRemaining = greenTime;
      }
    });

    this.emitUpdate();
  }

  tick() {
    const sig = this.signals[this.currentPhase];
    if (sig && sig.timeRemaining > 0) {
      sig.timeRemaining -= 1;
      
      if (sig.timeRemaining === 3 && sig.color === 'green' && !this.isTransitioning) {
        sig.color = 'yellow';
      }

      Object.keys(this.signals).forEach(l => {
        if (l !== this.currentPhase) this.signals[l].timeRemaining = sig.timeRemaining;
      });

      this.emitUpdate();
    }
  }

  activateEmergencyMode(lane) {
    this.mode = 'emergency';
    this.currentPhase = lane;
    this.isTransitioning = false;
    Object.keys(this.signals).forEach(l => {
      this.signals[l].color = (l === lane) ? 'green' : 'red';
      this.signals[l].timeRemaining = 60;
    });
    this.emitUpdate();
    if (this.emergencyClearTimer) clearTimeout(this.emergencyClearTimer);
    this.emergencyClearTimer = setTimeout(() => {
      this.resetToNormal();
      this.emit('emergency_resolved', { lane });
    }, 10000);
  }

  resetToNormal() {
    console.log("[AI-Optimizer] Resetting to normal mode - triggering priority re-eval");
    this.mode = 'normal';
    this.isTransitioning = false;
    if (this.currentPhase) {
      this.signals[this.currentPhase].timeRemaining = 0; // Force immediate switch check
    }
    this.emitUpdate();
  }

  setManualOverride(lane, color, duration) {
    this.mode = 'manual';
    this.currentPhase = lane;
    Object.keys(this.signals).forEach(l => {
      this.signals[l].color = (l === lane) ? color : 'red';
      this.signals[l].timeRemaining = duration;
    });
    this.emitUpdate();
    setTimeout(() => { this.resetToNormal(); }, duration * 1000);
  }

  emitUpdate() {
    this.emit('update', this.getCurrentState());
  }

  getCurrentState() {
    return {
      signals: this.signals,
      mode: this.mode,
      currentPhase: this.currentPhase,
      timestamp: new Date().toISOString()
    };
  }
}

const optimizer = new SignalOptimizer();
module.exports = optimizer;

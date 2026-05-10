export interface AIInsight {
  message: string;
  severity: 'info' | 'warning' | 'critical';
  timestamp: string;
}

export interface VehiclePhysicsState {
  id: string;
  type: 'car' | 'bus' | 'truck' | 'motorcycle' | 'ambulance';
  laneProgress: number; 
  state: 'approaching' | 'queued' | 'stopped' | 'crossing' | 'exiting' | 'moving';
  speed: number;
  targetSpeed: number;
  queueIndex: number;
  color: string;
  scale: [number, number, number];
}

export interface LaneState {
  id: 'NORTH' | 'SOUTH' | 'EAST' | 'WEST';
  totalVehicles: number;
  waitingVehicles: number;
  movingVehicles: number;
  vehicleTypes: {
    cars: number;
    buses: number;
    trucks: number;
    motorcycles: number;
  };
  signal: 'RED' | 'GREEN' | 'YELLOW';
  signalTimeRemaining: number;
  nextSignal: 'RED' | 'GREEN';
  density: number;
  avgWaitTime: number;
  throughput: number;
  queueLength: number;
  vehiclePositions: VehiclePhysicsState[];
}

export interface EmergencyState {
  active: boolean;
  lane: 'NORTH' | 'SOUTH' | 'EAST' | 'WEST' | null;
  vehicleType: 'ambulance';
  corridorActive: boolean;
  timeRemaining: number;
  ambulanceProgress: number;
}

export interface GlobalTrafficState {
  timestamp: number;
  junctionId: string;
  mode: 'NORMAL' | 'EMERGENCY' | 'ECO' | 'PEAK';
  lanes: {
    NORTH: LaneState;
    SOUTH: LaneState;
    EAST: LaneState;
    WEST: LaneState;
  };
  emergency: EmergencyState;
  aggregates: {
    totalVehicles: number;
    avgWaitTime: number;
    optimizationScore: number;
    co2Saved: number;
    emissionRate: number;
    peakLane: 'NORTH' | 'SOUTH' | 'EAST' | 'WEST';
  };
  insights: AIInsight[];
  currentPhase: string;
  cycleProgress: number;
  cycleMode: 'NORMAL' | 'EMERGENCY';
}

// COMPATIBILITY TYPES
export interface SignalState {
  signals: Record<string, { color: string; timeRemaining: number }>;
  mode: string;
  currentPhase: string;
  timestamp: string;
}

export interface TrafficState {
  lanes: Record<string, any>;
  timestamp: string;
  isRushHour: boolean;
}

export interface EmergencyAlert {
  lane: string;
  timestamp: string;
}

export interface PredictionData {
  lane: string;
  congestion: number;
  congestion_level: number;
  probability: number;
  predicted_peak_in_minutes: number;
  congestion_label: string;
  recommendation: string;
}

export type HeatmapData = any;

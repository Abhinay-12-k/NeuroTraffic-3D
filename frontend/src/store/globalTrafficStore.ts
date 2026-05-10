import { create } from 'zustand';
import type { GlobalTrafficState, LaneState } from '../types/traffic.types';

const EMPTY_AGGREGATES = {
  totalVehicles: 0,
  avgWaitTime: 0,
  optimizationScore: 0,
  co2Saved: 0,
  emissionRate: 0,
  peakLane: 'NORTH'
};

const EMPTY_EMERGENCY = {
  active: false,
  lane: null,
  progress: 0,
  corridorActive: false,
  timeRemaining: 0
};

const EMPTY_INSIGHTS: any[] = [];

interface GlobalTrafficStore {
  // THE SINGLE SOURCE OF TRUTH
  globalState: GlobalTrafficState | null;
  isConnected: boolean;
  
  // Actions
  updateState: (newState: GlobalTrafficState) => void;
  setConnected: (v: boolean) => void;
  
  // Selectors
  getLane: (lane: 'NORTH' | 'SOUTH' | 'EAST' | 'WEST') => LaneState | null;
  getSignal: (lane: 'NORTH' | 'SOUTH' | 'EAST' | 'WEST') => 'RED' | 'GREEN' | 'YELLOW';
  getSignalTime: (lane: 'NORTH' | 'SOUTH' | 'EAST' | 'WEST') => number;
  getVehicleCount: (lane: 'NORTH' | 'SOUTH' | 'EAST' | 'WEST') => number;
  getWaitTime: (lane: 'NORTH' | 'SOUTH' | 'EAST' | 'WEST') => number;
  getDensity: (lane: 'NORTH' | 'SOUTH' | 'EAST' | 'WEST') => number;
  getAggregates: () => any;
  getInsights: () => any[];
  getEmergency: () => any;
  getMode: () => 'NORMAL' | 'EMERGENCY' | 'VIP CORRIDOR';
  getCurrentPhase: () => string;
  getVipRoute: () => string | null;
}

export const useGlobalTrafficStore = create<GlobalTrafficStore>((set, get) => ({
  globalState: null,
  isConnected: false,
  
  updateState: (newState) => set({ globalState: newState, isConnected: true }),
  setConnected: (v) => set({ isConnected: v }),
  
  getLane: (lane) => get().globalState?.lanes?.[lane] ?? null,
  getSignal: (lane) => (get().globalState?.lanes?.[lane]?.signal as any) ?? 'RED',
  getSignalTime: (lane) => get().globalState?.lanes?.[lane]?.signalTimeRemaining ?? 0,
  getVehicleCount: (lane) => get().globalState?.lanes?.[lane]?.totalVehicles ?? 0,
  getWaitTime: (lane) => get().globalState?.lanes?.[lane]?.avgWaitTime ?? 0,
  getDensity: (lane) => get().globalState?.lanes?.[lane]?.density ?? 0,
  getAggregates: () => get().globalState?.aggregates ?? EMPTY_AGGREGATES,
  getInsights: () => get().globalState?.insights ?? EMPTY_INSIGHTS,
  getEmergency: () => get().globalState?.emergency ?? EMPTY_EMERGENCY,
  getMode: () => (get().globalState?.mode as any) ?? 'NORMAL',
  getCurrentPhase: () => get().globalState?.currentPhase ?? '',
  getVipRoute: () => (get().globalState as any)?.vipRoute ?? null,
}));

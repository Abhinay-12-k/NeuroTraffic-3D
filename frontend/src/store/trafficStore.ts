import { create } from 'zustand';
import type { TrafficState } from '../types/traffic.types';

interface TrafficStore {
  lanes: TrafficState['lanes'];
  lastUpdate: Date | null;
  isConnected: boolean;
  isRushHour: boolean;
  updateLanes: (data: TrafficState) => void;
  setConnectionStatus: (status: boolean) => void;
}

export const useTrafficStore = create<TrafficStore>((set) => ({
  lanes: {
    NORTH: { vehicleCount: 0, density: 0, waitTime: 0, vehicles: { cars: 0, bikes: 0, buses: 0, trucks: 0, ambulance: false } },
    SOUTH: { vehicleCount: 0, density: 0, waitTime: 0, vehicles: { cars: 0, bikes: 0, buses: 0, trucks: 0, ambulance: false } },
    EAST: { vehicleCount: 0, density: 0, waitTime: 0, vehicles: { cars: 0, bikes: 0, buses: 0, trucks: 0, ambulance: false } },
    WEST: { vehicleCount: 0, density: 0, waitTime: 0, vehicles: { cars: 0, bikes: 0, buses: 0, trucks: 0, ambulance: false } },
  },
  lastUpdate: null,
  isConnected: false,
  isRushHour: false,
  updateLanes: (data) => set({ 
    lanes: data.lanes, 
    lastUpdate: new Date(data.timestamp),
    isRushHour: data.isRushHour
  }),
  setConnectionStatus: (status) => set({ isConnected: status }),
}));

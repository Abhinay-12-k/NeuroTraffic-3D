import { create } from 'zustand';
import type { EmergencyAlert } from '../types/traffic.types';
import { socket } from '../services/socket';

interface EmergencyStore {
  isActive: boolean;
  affectedLane: string | null;
  alertHistory: EmergencyAlert[];
  triggerEmergency: (lane: string) => void;
  clearEmergency: (lane: string) => void;
  triggerVipCorridor: (route: string) => void;
  clearVipCorridor: (route: string) => void;
  setEmergencyState: (lane: string | null, isActive: boolean) => void;
  addToHistory: (alert: EmergencyAlert) => void;
}

export const useEmergencyStore = create<EmergencyStore>((set) => ({
  isActive: false,
  affectedLane: null,
  alertHistory: [],
  triggerEmergency: (lane) => {
    socket.emit('emergency:manual-trigger', { lane });
  },
  clearEmergency: (lane) => {
    socket.emit('emergency:clear', { lane });
  },
  triggerVipCorridor: (route) => {
    socket.emit('emergency:vip-trigger', { route });
  },
  clearVipCorridor: (route) => {
    socket.emit('emergency:vip-clear', { route });
  },
  setEmergencyState: (lane, isActive) => set({ affectedLane: lane, isActive }),
  addToHistory: (alert) => set((state) => ({ 
    alertHistory: [alert, ...state.alertHistory].slice(0, 50) 
  })),
}));

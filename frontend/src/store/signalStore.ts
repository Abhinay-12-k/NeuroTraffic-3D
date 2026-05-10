import { create } from 'zustand';
import type { SignalState } from '../types/traffic.types';
import { socket } from '../services/socket';

interface SignalStore extends SignalState {
  updateSignals: (data: SignalState) => void;
  overrideSignal: (lane: string, color: string, duration: number) => void;
}

export const useSignalStore = create<SignalStore>((set) => ({
  signals: {
    NORTH: { color: 'red', timeRemaining: 0, nextChange: null },
    SOUTH: { color: 'red', timeRemaining: 0, nextChange: null },
    EAST: { color: 'red', timeRemaining: 0, nextChange: null },
    WEST: { color: 'red', timeRemaining: 0, nextChange: null },
  },
  mode: 'normal',
  currentPhase: '',
  timestamp: new Date().toISOString(),
  updateSignals: (data) => set({ ...data }),
  overrideSignal: (lane, color, duration) => {
    socket.emit('signal:manual-override', { lane, color, duration });
  }
}));

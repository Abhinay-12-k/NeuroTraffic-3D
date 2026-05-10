import { useEffect } from 'react';
import { socket } from '../services/socket';
import { useGlobalTrafficStore } from '../store/globalTrafficStore';
import toast from 'react-hot-toast';

export const useSocketSetup = () => {
  const updateState = useGlobalTrafficStore(state => state.updateState);
  const setConnected = useGlobalTrafficStore(state => state.setConnected);

  useEffect(() => {
    socket.on('connect', () => {
      setConnected(true);
      console.log('✅ Connected to AI Engine:', socket.id);
    });

    socket.on('disconnect', (reason) => {
      setConnected(false);
      console.warn('❌ Disconnected from AI Engine:', reason);
    });

    socket.on('state:sync', (newState) => {
      updateState(newState);
    });

    socket.on('emergency:alert', (data) => {
      toast.error(`🚨 Emergency: ${data.lane} lane — corridor activated`, {
        duration: 3000,
        position: 'top-center'
      });
    });

    socket.on('emergency:cleared', () => {
      toast.success('✅ Emergency cleared — returning to normal mode');
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('state:sync');
      socket.off('emergency:alert');
      socket.off('emergency:cleared');
    };
  }, [updateState, setConnected]);
};

import React from 'react';
import { FuturisticButton } from '../ui/FuturisticButton';
import { Moon, Sun, ShieldAlert, Crosshair, Camera } from 'lucide-react';
import { socket } from '../../services/socket';
import { useGlobalTrafficStore } from '../../store/globalTrafficStore';

export const SimulationControls = ({ nightMode, onNightToggle, cameraPreset, onCameraChange }: any) => {
  const emergency = useGlobalTrafficStore(s => s.getEmergency());
  const globalState = useGlobalTrafficStore(s => s.globalState);

  const handleEmergency = () => {
    if (emergency.active) {
      socket.emit('emergency:clear');
    } else {
      let busiestLane = 'NORTH';
      if (globalState?.lanes) {
        busiestLane = Object.keys(globalState.lanes).reduce((a, b) => 
          (globalState.lanes[a]?.totalVehicles || 0) > (globalState.lanes[b]?.totalVehicles || 0) ? a : b
        );
      }
      socket.emit('emergency:trigger', { lane: busiestLane });
    }
  };

  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md p-4 rounded-full flex items-center gap-6 pointer-events-auto shadow-soft border border-gray-100 z-50">
      <div className="flex items-center gap-2">
        <button 
          onClick={onNightToggle} 
          className={`p-3 rounded-full transition-all ${nightMode ? 'text-sprint-gold bg-sprint-sidebar' : 'text-sprint-textMuted hover:bg-gray-100'}`}
          title="Toggle Night Mode"
        >
          {nightMode ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>

      <div className="h-6 w-px bg-gray-200"></div>

      <div className="flex items-center gap-2">
        <button 
          onClick={() => onCameraChange('overview')} 
          className={`p-3 rounded-full transition-all ${cameraPreset === 'overview' ? 'text-sprint-sidebar bg-sprint-bg' : 'text-sprint-textMuted hover:bg-gray-100'}`}
          title="Overview Camera"
        >
          <Camera size={20} />
        </button>
        <button 
          onClick={() => onCameraChange('top')} 
          className={`p-3 rounded-full transition-all ${cameraPreset === 'top' ? 'text-sprint-sidebar bg-sprint-bg' : 'text-sprint-textMuted hover:bg-gray-100'}`}
          title="Top-down Camera"
        >
          <Crosshair size={18} />
        </button>
      </div>

      <div className="h-6 w-px bg-gray-200"></div>

      <button 
        onClick={handleEmergency} 
        className={`flex items-center gap-2 font-bold px-8 py-3 rounded-full transition-all shadow-sm ${
          emergency.active 
            ? 'bg-sprint-sidebar text-white hover:bg-black' 
            : 'bg-red-500 text-white hover:bg-red-600'
        }`}
      >
        <ShieldAlert size={18} />
        <span className="uppercase tracking-widest text-[10px] font-bold">
          {emergency.active ? 'Clear Emergency' : 'Trigger Emergency'}
        </span>
      </button>
    </div>
  );
};

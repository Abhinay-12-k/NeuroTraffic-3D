import React from 'react';
import { useGlobalTrafficStore } from '../../store/globalTrafficStore';

export const TrafficHeatmap = () => {
  const getDensity = useGlobalTrafficStore(s => s.getDensity);
  
  const getIntensityColor = (density: number) => {
    if (density > 0.8) return 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]';
    if (density > 0.5) return 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]';
    return 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]';
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative">
      <div className="grid grid-cols-3 grid-rows-3 gap-2 w-28 h-28">
        <div className="col-start-2 row-start-1">
          <div className={`w-full h-full rounded-lg transition-all duration-500 ${getIntensityColor(getDensity('NORTH'))}`} />
        </div>
        <div className="col-start-1 row-start-2">
          <div className={`w-full h-full rounded-lg transition-all duration-500 ${getIntensityColor(getDensity('WEST'))}`} />
        </div>
        <div className="col-start-2 row-start-2 bg-sprint-bg rounded-lg flex items-center justify-center border border-gray-100">
           <div className="w-2 h-2 rounded-full bg-gray-200" />
        </div>
        <div className="col-start-3 row-start-2">
          <div className={`w-full h-full rounded-lg transition-all duration-500 ${getIntensityColor(getDensity('EAST'))}`} />
        </div>
        <div className="col-start-2 row-start-3">
          <div className={`w-full h-full rounded-lg transition-all duration-500 ${getIntensityColor(getDensity('SOUTH'))}`} />
        </div>
      </div>
      
      {/* Legend */}
      <div className="absolute top-0 right-0 flex flex-col gap-0.5">
        <div className="flex items-center gap-1 text-[7px] font-bold text-sprint-textMuted uppercase tracking-widest">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500" /> Crit
        </div>
        <div className="flex items-center gap-1 text-[7px] font-bold text-sprint-textMuted uppercase tracking-widest">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Mod
        </div>
        <div className="flex items-center gap-1 text-[7px] font-bold text-sprint-textMuted uppercase tracking-widest">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500" /> Norm
        </div>
      </div>
    </div>
  );
};

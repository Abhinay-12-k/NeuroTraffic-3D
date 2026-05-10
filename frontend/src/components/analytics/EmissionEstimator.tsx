import React from 'react';
import { GlowCard } from '../ui/GlowCard';
import { useGlobalTrafficStore } from '../../store/globalTrafficStore';

export const EmissionEstimator = () => {
  const getAggregates = useGlobalTrafficStore(s => s.getAggregates);
  const aggregates = getAggregates();
  const totalVehicles = aggregates?.totalVehicles || 0;
  
  const emissionLevel = (totalVehicles * 0.05).toFixed(2);
  const saved = (Number(emissionLevel) * 0.15).toFixed(2); 

  return (
    <div className="h-80 flex flex-col bg-white rounded-[2.5rem] shadow-soft p-8 relative overflow-hidden">
      <h2 className="text-xl font-title font-bold italic text-sprint-sidebar mb-6 uppercase tracking-tight">EMISSION ESTIMATOR</h2>
      
      <div className="flex-1 flex flex-col justify-center items-center relative">
        <div className="w-36 h-36 rounded-full border-4 border-sprint-bg flex items-center justify-center relative overflow-hidden shadow-inner">
          <div 
            className="absolute bottom-0 w-full bg-green-500/10 transition-all duration-1000"
            style={{ height: `${Math.min((Number(emissionLevel) / 5) * 100, 100)}%` }}
          />
          <div className="text-center z-10">
            <div className="text-3xl font-title font-bold italic text-sprint-sidebar">{emissionLevel}</div>
            <div className="text-[10px] font-bold text-sprint-textMuted uppercase tracking-widest">kg CO2</div>
          </div>
        </div>
      </div>

      <div className="mt-4 bg-green-50 border border-green-100 rounded-2xl p-4 text-center shadow-sm">
        <div className="text-[9px] font-bold text-green-700 uppercase tracking-widest mb-1">AI Saved Today</div>
        <div className="text-xl font-title font-bold italic text-green-800">{saved} kg CO2</div>
      </div>
    </div>
  );
};

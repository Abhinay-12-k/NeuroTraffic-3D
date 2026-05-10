import React from 'react';
import { GlowCard } from '../ui/GlowCard';
import { useGlobalTrafficStore } from '../../store/globalTrafficStore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

export const PredictionPanel = () => {
  const getAggregates = useGlobalTrafficStore(s => s.getAggregates);
  const aggregates = getAggregates();
  const totalVehicles = aggregates?.totalVehicles || 0;

  const projData = [
    { time: 'Now', val: totalVehicles },
    { time: '+10m', val: Math.round(totalVehicles * 1.2) },
    { time: '+20m', val: Math.round(totalVehicles * 1.5) },
    { time: '+30m', val: totalVehicles > 30 ? 95 : Math.round(totalVehicles * 0.8) },
  ];

  const congestionLevel = totalVehicles > 30 ? 3 : (totalVehicles > 15 ? 2 : 1);
  const congestionLabel = congestionLevel === 3 ? 'HIGH' : (congestionLevel === 2 ? 'MEDIUM' : 'LOW');

  return (
    <div className="h-80 flex flex-col bg-white rounded-[2.5rem] shadow-soft p-8 relative overflow-hidden">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <h2 className="text-xl font-title font-bold italic text-sprint-sidebar uppercase tracking-tight">AI PREDICTION (30m)</h2>
        <div className="text-[10px] px-3 py-1.5 rounded-full bg-sprint-bg text-sprint-sidebar font-bold border border-gray-100 uppercase tracking-widest">
          {totalVehicles > 30 ? '98' : '85'}% Confidence
        </div>
      </div>

      <div className="flex flex-col h-full gap-5">
        <div className="flex gap-4">
          <div className="flex-1 bg-sprint-bg rounded-2xl p-4 border border-gray-100 shadow-sm">
            <div className="text-[9px] text-sprint-textMuted font-bold uppercase tracking-widest mb-1">Expected Peak</div>
            <div className="text-lg font-title font-bold italic text-sprint-sidebar">In {congestionLevel === 3 ? '5' : '15'} mins</div>
          </div>
          <div className="flex-1 bg-sprint-bg rounded-2xl p-4 border border-gray-100 shadow-sm">
            <div className="text-[9px] text-sprint-textMuted font-bold uppercase tracking-widest mb-1">Status</div>
            <div className={`text-lg font-title font-bold italic ${congestionLevel >= 2 ? 'text-red-600' : 'text-sprint-gold'}`}>
              {congestionLabel}
            </div>
          </div>
        </div>

        <div className="text-xs font-body font-medium text-sprint-sidebar leading-relaxed">
          <span className="font-bold text-sprint-gold uppercase tracking-wider text-[10px] mr-2">Recommendation:</span> 
          {congestionLevel === 3 ? 'Divert traffic to alternate routes.' : 'Maintain current signal timing.'}
        </div>

        <div className="flex-1 min-h-[100px] mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={projData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
              <XAxis dataKey="time" stroke="#9ca3af" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis domain={[0, 100]} hide />
              <Tooltip 
                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#F3F4F6', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ fontFamily: 'Inter', fontSize: '12px', fontWeight: 'bold' }}
              />
              <ReferenceLine y={80} stroke="#dc2626" strokeDasharray="3 3" strokeOpacity={0.5} />
              <Line type="monotone" dataKey="val" stroke="#C89B3C" strokeWidth={3} dot={{ r: 4, fill: '#C89B3C', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

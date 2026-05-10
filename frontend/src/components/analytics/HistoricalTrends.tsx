import React from 'react';
import { GlowCard } from '../ui/GlowCard';

export const HistoricalTrends = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  return (
    <div className="h-80 flex flex-col bg-white rounded-[2.5rem] shadow-soft p-8 relative overflow-hidden">
      <h2 className="text-xl font-title font-bold italic text-sprint-sidebar mb-6 uppercase tracking-tight">HISTORICAL CONGESTION MAP</h2>
      
      <div className="flex-1 flex flex-col justify-between">
        <div className="flex text-[9px] font-bold text-sprint-textMuted uppercase tracking-widest mb-3">
          <div className="w-10"></div>
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="flex-1 text-center">{i * 2}h</div>
          ))}
        </div>
        
        {days.map((day, i) => (
          <div key={day} className="flex items-center gap-1.5 mb-1.5 last:mb-0">
            <div className="w-10 text-[10px] font-bold text-sprint-sidebar uppercase">{day}</div>
            {Array.from({ length: 12 }).map((_, j) => {
              const isRush = (j >= 4 && j <= 5) || (j >= 8 && j <= 9);
              const isWeekend = i >= 5;
              let val = Math.random();
              if (isRush && !isWeekend) val += 0.5;
              
              let bg = 'bg-green-500';
              if (val > 1.2) bg = 'bg-red-500';
              else if (val > 0.8) bg = 'bg-amber-500';
              else if (val > 0.4) bg = 'bg-sprint-gold';
              
              return (
                <div 
                  key={`${i}-${j}`} 
                  className={`flex-1 h-5 rounded-md ${bg} opacity-80 hover:opacity-100 cursor-pointer transition-all hover:scale-105 shadow-sm`}
                  title={`${day} ${j*2}:00 - Congestion Level`}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

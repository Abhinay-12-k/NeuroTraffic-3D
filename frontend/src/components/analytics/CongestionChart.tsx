import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { GlowCard } from '../ui/GlowCard';
import { useGlobalTrafficStore } from '../../store/globalTrafficStore';

export const CongestionChart = () => {
  const [data, setData] = useState(
    Array.from({ length: 20 }, (_, i) => ({ time: `-${20 - i}s`, NORTH: 0, SOUTH: 0, EAST: 0, WEST: 0 }))
  );
  
  const getVehicleCount = useGlobalTrafficStore(s => s.getVehicleCount);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
      
      const newEntry = {
        time: timeStr,
        NORTH: getVehicleCount('NORTH'),
        SOUTH: getVehicleCount('SOUTH'),
        EAST: getVehicleCount('EAST'),
        WEST: getVehicleCount('WEST'),
      };
      
      setData(prev => [...prev.slice(1), newEntry]);
    }, 1000); 
    
    return () => clearInterval(interval);
  }, [getVehicleCount]);

  return (
    <div className="h-80 flex flex-col bg-white rounded-[2.5rem] shadow-soft p-8 relative overflow-hidden">
      <h2 className="text-xl font-title font-bold italic text-sprint-sidebar mb-6 uppercase tracking-tight">TRAFFIC VOLUME (LIVE)</h2>
      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorNorth" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#123C2C" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#123C2C" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorSouth" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#C89B3C" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#C89B3C" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
            <XAxis dataKey="time" stroke="#9ca3af" fontSize={10} tickLine={false} axisLine={false} />
            <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#ffffff', borderColor: '#F3F4F6', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              itemStyle={{ fontFamily: 'Inter', fontSize: '12px', fontWeight: 'bold' }}
            />
            <Area type="monotone" dataKey="NORTH" stroke="#123C2C" strokeWidth={2} fillOpacity={1} fill="url(#colorNorth)" isAnimationActive={false} />
            <Area type="monotone" dataKey="SOUTH" stroke="#C89B3C" strokeWidth={2} fillOpacity={1} fill="url(#colorSouth)" isAnimationActive={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

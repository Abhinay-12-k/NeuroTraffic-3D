import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { GlowCard } from '../ui/GlowCard';
import { useGlobalTrafficStore } from '../../store/globalTrafficStore';

export const WaitTimeChart = () => {
  const lanes = ['NORTH', 'SOUTH', 'EAST', 'WEST'] as const;
  const getWaitTime = useGlobalTrafficStore(s => s.getWaitTime);

  const data = lanes.map(lane => ({
    lane,
    waitTime: getWaitTime(lane)
  }));

  const getColor = (value: number) => {
    if (value > 60) return '#dc2626';
    if (value > 30) return '#C89B3C';
    return '#123C2C';
  };

  return (
    <div className="h-80 flex flex-col bg-white rounded-[2.5rem] shadow-soft p-8 relative overflow-hidden">
      <h2 className="text-xl font-title font-bold italic text-sprint-sidebar mb-6 uppercase tracking-tight">AVERAGE WAIT TIME (s)</h2>
      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" horizontal={true} vertical={false} />
            <XAxis type="number" stroke="#9ca3af" fontSize={12} axisLine={false} tickLine={false} />
            <YAxis dataKey="lane" type="category" stroke="#9ca3af" fontSize={12} width={60} axisLine={false} tickLine={false} />
            <Tooltip 
              cursor={{ fill: 'rgba(0, 0, 0, 0.02)' }}
              contentStyle={{ backgroundColor: '#ffffff', borderColor: '#F3F4F6', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              itemStyle={{ fontFamily: 'Inter', fontSize: '12px', fontWeight: 'bold' }}
            />
            <Bar dataKey="waitTime" radius={[0, 10, 10, 0]} barSize={30}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColor(entry.waitTime)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

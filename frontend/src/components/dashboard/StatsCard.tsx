import React, { useState, useEffect } from 'react';
import { GlowCard } from '../ui/GlowCard';
import { motion } from 'framer-motion';

function AnimatedNumber({ value }: { value: number | string }) {
  const numericValue = typeof value === 'number' ? value : parseFloat(value.toString().replace(/[^0-9.]/g, ''));
  const unit = typeof value === 'string' ? value.replace(/[0-9.]/g, '') : '';
  const [displayed, setDisplayed] = useState(numericValue);
  
  useEffect(() => {
    const start = displayed;
    const end = numericValue;
    const duration = 600;
    const startTime = Date.now();
    
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setDisplayed(start + (end - start) * eased);
      if (progress >= 1) clearInterval(timer);
    }, 16);
    
    return () => clearInterval(timer);
  }, [numericValue]);
  
  return (
    <span className="font-mono">
        {numericValue % 1 === 0 ? Math.round(displayed) : displayed.toFixed(1)}
        {unit}
    </span>
  );
}

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
  color?: string;
  delay?: number;
}

export const StatsCard = ({ title, value, icon, trend, trendUp, color = '#C89B3C', delay = 0 }: StatsCardProps) => {
  return (
    <div className="bg-white rounded-[2rem] shadow-soft p-6 border border-gray-100 flex flex-col h-full justify-between relative overflow-hidden group hover:border-[#C89B3C]/30 transition-all duration-300">
      <div className="flex justify-between items-start mb-1">
        <div style={{ backgroundColor: color }} className="p-2.5 text-white rounded-[1rem] shadow-sm">
          {icon}
        </div>
        {trend && (
          <div className={`text-[11px] font-bold tracking-wider ${trendUp ? 'text-green-600' : 'text-red-500'}`}>
            {trendUp ? '+' : '-'}{trend}
          </div>
        )}
      </div>
      <div>
        <div className="text-[10px] text-sprint-textMuted font-bold uppercase tracking-widest mb-1">
          {title}
        </div>
        <div className="text-4xl font-title italic font-bold text-sprint-sidebar">
          <AnimatedNumber value={value} />
        </div>
      </div>
    </div>
  );
};

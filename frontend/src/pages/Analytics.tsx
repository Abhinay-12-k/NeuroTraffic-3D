import React from 'react';
import { motion } from 'framer-motion';
import { CongestionChart } from '../components/analytics/CongestionChart';
import { WaitTimeChart } from '../components/analytics/WaitTimeChart';
import { PredictionPanel } from '../components/analytics/PredictionPanel';
import { EmissionEstimator } from '../components/analytics/EmissionEstimator';
import { HistoricalTrends } from '../components/analytics/HistoricalTrends';
import { Activity, Database, Server, Zap } from 'lucide-react';

export const Analytics = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full flex flex-col gap-8 pb-8"
    >
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-title italic font-bold text-sprint-sidebar uppercase tracking-tight">SYSTEM ANALYTICS</h1>
          <p className="text-sprint-textMuted font-body mt-1">AI-Powered Predictive Insights & Metrics</p>
        </div>
        <div className="flex gap-2">
          <select className="bg-white border border-gray-200 text-sprint-sidebar px-4 py-2 rounded-full font-bold text-sm outline-none shadow-sm cursor-pointer hover:border-gray-300 transition-colors">
            <option>Last 24 Hours</option>
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white rounded-[2rem] shadow-soft p-6 flex items-center gap-5">
          <div className="p-3.5 bg-sprint-bg rounded-2xl text-sprint-sidebar shadow-sm"><Activity size={24} /></div>
          <div>
            <div className="text-[10px] font-bold text-sprint-textMuted uppercase tracking-widest mb-1">OPTIMIZATION EFFICIENCY</div>
            <div className="text-2xl font-title italic font-bold text-sprint-sidebar">94.2%</div>
          </div>
        </div>
        <div className="bg-white rounded-[2rem] shadow-soft p-6 flex items-center gap-5">
          <div className="p-3.5 bg-green-50 rounded-2xl text-green-600 shadow-sm"><Database size={24} /></div>
          <div>
            <div className="text-[10px] font-bold text-sprint-textMuted uppercase tracking-widest mb-1">DATA POINTS PROCESSED</div>
            <div className="text-2xl font-title italic font-bold text-sprint-sidebar">1.2M</div>
          </div>
        </div>
        <div className="bg-white rounded-[2rem] shadow-soft p-6 flex items-center gap-5">
          <div className="p-3.5 bg-amber-50 rounded-2xl text-sprint-gold shadow-sm"><Zap size={24} /></div>
          <div>
            <div className="text-[10px] font-bold text-sprint-textMuted uppercase tracking-widest mb-1">PREDICTION ACCURACY</div>
            <div className="text-2xl font-title italic font-bold text-sprint-sidebar">89.4%</div>
          </div>
        </div>
        <div className="bg-white rounded-[2rem] shadow-soft p-6 flex items-center gap-5">
          <div className="p-3.5 bg-blue-50 rounded-2xl text-blue-500 shadow-sm"><Server size={24} /></div>
          <div>
            <div className="text-[10px] font-bold text-sprint-textMuted uppercase tracking-widest mb-1">SYSTEM UPTIME</div>
            <div className="text-2xl font-title italic font-bold text-sprint-sidebar">99.99%</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <CongestionChart />
        <WaitTimeChart />
      </div>

      <div className="grid grid-cols-3 gap-8">
        <PredictionPanel />
        <EmissionEstimator />
        <HistoricalTrends />
      </div>
    </motion.div>
  );
};

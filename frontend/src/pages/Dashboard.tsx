import { motion } from 'framer-motion';
import { Car, Clock, Zap, Leaf } from 'lucide-react';
import { StatsCard } from '../components/dashboard/StatsCard';
import { SignalStatusPanel } from '../components/dashboard/SignalStatusPanel';
import { LiveFeedPanel } from '../components/dashboard/LiveFeedPanel';
import { AIInsightPanel } from '../components/dashboard/AIInsightPanel';
import { TrafficHeatmap } from '../components/dashboard/TrafficHeatmap';
import { EmergencyAlert } from '../components/dashboard/EmergencyAlert';
import { WeatherWidget } from '../components/dashboard/WeatherWidget';
import { useGlobalTrafficStore } from '../store/globalTrafficStore';

export const Dashboard = () => {
  const globalState = useGlobalTrafficStore(s => s.globalState);
  const aggregates = useGlobalTrafficStore(s => s.getAggregates());

  if (!globalState) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-sprint-bg">
        <div className="text-center text-sprint-sidebar">
          <div className="w-16 h-16 border-4 border-sprint-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-title italic text-xl">Initializing System...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-sprint-bg flex flex-col p-8 pb-20 gap-8">
      
      <EmergencyAlert />

      {/* ── ROW 1 : KPI CARDS ── fixed 140px height */}
      <div className="grid grid-cols-5 gap-4 shrink-0" style={{ height: '140px' }}>
        <StatsCard
          title="TOTAL VEHICLES NOW"
          value={aggregates.totalVehicles || 0}
          icon={<Car size={16} />}
          trend="12% from last hour"
          trendUp={true}
          delay={0.1}
          color="#123C2C"
        />
        <StatsCard
          title="AVERAGE WAIT TIME"
          value={`${aggregates.avgWaitTime || 0}s`}
          icon={<Clock size={16} />}
          trend="4% reduction"
          trendUp={false}
          color="#C89B3C"
          delay={0.2}
        />
        <WeatherWidget />
        <StatsCard
          title="AI OPTIMIZATION"
          value={`${aggregates.optimizationScore || 0}%`}
          icon={<Zap size={16} />}
          trend="Optimal state"
          trendUp={true}
          color="#123C2C"
          delay={0.3}
        />
        <StatsCard
          title="CO2 SAVED"
          value={`${aggregates.co2Saved || 0} kg`}
          icon={<Leaf size={16} />}
          trend="vs static timing"
          trendUp={true}
          color="#C89B3C"
          delay={0.4}
        />
      </div>

      {/* ── ROW 2 : MAIN 3-COLUMN GRID ── fills remaining space */}
      <div className="flex-1 grid gap-4 min-h-0" style={{ gridTemplateColumns: '4fr 5fr 3fr' }}>

        {/* LEFT: Live Traffic Feed */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-soft flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50 shrink-0">
            <h2 className="text-xs font-bold text-sprint-sidebar uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              LIVE TRAFFIC FEED
            </h2>
            <span className="text-[9px] font-bold text-green-600 bg-green-50 border border-green-100 px-2 py-0.5 rounded-md uppercase tracking-widest">
              AI DETECTION ACTIVE
            </span>
          </div>
          <div className="flex-1 min-h-0 overflow-hidden">
            <LiveFeedPanel />
          </div>
        </div>

        {/* MIDDLE: Signal State Map */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-soft flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50 shrink-0">
            <h2 className="text-xs font-bold text-sprint-sidebar uppercase tracking-widest">SIGNAL STATE MAP</h2>
            <span className="text-[9px] font-bold text-[#C89B3C] bg-sprint-bg border border-gray-100 px-2 py-0.5 rounded-md uppercase tracking-widest">
              VIP CORRIDOR
            </span>
          </div>
          <div className="flex-1 min-h-[500px] relative flex items-center justify-center overflow-hidden">
            <SignalStatusPanel />
          </div>
        </div>

        {/* RIGHT: AI Insights + Density Heatmap stacked */}
        <div className="flex flex-col gap-4 min-h-0">

          {/* AI Insights - takes most of right column */}
          <div className="flex-1 min-h-[350px] bg-white rounded-3xl border border-gray-100 shadow-soft flex flex-col overflow-hidden">
            <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-50 shrink-0">
              <Zap size={13} className="text-[#C89B3C]" />
              <h2 className="text-xs font-bold text-sprint-sidebar uppercase tracking-widest">AI INSIGHTS</h2>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
              <AIInsightPanel />
            </div>
          </div>

          {/* Density Heatmap - fixed 320px height */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-soft flex flex-col overflow-hidden shrink-0" style={{ height: '320px' }}>
            <div className="px-6 py-4 border-b border-gray-50 shrink-0">
              <h2 className="text-xs font-bold text-sprint-sidebar uppercase tracking-widest">DENSITY HEATMAP</h2>
            </div>
            <div className="flex-1 min-h-0 p-6">
              <TrafficHeatmap />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

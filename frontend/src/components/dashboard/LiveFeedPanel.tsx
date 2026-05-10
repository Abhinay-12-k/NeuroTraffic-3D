import { useGlobalTrafficStore } from '../../store/globalTrafficStore';
import { motion } from 'framer-motion';

const LaneDensityBar = ({ lane }: { lane: 'NORTH' | 'SOUTH' | 'EAST' | 'WEST' }) => {
  const laneData = useGlobalTrafficStore(s => s.getLane(lane));
  
  if (!laneData) return (
    <div className="mb-4 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-2 bg-gray-100 rounded full"></div>
    </div>
  );
  
  const density = laneData.density; // 0.0 to 1.0 from store
  
  const barColor = density > 0.75 ? '#dc2626'  // red - critical
                 : density > 0.45 ? '#d97706'  // amber - moderate
                 : '#16a34a';                   // green - low
  
  return (
    <div className="mb-5 last:mb-0">
      <div className="flex justify-between text-[11px] font-bold mb-1.5 text-sprint-textMuted uppercase tracking-wider">
        <span className="text-sprint-sidebar">{lane}</span>
        <span className="font-mono bg-sprint-bg px-2 py-0.5 rounded-sm">
            {laneData.totalVehicles} veh • {laneData.avgWaitTime}s avg
        </span>
      </div>
      <div className="h-1.5 w-full bg-sprint-bg rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: barColor }}
          animate={{ width: `${density * 100}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

export const LiveFeedPanel = () => {
  return (
    <div className="flex flex-col h-full overflow-hidden relative bg-transparent">
      {/* CCTV Image Section */}
      <div className="relative w-full aspect-video rounded-3xl overflow-hidden mb-6 shadow-sm border border-gray-100 bg-gray-100">
        <img 
          src="/live_feed.png" 
          alt="CCTV Feed" 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4 bg-red-500 text-white text-[8px] font-bold px-2 py-1 rounded-sm uppercase tracking-widest animate-pulse">
          Live Rec
        </div>
        {/* Detection Bounding Boxes Overlay Simulation */}
        <div className="absolute top-1/4 left-1/4 w-20 h-14 border-2 border-green-400 rounded-sm opacity-60">
           <div className="absolute -top-4 left-0 bg-green-400 text-[6px] font-bold px-1 text-black">CAR 94%</div>
        </div>
        <div className="absolute bottom-1/3 right-1/4 w-24 h-16 border-2 border-amber-400 rounded-sm opacity-60">
           <div className="absolute -top-4 left-0 bg-amber-400 text-[6px] font-bold px-1 text-black">BUS 88%</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
        {(['NORTH', 'SOUTH', 'EAST', 'WEST'] as const).map((lane) => (
          <LaneDensityBar key={lane} lane={lane} />
        ))}
      </div>
    </div>
  );
};

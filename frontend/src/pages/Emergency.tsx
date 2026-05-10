import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useEmergencyStore } from '../store/emergencyStore';
import { useGlobalTrafficStore } from '../store/globalTrafficStore';
import { ShieldAlert, CheckCircle, Navigation, Clock, Activity, Target } from 'lucide-react';
import { fetchEmergencyHistory } from '../services/api';

export const Emergency = () => {
  const { isActive, affectedLane, triggerEmergency, clearEmergency, alertHistory, triggerVipCorridor, clearVipCorridor } = useEmergencyStore();
  const getVipRoute = useGlobalTrafficStore(s => s.getVipRoute);
  const activeRoute = getVipRoute();
  
  const [history, setHistory] = useState<any[]>([]);
  const vipModeAlpha = activeRoute === 'ALPHA';
  const vipModeBeta = activeRoute === 'BETA';

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const h = await fetchEmergencyHistory();
        setHistory(h || []);
      } catch (e) {
        setHistory(alertHistory);
      }
    };
    loadHistory();
  }, [alertHistory, activeRoute]); // refresh history when VIP route changes to see logs instantly

  const handleTrigger = (lane: string) => {
    if (window.confirm(`Activate emergency mode for ${lane} lane?`)) {
      triggerEmergency(lane);
    }
  };

  const toggleAlpha = () => {
    if (!vipModeAlpha) triggerVipCorridor('ALPHA');
    else clearVipCorridor('ALPHA');
  };

  const toggleBeta = () => {
    if (!vipModeBeta) triggerVipCorridor('BETA');
    else clearVipCorridor('BETA');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full flex flex-col gap-8"
    >
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-title italic font-bold text-sprint-sidebar uppercase tracking-tight">EMERGENCY CONTROL</h1>
          <p className="text-sprint-textMuted font-body mt-1">First Responder Priority Routing & VIP Corridors</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8 h-64 shrink-0">
        {/* Status Hero */}
        <div className={`col-span-2 relative overflow-hidden flex items-center justify-center bg-white rounded-[2.5rem] shadow-soft ${isActive ? 'border border-red-200 bg-red-50' : 'border border-gray-100'}`}>
          <div className="text-center z-10">
            {isActive ? (
              <>
                <ShieldAlert size={64} className="text-red-500 mx-auto mb-4 animate-bounce" />
                <h2 className="text-2xl font-title italic font-bold text-red-600 mb-2">ACTIVE EMERGENCY: {affectedLane}</h2>
                <p className="font-body text-red-700/70">Green corridor established. All conflicting signals halted.</p>
                <button 
                  onClick={() => clearEmergency(affectedLane || '')} 
                  className="mt-6 px-8 py-3 bg-red-500 text-white font-bold rounded-full hover:bg-red-600 transition-colors shadow-sm"
                >
                  Clear Emergency Status
                </button>
              </>
            ) : (
              <>
                <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-title italic font-bold text-sprint-sidebar mb-2">System Status: Normal</h2>
                <p className="font-body text-sprint-textMuted">All junctions operating under standard AI optimization.</p>
              </>
            )}
          </div>
        </div>

        {/* VIP Corridor Mode */}
        <div className="col-span-1 flex flex-col bg-white rounded-[2.5rem] shadow-soft p-8">
          <div className="flex items-center gap-2 mb-4">
            <Target className="text-sprint-gold" size={20} />
            <h2 className="text-lg font-title font-bold text-sprint-sidebar">VIP Corridor</h2>
          </div>
          <p className="text-xs font-body text-sprint-textMuted mb-2">
            Pre-clears traffic signals along a designated route.
          </p>
          <div className="flex-1 flex flex-col justify-end gap-3">
            <div className="bg-sprint-bg p-3 rounded-2xl flex justify-between items-center border border-gray-100">
              <span className="font-bold text-sprint-sidebar text-sm">Route Alpha (N → S)</span>
              <div 
                className={`w-10 h-5 rounded-full cursor-pointer relative transition-colors ${vipModeAlpha ? 'bg-sprint-gold' : 'bg-gray-300'}`}
                onClick={toggleAlpha}
              >
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${vipModeAlpha ? 'left-5' : 'left-1'}`}></div>
              </div>
            </div>
            <div className="bg-sprint-bg p-3 rounded-2xl flex justify-between items-center border border-gray-100">
              <span className="font-bold text-sprint-sidebar text-sm">Route Beta (E → W)</span>
              <div 
                className={`w-10 h-5 rounded-full cursor-pointer relative transition-colors ${vipModeBeta ? 'bg-sprint-gold' : 'bg-gray-300'}`}
                onClick={toggleBeta}
              >
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${vipModeBeta ? 'left-5' : 'left-1'}`}></div>
              </div>
            </div>
            {(vipModeAlpha || vipModeBeta) && (
              <div className="text-[10px] font-bold text-sprint-gold animate-pulse flex items-center justify-center gap-2 mt-2 uppercase tracking-widest">
                <Navigation size={12} /> VIP Corridor Active
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8 flex-1 min-h-0 pb-6">
        {/* Manual Triggers */}
        <div className="col-span-4 flex flex-col bg-white rounded-[2.5rem] shadow-soft p-8">
          <div className="flex items-center gap-2 mb-6">
            <Activity className="text-red-500" size={20} />
            <h2 className="text-lg font-title font-bold text-sprint-sidebar">Manual Override</h2>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-4">
            {['NORTH', 'SOUTH', 'EAST', 'WEST'].map(lane => (
              <button
                key={lane}
                onClick={() => handleTrigger(lane)}
                disabled={isActive}
                className={`flex flex-col items-center justify-center gap-2 p-4 border-2 rounded-2xl font-bold transition-all ${
                  isActive 
                    ? 'border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed' 
                    : 'border-red-100 text-red-500 hover:bg-red-50 hover:border-red-500 shadow-sm'
                }`}
              >
                <ShieldAlert size={24} />
                {lane}
              </button>
            ))}
          </div>
        </div>

        {/* History Table */}
        <div className="col-span-8 flex flex-col overflow-hidden bg-white rounded-[2.5rem] shadow-soft p-8">
          <div className="flex items-center gap-2 mb-6 shrink-0">
            <Clock className="text-sprint-gold" size={20} />
            <h2 className="text-lg font-title font-bold text-sprint-sidebar">Incident Log</h2>
          </div>
          <div className="flex-1 overflow-auto custom-scrollbar">
            <table className="w-full text-left font-body text-sm">
              <thead className="text-[10px] font-bold text-sprint-textMuted uppercase tracking-widest border-b border-gray-100 sticky top-0 bg-white">
                <tr>
                  <th className="pb-3">Time</th>
                  <th className="pb-3">Lane</th>
                  <th className="pb-3">Type</th>
                  <th className="pb-3">Duration</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="text-sprint-sidebar">
                {history.map((event, idx) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-sprint-bg/50 transition-colors">
                    <td className="py-4">{new Date(event.timestamp).toLocaleTimeString()}</td>
                    <td className="py-4 font-bold">{event.lane}</td>
                    <td className="py-4 capitalize">{event.type || 'Ambulance'}</td>
                    <td className="py-4">{event.duration || '15'}s</td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${event.status === 'active' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>
                        {event.status || 'cleared'}
                      </span>
                    </td>
                  </tr>
                ))}
                {history.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-sprint-textMuted font-bold">No emergency events logged today.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

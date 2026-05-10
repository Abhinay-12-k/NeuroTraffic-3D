import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGlobalTrafficStore } from '../../store/globalTrafficStore';
import { AlertTriangle } from 'lucide-react';

export const EmergencyAlert = () => {
  const emergency = useGlobalTrafficStore(s => s.getEmergency());

  return (
    <AnimatePresence>
      {emergency?.active && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="overflow-hidden"
        >
          <div className="bg-[#FF3366]/10 border-2 border-[#FF3366] rounded-xl p-4 mb-6 flex items-center justify-between shadow-[0_0_30px_rgba(255,51,102,0.2)]">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#FF3366] flex items-center justify-center animate-bounce">
                <AlertTriangle size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-orbitron font-bold text-[#FF3366]">EMERGENCY CORRIDOR ACTIVE</h3>
                <p className="text-sm font-space text-gray-400">
                  Ambulance detected in <span className="text-white font-bold">{emergency.lane}</span> lane. Establishing green corridor.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4 items-center">
               <div className="text-right">
                  <div className="text-[10px] font-space text-[#FF3366] uppercase tracking-widest">Priority Mode</div>
                  <div className="text-lg font-orbitron text-white uppercase">{emergency.vehicleType || 'Vehicle'}</div>
               </div>
               <div className="h-10 w-[2px] bg-[#FF3366]/30"></div>
               <div className="text-center bg-[#FF3366] px-4 py-2 rounded font-bold text-white font-orbitron">
                  {Math.floor(emergency.timeRemaining)}s
               </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

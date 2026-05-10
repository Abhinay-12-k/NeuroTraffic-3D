import React from 'react';
import { motion } from 'framer-motion';
import { JunctionScene } from '../components/simulation/JunctionScene';

export const Simulation3D = () => {
  return (
    <div className="w-full h-full relative rounded-[2.5rem] overflow-hidden bg-[#0B0D11] shadow-2xl">
      {/* Floating Info Overlay - Cyber Dark Theme */}
      <div className="absolute top-10 left-10 z-10 pointer-events-none">
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="bg-black/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 shadow-2xl"
        >
          <h1 className="text-4xl font-title italic font-bold text-white mb-2 flex items-center gap-3">
            Junction <span className="text-[#C89B3C]">Digital Twin</span>
          </h1>
          <div className="flex items-center gap-3 text-xs font-bold tracking-widest text-white/40 uppercase">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
            Neural Engine Active • State Synced
          </div>
        </motion.div>
      </div>
      
      <JunctionScene />
    </div>
  );
};

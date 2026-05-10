import React from 'react';
import { motion } from 'framer-motion';

export const GlowCard = ({ children, className = '', delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={`bg-white rounded-[2.5rem] shadow-soft p-6 ${className}`}
    >
      {children}
    </motion.div>
  );
};

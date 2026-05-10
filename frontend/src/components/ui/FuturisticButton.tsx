import React from 'react';

export const FuturisticButton = ({ children, onClick, color = 'blue', className = '' }: any) => {
  const colorMap: any = {
    blue: 'bg-sprint-sidebar text-white hover:bg-black',
    green: 'bg-green-600 text-white hover:bg-green-700',
    red: 'bg-red-500 text-white hover:bg-red-600',
    yellow: 'bg-sprint-gold text-white hover:bg-sprint-goldLight',
  };

  return (
    <button
      onClick={onClick}
      className={`px-6 py-2.5 font-body font-bold text-xs uppercase tracking-widest transition-all duration-300 rounded-full shadow-sm hover:scale-105 active:scale-95 ${colorMap[color]} ${className}`}
    >
      {children}
    </button>
  );
};

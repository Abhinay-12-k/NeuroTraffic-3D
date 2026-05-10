import React from 'react';

export const StatusBadge = ({ status, text }: { status: 'normal' | 'emergency' | 'eco', text?: string }) => {
  const styles = {
    normal: 'border-neon-blue text-neon-blue',
    emergency: 'border-neon-red text-neon-red animate-pulse',
    eco: 'border-neon-green text-neon-green'
  };

  return (
    <div className={`border px-3 py-1 text-xs font-orbitron rounded-full ${styles[status]}`}>
      {text || status.toUpperCase()}
    </div>
  );
};

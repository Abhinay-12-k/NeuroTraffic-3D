import React from 'react';
import { useGlobalTrafficStore } from '../../store/globalTrafficStore';
import { AlertCircle, Info, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AIInsightPanel = () => {
  const insights = useGlobalTrafficStore(s => s.getInsights());

  return (
    <div className="flex flex-col h-full bg-white rounded-[2.5rem] shadow-soft p-8 relative overflow-hidden">
      <h2 className="text-xl font-title font-bold italic text-sprint-sidebar flex items-center gap-2 mb-6 shrink-0">
        <Zap size={20} className="text-sprint-gold" />
        AI Insights
      </h2>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {insights.length > 0 ? (
            insights.map((insight: any) => (
              <motion.div
                key={insight.id || insight.timestamp}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className={`p-4 rounded-2xl mb-4 shadow-sm border ${
                  insight.severity === 'critical' ? 'border-red-200 bg-red-50 text-red-800' : 
                  insight.severity === 'warning' ? 'border-amber-200 bg-amber-50 text-amber-800' : 
                  'border-gray-200 bg-sprint-bg text-sprint-sidebar'
                }`}
              >
                <div className="flex gap-3">
                  <div className="shrink-0 mt-0.5">
                    {insight.severity === 'critical' ? <AlertCircle size={18} /> : 
                     insight.severity === 'warning' ? <Zap size={18} /> : 
                     <Info size={18} className="text-blue-500" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs leading-relaxed font-body font-medium tracking-wide">
                        {insight.message}
                    </p>
                    <p className="text-[10px] text-gray-400 font-bold mt-2 uppercase">
                      {new Date(insight.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-300 text-center p-8">
              <Zap size={32} className="mb-3 opacity-20" />
              <p className="text-xs font-body font-bold tracking-widest uppercase">Analyzing traffic patterns...</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

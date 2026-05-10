import { Bell, Search, Menu } from 'lucide-react';
import { useGlobalTrafficStore } from '../../store/globalTrafficStore';

export const Topbar = () => {
  const isConnected = useGlobalTrafficStore(s => s.isConnected);

  return (
    <header className="h-24 flex items-center justify-between px-10 shrink-0 z-30">
      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-title font-bold italic text-sprint-sidebar tracking-tight">
          System <span className="text-sprint-gold">Monitoring</span>
        </h2>
        <div className="h-8 w-px bg-gray-200 mx-4"></div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-red-500 animate-pulse'} `}></div>
          <span className="text-[10px] font-bold text-sprint-textMuted uppercase tracking-widest">
            {isConnected ? 'Neural Engine Active' : 'Neural Engine Offline'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative w-72">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-sprint-textMuted">
            <Search size={16} />
          </div>
          <input 
            type="text" 
            placeholder="Search analytics..." 
            className="w-full bg-white rounded-full py-2.5 pl-11 pr-6 text-xs text-sprint-sidebar font-medium shadow-soft focus:outline-none focus:ring-2 focus:ring-sprint-gold/30 placeholder:text-sprint-textMuted/60 border border-gray-100"
          />
        </div>
        
        <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-sprint-sidebar hover:text-sprint-gold transition-colors shadow-soft border border-gray-100 relative">
          <Bell size={18} />
          <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-sprint-gold rounded-full"></span>
        </button>
      </div>
    </header>
  );
};

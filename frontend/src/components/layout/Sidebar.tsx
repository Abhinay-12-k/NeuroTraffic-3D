import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, AlertTriangle, Settings, Activity, BarChart3, LogOut, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const SidebarLink = ({ to, icon, label, active }: any) => (
  <Link
    to={to}
    className={`flex items-center gap-4 px-8 py-4 transition-all duration-300 relative group ${
      active 
        ? 'bg-[#1a4f3b]' 
        : 'hover:bg-[#1a4f3b]/60'
    }`}
  >
    {active && (
      <motion.div
        layoutId="activeNav"
        className="absolute left-0 w-1.5 h-8 bg-[#C89B3C] rounded-r-full shadow-[0_0_20px_#C89B3C]"
      />
    )}
    <div className={`transition-all duration-300 ${active ? 'scale-110 text-[#C89B3C] drop-shadow-[0_0_8px_#C89B3C]' : 'text-white/40 group-hover:text-[#C89B3C] group-hover:drop-shadow-[0_0_8px_#C89B3C]'}`}>
      {icon}
    </div>
    <span className={`text-[11px] font-bold tracking-[0.2em] uppercase transition-all duration-300 ${active ? 'text-[#C89B3C] opacity-100 drop-shadow-[0_0_5px_rgba(200,155,60,0.5)]' : 'text-white/40 opacity-80 group-hover:text-[#C89B3C] group-hover:opacity-100'}`}>
      {label}
    </span>
  </Link>
);

export const Sidebar = () => {
  const location = useLocation();
  const { profile, logout } = useAuth();

  const menuItems = [
    { path: '/', icon: <LayoutDashboard size={20} />, label: 'DASHBOARD' },
    { path: '/simulation', icon: <Activity size={20} />, label: '3D SIMULATION' },
    { path: '/analytics', icon: <BarChart3 size={20} />, label: 'ANALYTICS' },
    { path: '/emergency', icon: <AlertTriangle size={20} />, label: 'EMERGENCY' },
    { path: '/settings', icon: <Settings size={20} />, label: 'SETTINGS' },
  ];

  return (
    <aside className="w-80 h-screen bg-[#123C2C] flex flex-col shrink-0 z-50 shadow-2xl">
      <div className="p-10 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#C89B3C] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(200,155,60,0.3)]">
            <Activity className="text-sprint-sidebar" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tighter leading-none italic font-title">
              NEURO<span className="text-[#C89B3C] drop-shadow-[0_0_5px_rgba(200,155,60,0.5)]">TRAFFIC</span>
            </h1>
            <div className="text-[9px] font-bold text-white/40 tracking-[0.3em] mt-1.5">3D ENGINE</div>
          </div>
        </div>
      </div>

      <nav className="flex-1">
        {menuItems.map((item) => (
          <SidebarLink
            key={item.path}
            to={item.path}
            icon={item.icon}
            label={item.label}
            active={location.pathname === item.path}
          />
        ))}
      </nav>

      {/* Authorized Operator Section */}
      <div className="p-8 border-t border-white/5 bg-black/10">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#C89B3C]/10 border border-[#C89B3C]/20 flex items-center justify-center text-[#C89B3C] relative group">
            <Shield size={20} />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#123C2C] animate-pulse"></div>
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold font-title italic text-white truncate">{profile?.fullName || 'OPERATOR'}</p>
            <p className="text-[9px] text-[#C89B3C] font-bold uppercase tracking-[0.2em] truncate">{profile?.station || 'COMMAND CENTER'}</p>
          </div>
        </div>
        
        <button 
          onClick={() => logout()}
          className="w-full flex items-center justify-center gap-3 py-4 bg-white/5 hover:bg-red-500/10 border border-white/5 hover:border-red-500/30 rounded-2xl text-[10px] font-bold text-white/40 hover:text-red-400 tracking-[0.2em] uppercase transition-all group"
        >
          <LogOut size={14} className="group-hover:translate-x-0.5 transition-transform" />
          Terminate Session
        </button>
      </div>
    </aside>
  );
};

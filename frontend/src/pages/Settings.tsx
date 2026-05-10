import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GlowCard } from '../components/ui/GlowCard';
import { FuturisticButton } from '../components/ui/FuturisticButton';
import { Settings as SettingsIcon, Sliders, MapPin, Bell, Activity, Cpu, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const SettingsSection = ({ title, icon, children }: any) => (
  <div className="bg-white rounded-[2.5rem] shadow-soft p-8 mb-8">
    <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100">
      <div className="text-sprint-gold">{icon}</div>
      <h2 className="text-xl font-title font-bold italic text-sprint-sidebar">{title}</h2>
    </div>
    <div className="grid grid-cols-2 gap-10">
      {children}
    </div>
  </div>
);

const SettingSlider = ({ label, value, min, max, unit, onChange }: any) => (
  <div className="flex flex-col gap-4">
    <div className="flex justify-between text-[11px] font-bold text-sprint-textMuted uppercase tracking-widest">
      <span>{label}</span>
      <span className="text-sprint-sidebar">{value}{unit}</span>
    </div>
    <input 
      type="range" 
      min={min} max={max} 
      value={value} 
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-1.5 bg-sprint-bg rounded-lg appearance-none cursor-pointer accent-sprint-gold"
    />
  </div>
);

const SettingInput = ({ label, value, type = "text", onChange }: any) => (
  <div className="flex flex-col gap-3">
    <label className="text-[11px] font-bold text-sprint-textMuted uppercase tracking-widest">{label}</label>
    <input 
      type={type} 
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-sprint-bg border border-gray-100 rounded-xl px-4 py-3 text-sprint-sidebar font-body text-sm outline-none focus:ring-2 focus:ring-sprint-gold/20 transition-all shadow-inner"
    />
  </div>
);

export const Settings = () => {
  const [config, setConfig] = useState({
    minGreen: 10,
    maxGreen: 60,
    baseCycle: 120,
    truckWeight: 2.0,
    junctionName: 'Junction Alpha',
    lanes: 4,
    speedLimit: 50,
    alertThreshold: 80,
    simSpeed: 1,
    spawnRate: 50,
    predictionWindow: 30,
    confidenceThresh: 85
  });

  const update = (key: string, val: any) => {
    setConfig(prev => ({ ...prev, [key]: val }));
  };

  const handleSave = () => {
    toast.success('Configuration saved to AI Engine', {
      style: { background: '#123C2C', color: '#ffffff', borderRadius: '12px' },
      icon: '💾'
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full flex flex-col gap-8 overflow-y-auto custom-scrollbar pr-2 pb-16"
    >
      <div className="flex justify-between items-end sticky top-0 bg-sprint-bg/80 backdrop-blur-md z-10 pb-6 border-b border-gray-100">
        <div>
          <h1 className="text-3xl font-title font-bold italic text-sprint-sidebar flex items-center gap-4 uppercase tracking-tight">
            <SettingsIcon size={32} className="text-sprint-gold" />
            CONFIG SETTINGS
          </h1>
          <p className="text-sprint-textMuted font-body mt-1">Configure AI parameters and hardware endpoints</p>
        </div>
        <button 
          onClick={handleSave} 
          className="flex items-center gap-2 bg-sprint-sidebar text-white font-bold px-8 py-3.5 rounded-full hover:bg-black transition-all shadow-sm"
        >
          <Save size={18} /> 
          <span className="uppercase tracking-widest text-xs font-bold">SAVE CONFIGURATION</span>
        </button>
      </div>

      <div className="mt-4">
        <SettingsSection title="SIGNAL AI PARAMETERS" icon={<Sliders size={24} />}>
          <SettingSlider label="Minimum Green Time" value={config.minGreen} min={5} max={30} unit="s" onChange={(v:any) => update('minGreen', v)} />
          <SettingSlider label="Maximum Green Time" value={config.maxGreen} min={30} max={120} unit="s" onChange={(v:any) => update('maxGreen', v)} />
          <SettingSlider label="Base Cycle Time" value={config.baseCycle} min={60} max={180} unit="s" onChange={(v:any) => update('baseCycle', v)} />
          <SettingSlider label="Heavy Vehicle Weight Multiplier" value={config.truckWeight} min={1.0} max={3.0} unit="x" onChange={(v:any) => update('truckWeight', v)} />
        </SettingsSection>

        <div className="grid grid-cols-2 gap-8">
          <div className="flex flex-col">
            <SettingsSection title="JUNCTION CONFIG" icon={<MapPin size={24} />}>
              <SettingInput label="Junction Name" value={config.junctionName} onChange={(v:any) => update('junctionName', v)} />
              <div className="flex flex-col gap-3">
                <label className="text-[11px] font-bold text-sprint-textMuted uppercase tracking-widest">Number of Lanes</label>
                <select 
                  value={config.lanes} 
                  onChange={(e) => update('lanes', parseInt(e.target.value))}
                  className="bg-sprint-bg border border-gray-100 rounded-xl px-4 py-3 text-sprint-sidebar font-body text-sm outline-none focus:ring-2 focus:ring-sprint-gold/20 shadow-inner"
                >
                  <option value={3}>3-Way T-Junction</option>
                  <option value={4}>4-Way Cross</option>
                  <option value={5}>5-Way Complex</option>
                </select>
              </div>
              <SettingInput label="Speed Limit (km/h)" type="number" value={config.speedLimit} onChange={(v:any) => update('speedLimit', v)} />
            </SettingsSection>
            
            <SettingsSection title="SIMULATION ENGINE" icon={<Activity size={24} />}>
              <SettingSlider label="Default Speed Multiplier" value={config.simSpeed} min={1} max={10} unit="x" onChange={(v:any) => update('simSpeed', v)} />
              <SettingSlider label="Traffic Density (Spawn Rate)" value={config.spawnRate} min={10} max={100} unit="%" onChange={(v:any) => update('spawnRate', v)} />
            </SettingsSection>
          </div>

          <div className="flex flex-col">
            <SettingsSection title="PREDICTIVE AI MODEL" icon={<Cpu size={24} />}>
              <div className="flex flex-col gap-3">
                <label className="text-[11px] font-bold text-sprint-textMuted uppercase tracking-widest">Prediction Window</label>
                <select 
                  value={config.predictionWindow} 
                  onChange={(e) => update('predictionWindow', parseInt(e.target.value))}
                  className="bg-sprint-bg border border-gray-100 rounded-xl px-4 py-3 text-sprint-sidebar font-body text-sm outline-none focus:ring-2 focus:ring-sprint-gold/20 shadow-inner"
                >
                  <option value={15}>+15 Minutes</option>
                  <option value={30}>+30 Minutes</option>
                  <option value={60}>+60 Minutes</option>
                </select>
              </div>
              <SettingSlider label="Min. Confidence Threshold" value={config.confidenceThresh} min={50} max={99} unit="%" onChange={(v:any) => update('confidenceThresh', v)} />
            </SettingsSection>

            <SettingsSection title="ALERT THRESHOLDS" icon={<Bell size={24} />}>
              <SettingSlider label="Congestion Warning Level" value={config.alertThreshold} min={50} max={100} unit="%" onChange={(v:any) => update('alertThreshold', v)} />
              <SettingInput label="Emergency Notification Email" value="admin@neurotraffic.io" />
            </SettingsSection>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

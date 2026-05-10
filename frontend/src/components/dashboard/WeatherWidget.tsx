import React, { useEffect, useState } from 'react';
import { useWeatherStore } from '../../store/weatherStore';
import { GlowCard } from '../ui/GlowCard';
import { CloudRain, Sun, Snowflake, Wind } from 'lucide-react';
import axios from 'axios';

const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY || 'demo_key';
const CITY = 'San Francisco'; // Default smart city location

export const WeatherWidget = () => {
  const { condition, temperature, visibility, setWeather } = useWeatherStore();
  const [loading, setLoading] = useState(false);

  // In a real scenario, you'd fetch from OpenWeatherMap. 
  // We'll simulate it or use the API if the key exists.
  useEffect(() => {
    const fetchWeather = async () => {
      if (WEATHER_API_KEY !== 'demo_key') {
        try {
          const res = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${WEATHER_API_KEY}&units=metric`);
          const main = res.data.weather[0].main.toLowerCase();
          const temp = Math.round(res.data.main.temp);
          let cond: 'clear' | 'rain' | 'snow' = 'clear';
          if (main.includes('rain') || main.includes('drizzle')) cond = 'rain';
          if (main.includes('snow')) cond = 'snow';
          setWeather(cond, temp, res.data.visibility / 100);
        } catch (e) {
          console.warn("Weather API failed, using defaults");
        }
      }
    };
    fetchWeather();
    const interval = setInterval(fetchWeather, 600000); // 10 mins
    return () => clearInterval(interval);
  }, []);

  const Icon = condition === 'rain' ? CloudRain : condition === 'snow' ? Snowflake : Sun;
  const color = condition === 'rain' ? 'text-blue-400' : condition === 'snow' ? 'text-white' : 'text-yellow-400';

  return (
    <div className="bg-white rounded-[2rem] shadow-soft p-5 border border-gray-100 flex flex-col h-full justify-between relative overflow-hidden">
      {condition === 'rain' && <div className="absolute inset-0 bg-blue-50/40 animate-pulse pointer-events-none"></div>}
      
      <div className="flex justify-between items-center z-10">
        <div>
          <div className="text-[10px] font-bold text-sprint-textMuted tracking-widest mb-1 uppercase">LIVE WEATHER AWARENESS</div>
          <div className="text-2xl font-title italic font-bold text-sprint-sidebar flex items-center gap-2">
            {temperature}°C
          </div>
          <div className={`text-[11px] font-bold mt-1 capitalize uppercase tracking-wider ${condition === 'rain' ? 'text-blue-500' : 'text-sprint-gold'}`}>
            {condition} Conditions
          </div>
        </div>
        <Icon size={40} className={`${condition === 'rain' ? 'text-blue-500' : 'text-sprint-gold'} opacity-80`} />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 z-10">
        <div className="bg-sprint-bg p-2 rounded-xl border border-gray-100 flex items-center gap-2">
          <Wind size={14} className="text-sprint-textMuted" />
          <span className="text-[9px] font-bold text-sprint-sidebar uppercase tracking-widest">Vis: {visibility}%</span>
        </div>
        <div className="bg-sprint-bg p-2 rounded-xl border border-gray-100 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-[9px] font-bold text-sprint-sidebar uppercase tracking-widest">AI Adjusted</span>
        </div>
      </div>
    </div>
  );
};

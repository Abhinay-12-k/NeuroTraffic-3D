import { create } from 'zustand';

interface WeatherStore {
  condition: 'clear' | 'rain' | 'snow';
  temperature: number;
  visibility: number; // percentage
  setWeather: (condition: 'clear' | 'rain' | 'snow', temp: number, vis: number) => void;
}

export const useWeatherStore = create<WeatherStore>((set) => ({
  condition: 'clear',
  temperature: 24,
  visibility: 100,
  setWeather: (condition, temp, vis) => set({ condition, temperature: temp, visibility: vis }),
}));

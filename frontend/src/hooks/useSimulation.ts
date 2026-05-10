import { useState, useEffect, useRef } from 'react';
import { useTrafficStore } from '../store/trafficStore';
import { useSignalStore } from '../store/signalStore';

export interface SimVehicle {
  id: string;
  type: 'car' | 'bus' | 'truck' | 'bike' | 'ambulance';
  lane: 'NORTH' | 'SOUTH' | 'EAST' | 'WEST';
  position: [number, number, number];
  speed: number;
  state: 'moving' | 'waiting';
  spawnTime: number;
}

export const useSimulation = () => {
  const [vehicles, setVehicles] = useState<SimVehicle[]>([]);
  const lanes = useTrafficStore(state => state.lanes);
  const signals = useSignalStore(state => state.signals);
  const mode = useSignalStore(state => state.mode);
  
  const lastSpawnTimes = useRef<Record<string, number>>({
    NORTH: 0, SOUTH: 0, EAST: 0, WEST: 0
  });

  // Map density to spawn chance
  const spawnVehicle = () => {
    const now = Date.now();
    const newVehicles: SimVehicle[] = [];

    Object.keys(lanes).forEach((lane) => {
      const density = lanes[lane].density;
      const spawnCooldown = Math.max(1000, 5000 - (density * 4000)); // Higher density = lower cooldown

      if (now - lastSpawnTimes.current[lane] > spawnCooldown && Math.random() < density) {
        lastSpawnTimes.current[lane] = now;
        
        // Pick vehicle type
        const vTypes = lanes[lane].vehicles;
        let type: SimVehicle['type'] = 'car';
        const rand = Math.random();
        if (vTypes.ambulance) type = 'ambulance';
        else if (rand < 0.1) type = 'bus';
        else if (rand < 0.2) type = 'truck';
        else if (rand < 0.35) type = 'bike';

        let startPos: [number, number, number] = [0, 0, 0];
        if (lane === 'NORTH') startPos = [-2, 0, -30];
        if (lane === 'SOUTH') startPos = [2, 0, 30];
        if (lane === 'EAST') startPos = [30, 0, -2];
        if (lane === 'WEST') startPos = [-30, 0, 2];

        newVehicles.push({
          id: `v-${now}-${lane}-${Math.random()}`,
          type,
          lane: lane as any,
          position: startPos,
          speed: type === 'ambulance' ? 0.4 : 0.15 + Math.random() * 0.1,
          state: 'moving',
          spawnTime: now
        });
      }
    });

    if (newVehicles.length > 0) {
      setVehicles(prev => [...prev, ...newVehicles]);
    }
  };

  useEffect(() => {
    const spawner = setInterval(spawnVehicle, 500);
    return () => clearInterval(spawner);
  }, [lanes]);

  // Movement happens in useFrame inside the 3D components, but we pass down the vehicles list
  return { vehicles, setVehicles };
};

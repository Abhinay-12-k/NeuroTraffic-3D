import React, { useRef } from 'react';
import { useSpring, animated } from '@react-spring/three';
import { useGlobalTrafficStore } from '../../store/globalTrafficStore';
import { CarMesh, BusMesh, TruckMesh, MotorcycleMesh, AmbulanceMesh } from './Vehicle';

const LANE_CONFIG: any = {
  NORTH: {
    getPos: (p: number) => [ -1.75, 0, -50 + (p * 50) ],
    rotation: [0, Math.PI / 2, 0], // Faces +Z
  },
  SOUTH: {
    getPos: (p: number) => [ 1.75, 0, 50 - (p * 50) ],
    rotation: [0, -Math.PI / 2, 0], // Faces -Z
  },
  EAST: {
    getPos: (p: number) => [ 50 - (p * 50), 0, -1.75 ],
    rotation: [0, Math.PI, 0], // Faces -X
  },
  WEST: {
    getPos: (p: number) => [ -50 + (p * 50), 0, 1.75 ],
    rotation: [0, 0, 0], // Faces +X
  },
};

function Vehicle3D({ vehicle, lane }: { vehicle: any, lane: string }) {
  const config = LANE_CONFIG[lane];
  const pos = config.getPos(vehicle.laneProgress);
  
  const spring = useSpring({
    position: pos,
    config: { tension: 180, friction: 40, mass: 1 }
  });
  
  return (
    <animated.group
      position={spring.position as any}
      rotation={config.rotation as any}
    >
      {vehicle.type === 'car'         && <CarMesh color={vehicle.color} />}
      {vehicle.type === 'bus'         && <BusMesh />}
      {vehicle.type === 'truck'       && <TruckMesh />}
      {vehicle.type === 'motorcycle'  && <MotorcycleMesh color={vehicle.color} />}
      {vehicle.type === 'ambulance'   && <AmbulanceMesh />}
    </animated.group>
  );
}

export const VehicleRenderer = () => {
  const globalState = useGlobalTrafficStore(s => s.globalState);
  
  if (!globalState) return null;
  
  const allVehicles: any[] = [];
  
  (['NORTH', 'SOUTH', 'EAST', 'WEST'] as const).forEach(lane => {
    const laneData = globalState.lanes[lane];
    if (!laneData?.vehiclePositions) return;
    
    laneData.vehiclePositions.forEach((vehicle: any) => {
      allVehicles.push({ vehicle, lane });
    });
  });
  
  // Sort all vehicles by progress to keep the render order stable for React keys
  allVehicles.sort((a, b) => b.vehicle.laneProgress - a.vehicle.laneProgress);

  return (
    <group>
      {allVehicles.map(v => (
        <Vehicle3D key={v.vehicle.id} vehicle={v.vehicle} lane={v.lane} />
      ))}
    </group>
  );
};

export const EmergencyAmbulance = ({ lane, progress }: { lane: string, progress: number }) => {
  const config = LANE_CONFIG[lane];
  if (!config) return null;
  const pos = config.getPos(progress);
  
  return (
    <group position={pos as any} rotation={config.rotation as any}>
      <AmbulanceMesh />
    </group>
  );
};

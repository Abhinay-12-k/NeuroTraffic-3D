import React from 'react';
import { useGlobalTrafficStore } from '../../store/globalTrafficStore';

export const TrafficSignal = ({ lane }: { lane: 'NORTH' | 'SOUTH' | 'EAST' | 'WEST' }) => {
  const signal = useGlobalTrafficStore(s => s.getSignal(lane));
  
  const positions = {
    NORTH: { pos: [-4.5, 0, -9],  rot: [0, 0, 0] },
    SOUTH: { pos: [4.5, 0, 9],    rot: [0, Math.PI, 0] },
    EAST:  { pos: [9, 0, -4.5],   rot: [0, -Math.PI/2, 0] },
    WEST:  { pos: [-9, 0, 4.5],   rot: [0, Math.PI/2, 0] },
  }[lane];
  
  const activeRed    = signal === 'RED';
  const activeYellow = signal === 'YELLOW';
  const activeGreen  = signal === 'GREEN';
  
  const redIntensity    = activeRed    ? 4.0 : 0.05;
  const yellowIntensity = activeYellow ? 4.0 : 0.05;
  const greenIntensity  = activeGreen  ? 4.0 : 0.05;
  
  return (
    <group position={positions.pos as any} rotation={positions.rot as any}>
      {/* Vertical pole */}
      <mesh position={[0, 2.5, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.12, 5, 12]} />
        <meshStandardMaterial color="#333333" metalness={0.9} roughness={0.1} />
      </mesh>
      
      {/* Signal housing box */}
      <mesh position={[0, 4.0, 0.2]} castShadow>
        <boxGeometry args={[0.6, 1.6, 0.4]} />
        <meshStandardMaterial color="#111111" roughness={0.3} />
      </mesh>
      
      {/* RED light */}
      <mesh position={[0, 4.4, 0.41]}>
        <circleGeometry args={[0.16, 16]} />
        <meshStandardMaterial color="#FF0000" emissive="#FF0000" emissiveIntensity={redIntensity} />
      </mesh>
      {activeRed && <pointLight position={[0, 4.4, 0.6]} color="#FF0000" intensity={1.5} distance={10} />}
      
      {/* YELLOW light */}
      <mesh position={[0, 4.0, 0.41]}>
        <circleGeometry args={[0.16, 16]} />
        <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={yellowIntensity} />
      </mesh>
      {activeYellow && <pointLight position={[0, 4.0, 0.6]} color="#FFD700" intensity={1.5} distance={10} />}
      
      {/* GREEN light */}
      <mesh position={[0, 3.6, 0.41]}>
        <circleGeometry args={[0.16, 16]} />
        <meshStandardMaterial color="#00FF44" emissive="#00FF44" emissiveIntensity={greenIntensity} />
      </mesh>
      {activeGreen && <pointLight position={[0, 3.6, 0.6]} color="#00FF44" intensity={1.5} distance={10} />}
    </group>
  );
};

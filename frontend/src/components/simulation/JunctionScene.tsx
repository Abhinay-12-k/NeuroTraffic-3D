import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, PerspectiveCamera, Environment } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { useGlobalTrafficStore } from '../../store/globalTrafficStore';
import { Road } from './Road';
import { TrafficSignal } from './TrafficSignal';
import { VehicleRenderer, EmergencyAmbulance } from './VehicleRenderer';
import { SimulationControls } from './SimulationControls';

function GreenCorridor({ lane }: { lane: string }) {
  const corridorGeom: any = {
    NORTH: { position: [-1.75, 0.05, 0], rotation: [-Math.PI/2, 0, 0], size: [3.5, 100] },
    SOUTH: { position: [1.75, 0.05, 0],  rotation: [-Math.PI/2, 0, 0], size: [3.5, 100] },
    EAST:  { position: [0, 0.05, -1.75], rotation: [-Math.PI/2, 0, 0], size: [100, 3.5] },
    WEST:  { position: [0, 0.05, 1.75],  rotation: [-Math.PI/2, 0, 0], size: [100, 3.5] },
  }[lane];
  
  if (!corridorGeom) return null;

  return (
    <mesh position={corridorGeom.position} rotation={corridorGeom.rotation}>
      <planeGeometry args={corridorGeom.size} />
      <meshStandardMaterial 
        color="#00FF44"
        transparent
        opacity={0.15}
        emissive="#00FF44"
        emissiveIntensity={0.5}
      />
    </mesh>
  );
}

function DensityHalos() {
  const lanes = ['NORTH', 'SOUTH', 'EAST', 'WEST'] as const;
  const getDensity = useGlobalTrafficStore(s => s.getDensity);

  const positions: any = {
    NORTH: [-1.75, 0.1, -25],
    SOUTH: [1.75, 0.1, 25],
    EAST: [25, 0.1, -1.75],
    WEST: [-25, 0.1, 1.75],
  };

  return (
    <group>
      {lanes.map(lane => {
        const d = getDensity(lane);
        const color = d > 0.75 ? '#FF3366' : d > 0.45 ? '#FFD700' : '#00FF88';
        return (
          <mesh key={lane} position={positions[lane]} rotation={[-Math.PI/2, 0, 0]}>
            <ringGeometry args={[4, 4.5, 32]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} transparent opacity={0.3} />
          </mesh>
        );
      })}
    </group>
  );
}

export const JunctionScene = () => {
  const emergency = useGlobalTrafficStore(s => s.getEmergency());
  const [nightMode, setNightMode] = useState(true);
  const [cameraPreset, setCameraPreset] = useState('overview');

  return (
    <div className="w-full h-full relative">
      <Canvas
        shadows
        gl={{ antialias: true, alpha: false }}
        className="bg-[#10141D]"
      >
        <PerspectiveCamera makeDefault position={[0, 22, 25]} fov={55} />
        <Stars radius={100} depth={60} count={5000} factor={4} fade />
        
        <ambientLight 
          color="#1a2036" 
          intensity={0.8} 
        />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <directionalLight
          position={[15, 30, 10]}
          intensity={0.5}
          color="#ffffff"
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        
        <Suspense fallback={null}>
          <Environment preset="city" />
          <Road />
          
          <TrafficSignal lane="NORTH" />
          <TrafficSignal lane="SOUTH" />
          <TrafficSignal lane="EAST" />
          <TrafficSignal lane="WEST" />
          
          <VehicleRenderer />
          
          {emergency.active && emergency.lane && (
            <GreenCorridor lane={emergency.lane} />
          )}
          
          <DensityHalos />
          
          <EffectComposer>
            <Bloom 
              intensity={0.6}
              luminanceThreshold={0.9}
              luminanceSmoothing={0.9}
            />
            <Vignette offset={0.5} darkness={0.9} />
          </EffectComposer>
        </Suspense>

        <OrbitControls
          target={[0, 2, 0]}
          maxPolarAngle={Math.PI / 2.05}
          minDistance={10}
          maxDistance={100}
          enableDamping
        />
      </Canvas>

      <SimulationControls 
        nightMode={nightMode}
        onNightToggle={() => setNightMode(!nightMode)}
        cameraPreset={cameraPreset}
        onCameraChange={setCameraPreset}
      />
    </div>
  );
};

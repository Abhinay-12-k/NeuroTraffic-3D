import * as THREE from 'three';
import { useMemo } from 'react';

function Crosswalk({ position, rotation }: { position: [number, number, number], rotation: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {Array.from({length: 6}, (_, i) => (
        <mesh key={i} rotation={[-Math.PI/2, 0, 0]} position={[i * 0.9 - 2.25, 0, 0]}>
          <planeGeometry args={[0.5, 3]} />
          <meshStandardMaterial color="#EEEEEE" emissive="#FFFFFF" emissiveIntensity={0.2} />
        </mesh>
      ))}
    </group>
  );
}

function Streetlight({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 3, 0]}>
        <cylinderGeometry args={[0.1, 0.15, 6, 8]} />
        <meshStandardMaterial color="#111111" metalness={0.8} />
      </mesh>
      <mesh position={[0.5, 6, 0]}>
        <boxGeometry args={[1, 0.1, 0.2]} />
        <meshStandardMaterial color="#111111" />
      </mesh>
      <mesh position={[1, 5.9, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#ffeeaa" emissive="#ffeeaa" emissiveIntensity={4} />
      </mesh>
      <pointLight position={[1, 5.8, 0]} intensity={2.5} distance={20} color="#ffeeaa" />
    </group>
  );
}

function Building({ x, z, w, d, h }: any) {
  const halfH = h / 2;
  const windowRows = Math.floor(h / 6);
  const windowCols = Math.floor(w / 4);
  
  return (
    <group position={[x, halfH, z]}>
      {/* Main Structure */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color="#0A0C10" roughness={0.3} metalness={0.9} />
      </mesh>
      
      {/* Neon Edge Highlights */}
      <mesh position={[0, halfH + 0.1, 0]}>
        <boxGeometry args={[w * 1.01, 0.4, d * 1.01]} />
        <meshStandardMaterial color="#C89B3C" emissive="#C89B3C" emissiveIntensity={0.4} />
      </mesh>

      {/* Cyber Windows */}
      {Array.from({length: windowRows}, (_, row) =>
        Array.from({length: windowCols}, (_, col) => {
          const isGlowing = Math.random() > 0.4;
          return (
            <mesh key={`w-${row}-${col}`}
              position={[
                (col - (windowCols-1)/2) * 3.5,
                (row - windowRows/2 + 0.5) * 5,
                d/2 + 0.05
              ]}>
              <planeGeometry args={[1.5, 2.2]} />
              <meshStandardMaterial 
                color={isGlowing ? "#FFFFFF" : "#1a1a1a"} 
                emissive={isGlowing ? "#FFFFAA" : "#000000"}
                emissiveIntensity={0.6}
                transparent 
                opacity={isGlowing ? 0.9 : 0.2} 
              />
            </mesh>
          );
        })
      )}
    </group>
  );
}

function CityBlock({ position, flipX, flipZ }: any) {
  const buildings = [
    { x: 0,  z: 0,  w: 22, d: 16, h: 50 },
    { x: 25, z: 5,  w: 16, d: 22, h: 35 },
    { x: 5,  z: 25, w: 20, d: 16, h: 25 },
    { x: 25, z: 25, w: 16, d: 16, h: 70 },
  ];
  
  return (
    <group position={position} rotation={[0, (flipX ? Math.PI : 0) + (flipZ ? Math.PI/2 : 0), 0]}>
      {buildings.map((b, i) => (
        <Building key={i} {...b} />
      ))}
    </group>
  );
}

export const Road = () => {
  return (
    <group>
      {/* GROUND BASE - Slightly lighter */}
      <mesh rotation={[-Math.PI/2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[2000, 2000]} />
        <meshStandardMaterial color="#0A0C14" roughness={1} />
      </mesh>
      
      {/* ROADS - Dark Gray for visibility */}
      <mesh rotation={[-Math.PI/2, 0, 0]} position={[0, 0.001, 0]} receiveShadow>
        <planeGeometry args={[1000, 14.5]} />
        <meshStandardMaterial color="#222222" roughness={0.4} metalness={0.6} />
      </mesh>
      <mesh rotation={[-Math.PI/2, 0, 0]} position={[0, 0.001, 0]} receiveShadow>
        <planeGeometry args={[14.5, 1000]} />
        <meshStandardMaterial color="#222222" roughness={0.4} metalness={0.6} />
      </mesh>
      
      {/* INTERSECTION CENTER */}
      <mesh rotation={[-Math.PI/2, 0, 0]} position={[0, 0.002, 0]}>
        <planeGeometry args={[14.6, 14.6]} />
        <meshStandardMaterial color="#2A2A2A" roughness={0.3} />
      </mesh>
      
      {/* LANE MARKINGS - Cyber White */}
      {Array.from({length: 125}, (_, i) => (
        <mesh key={`ew-dash-${i}`} rotation={[-Math.PI/2, 0, 0]} position={[(i - 62) * 8 + 4, 0.005, 0]}>
          <planeGeometry args={[4, 0.25]} />
          <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={0.2} />
        </mesh>
      ))}
      {Array.from({length: 125}, (_, i) => (
        <mesh key={`ns-dash-${i}`} rotation={[-Math.PI/2, 0, 0]} position={[0, 0.005, (i - 62) * 8 + 4]}>
          <planeGeometry args={[0.25, 4]} />
          <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={0.2} />
        </mesh>
      ))}

      {/* STOP LINES */}
      {[{ p: [0, 0.01, -7.5], r: 0 }, { p: [0, 0.01, 7.5], r: 0 }, { p: [-7.5, 0.01, 0], r: Math.PI/2 }, { p: [7.5, 0.01, 0], r: Math.PI/2 }].map((sl, i) => (
        <mesh key={`stop-${i}`} rotation={[-Math.PI/2, sl.r, 0]} position={sl.p as any}>
          <planeGeometry args={[14.5, 0.8]} />
          <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={0.4} />
        </mesh>
      ))}

      <Crosswalk position={[11.5, 0.008, -7.2]} rotation={0} />
      <Crosswalk position={[11.5, 0.008, 7.2]} rotation={0} />
      <Crosswalk position={[-11.5, 0.008, -7.2]} rotation={0} />
      <Crosswalk position={[-11.5, 0.008, 7.2]} rotation={0} />

      <CityBlock position={[-55, 0, -55]} />
      <CityBlock position={[55, 0, -55]} flipX />
      <CityBlock position={[-55, 0, 55]} flipZ />
      <CityBlock position={[55, 0, 55]} flipX flipZ />

      <Streetlight position={[-8, 0, -22]} />
      <Streetlight position={[8, 0, 22]} />
      <Streetlight position={[-22, 0, 8]} />
      <Streetlight position={[22, 0, -8]} />
    </group>
  );
};

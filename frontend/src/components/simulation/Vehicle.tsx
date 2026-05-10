import React from 'react';
import { useSpring, animated } from '@react-spring/three';

export const CarMesh = ({ color }: any) => (
  <group>
    <mesh position={[0, 0.45, 0]} castShadow>
      <boxGeometry args={[4.0, 0.9, 1.8]} />
      <meshStandardMaterial color={color} roughness={0.4} />
    </mesh>
    <mesh position={[-0.2, 1.1, 0]} castShadow>
      <boxGeometry args={[2.2, 0.6, 1.6]} />
      <meshStandardMaterial color="#111" transparent opacity={0.6} />
    </mesh>
    {/* Wheels */}
    {[[-1.2, -0.9], [1.2, -0.9], [-1.2, 0.9], [1.2, 0.9]].map(([x, z], i) => (
      <mesh key={i} position={[x, 0.25, z]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.3, 16]} />
        <meshStandardMaterial color="#111" />
      </mesh>
    ))}
  </group>
);

export const TruckMesh = ({ color }: any) => (
  <group>
    <mesh position={[-1, 0.6, 0]} castShadow>
      <boxGeometry args={[4.5, 1.2, 2.2]} />
      <meshStandardMaterial color={color || '#555'} />
    </mesh>
    <mesh position={[1.8, 1.0, 0]} castShadow>
      <boxGeometry args={[1.5, 2.0, 2.2]} />
      <meshStandardMaterial color="#222" />
    </mesh>
    {/* Trailer Wheels */}
    {Array.from({length: 6}).map((_, i) => (
      <mesh key={i} position={[i * 0.8 - 2, 0.3, 1.1]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 0.4, 16]} />
        <meshStandardMaterial color="#111" />
      </mesh>
    ))}
  </group>
);

export const BusMesh = ({ color }: any) => (
  <group>
    <mesh position={[0, 1.2, 0]} castShadow>
      <boxGeometry args={[9.0, 2.4, 2.5]} />
      <meshStandardMaterial color={color || '#FFD700'} />
    </mesh>
    {Array.from({length: 4}).map((_, i) => (
      <mesh key={i} position={[i * 2.5 - 3.75, 0.4, 1.2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.4, 16]} />
        <meshStandardMaterial color="#111" />
      </mesh>
    ))}
  </group>
);

export const MotorcycleMesh = ({ color }: any) => (
  <group>
    <mesh position={[0, 0.6, 0]} castShadow>
      <boxGeometry args={[2.0, 0.4, 0.6]} />
      <meshStandardMaterial color={color} />
    </mesh>
    <mesh position={[0.8, 0.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.3, 0.3, 0.1, 16]} />
      <meshStandardMaterial color="#111" />
    </mesh>
    <mesh position={[-0.8, 0.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.3, 0.3, 0.1, 16]} />
      <meshStandardMaterial color="#111" />
    </mesh>
  </group>
);

import { Html } from '@react-three/drei';

export const AmbulanceMesh = () => {
    const { lightColor, boxScale } = useSpring({
      from: { lightColor: '#ff0000', boxScale: 1 },
      to: async (next) => {
        while (true) {
          await next({ lightColor: '#0000ff', boxScale: 1.1 });
          await next({ lightColor: '#ff0000', boxScale: 1 });
        }
      },
      config: { duration: 300 }
    });
    
    return (
      <group>
        {/* AI DETECTION HIGHLIGHT */}
        <animated.mesh scale={boxScale as any} position={[0, 0.5, 0]}>
          <boxGeometry args={[6.5, 3.5, 3.5]} />
          <meshStandardMaterial 
            color="#C89B3C" 
            wireframe 
            transparent 
            opacity={0.3} 
            emissive="#C89B3C" 
            emissiveIntensity={1} 
          />
        </animated.mesh>

        {/* FLOATING AI LABEL & ARROW */}
        <Html position={[0, 4.5, 0]} center>
          <div className="flex flex-col items-center pointer-events-none">
            <div className="bg-sprint-sidebar text-white font-body font-bold px-6 py-2 rounded-full text-sm shadow-soft border border-sprint-gold whitespace-nowrap uppercase tracking-widest">
              Emergency Priority Active
            </div>
            {/* Arrow */}
            <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[12px] border-t-sprint-sidebar mt-1 shadow-lg"></div>
          </div>
        </Html>

        <mesh position={[0, 1.1, 0]} castShadow>
          <boxGeometry args={[4.8, 2.2, 2.0]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        
        {/* GPU-SAFE SIRENS */}
        <animated.mesh position={[0.8, 2.3, 0.5]}>
          <boxGeometry args={[0.5, 0.2, 0.5]} />
          <animated.meshStandardMaterial color={lightColor as any} emissive={lightColor as any} emissiveIntensity={15} />
        </animated.mesh>
        <animated.mesh position={[-0.8, 2.3, -0.5]}>
          <boxGeometry args={[0.5, 0.2, 0.5]} />
          <animated.meshStandardMaterial color={lightColor as any} emissive={lightColor as any} emissiveIntensity={15} />
        </animated.mesh>
      </group>
    );
};

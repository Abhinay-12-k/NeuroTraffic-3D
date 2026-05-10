import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import type { RenderVehicle } from '../../hooks/useVehiclePhysics';

interface InstancedVehiclesProps {
  vehicleData: Record<string, RenderVehicle[]>;
}

export const InstancedVehicles = ({ vehicleData }: InstancedVehiclesProps) => {
  const carBodyRef = useRef<THREE.InstancedMesh>(null);
  const carRoofRef = useRef<THREE.InstancedMesh>(null);
  const carWindowRef = useRef<THREE.InstancedMesh>(null);
  const carLightRef = useRef<THREE.InstancedMesh>(null);

  const busMeshRef = useRef<THREE.InstancedMesh>(null);
  const truckMeshRef = useRef<THREE.InstancedMesh>(null);

  const allVehicles = useMemo(() => Object.values(vehicleData).flat(), [vehicleData]);

  const cars = useMemo(() => allVehicles.filter(v => v.type === 'car'), [allVehicles]);
  const buses = useMemo(() => allVehicles.filter(v => v.type === 'bus'), [allVehicles]);
  const trucks = useMemo(() => allVehicles.filter(v => v.type === 'truck'), [allVehicles]);

  useFrame(() => {
    // Update Cars (Composite model)
    if (carBodyRef.current && carRoofRef.current && carWindowRef.current && carLightRef.current) {
      cars.forEach((v, i) => {
        const matrix = new THREE.Matrix4();
        const pos = new THREE.Vector3(...v.position);
        const rot = new THREE.Euler(...v.rotation);
        const quat = new THREE.Quaternion().setFromEuler(rot);

        // Body
        matrix.compose(pos.clone().add(new THREE.Vector3(0, 0.35, 0)), quat, new THREE.Vector3(1, 1, 1));
        carBodyRef.current!.setMatrixAt(i, matrix);
        carBodyRef.current!.setColorAt(i, new THREE.Color(v.color));

        // Roof
        matrix.compose(pos.clone().add(new THREE.Vector3(0, 0.75, -0.2).applyQuaternion(quat)), quat, new THREE.Vector3(1, 1, 1));
        carRoofRef.current!.setMatrixAt(i, matrix);
        carRoofRef.current!.setColorAt(i, new THREE.Color(v.color));

        // Window
        matrix.compose(pos.clone().add(new THREE.Vector3(0, 0.75, -0.2).applyQuaternion(quat)), quat, new THREE.Vector3(1, 1, 1));
        carWindowRef.current!.setMatrixAt(i, matrix);

        // Lights
        matrix.compose(pos.clone().add(new THREE.Vector3(0, 0.4, 1.0).applyQuaternion(quat)), quat, new THREE.Vector3(1, 1, 1));
        carLightRef.current!.setMatrixAt(i, matrix);
      });

      [carBodyRef, carRoofRef, carWindowRef, carLightRef].forEach(ref => {
        ref.current!.instanceMatrix.needsUpdate = true;
        if (ref.current!.instanceColor) ref.current!.instanceColor.needsUpdate = true;
        ref.current!.count = cars.length;
      });
    }

    // Update Buses
    if (busMeshRef.current) {
      buses.forEach((v, i) => {
        const matrix = new THREE.Matrix4();
        matrix.compose(
          new THREE.Vector3(...v.position).add(new THREE.Vector3(0, 0.9, 0)),
          new THREE.Quaternion().setFromEuler(new THREE.Euler(...v.rotation)),
          new THREE.Vector3(1, 1, 1)
        );
        busMeshRef.current!.setMatrixAt(i, matrix);
        busMeshRef.current!.setColorAt(i, new THREE.Color('#e8c547'));
      });
      busMeshRef.current.instanceMatrix.needsUpdate = true;
      if (busMeshRef.current.instanceColor) busMeshRef.current.instanceColor.needsUpdate = true;
      busMeshRef.current.count = buses.length;
    }

    // Update Trucks
    if (truckMeshRef.current) {
      trucks.forEach((v, i) => {
        const matrix = new THREE.Matrix4();
        matrix.compose(
          new THREE.Vector3(...v.position).add(new THREE.Vector3(0, 1.1, 0)),
          new THREE.Quaternion().setFromEuler(new THREE.Euler(...v.rotation)),
          new THREE.Vector3(1, 1, 1)
        );
        truckMeshRef.current!.setMatrixAt(i, matrix);
      });
      truckMeshRef.current.instanceMatrix.needsUpdate = true;
      truckMeshRef.current.count = trucks.length;
    }
  });

  return (
    <group>
      {/* --- CAR INSTANCES --- */}
      <instancedMesh ref={carBodyRef} args={[undefined, undefined, 100]} castShadow>
        <boxGeometry args={[1, 0.5, 2.2]} />
        <meshStandardMaterial roughness={0.3} metalness={0.7} />
      </instancedMesh>
      
      <instancedMesh ref={carRoofRef} args={[undefined, undefined, 100]} castShadow>
        <boxGeometry args={[0.9, 0.4, 1.2]} />
        <meshStandardMaterial roughness={0.3} metalness={0.7} />
      </instancedMesh>

      <instancedMesh ref={carWindowRef} args={[undefined, undefined, 100]}>
        <boxGeometry args={[0.91, 0.3, 1.1]} />
        <meshStandardMaterial color="#000000" transparent opacity={0.7} />
      </instancedMesh>

      <instancedMesh ref={carLightRef} args={[undefined, undefined, 100]}>
        <boxGeometry args={[0.8, 0.1, 0.1]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={4} />
      </instancedMesh>

      {/* --- BUS INSTANCES --- */}
      <instancedMesh ref={busMeshRef} args={[undefined, undefined, 20]} castShadow>
        <boxGeometry args={[1.2, 1.8, 5]} />
        <meshStandardMaterial roughness={0.5} />
      </instancedMesh>

      {/* --- TRUCK INSTANCES --- */}
      <instancedMesh ref={truckMeshRef} args={[undefined, undefined, 20]} castShadow>
        <boxGeometry args={[1.4, 2.2, 4]} />
        <meshStandardMaterial color="#333333" />
      </instancedMesh>
    </group>
  );
};

import { useMemo } from 'react';
import type { GlobalTrafficState, VehiclePhysicsState } from '../types/traffic.types';

const LANE_ENTRY_POINTS: any = {
  NORTH: { start: [0, 0, -38], end: [0, 0, -7], exitEnd: [0, 0, 7] },
  SOUTH: { start: [0, 0,  38], end: [0, 0,  7], exitEnd: [0, 0, -7] },
  EAST:  { start: [38, 0,  0], end: [7, 0,  0], exitEnd: [-7, 0,  0] },
  WEST:  { start: [-38, 0, 0], end: [-7, 0, 0], exitEnd: [7, 0,  0] },
};

const LANE_ROTATION: any = {
  NORTH: [0, Math.PI, 0],   // faces south
  SOUTH: [0, 0, 0],          // faces north
  EAST:  [0, -Math.PI/2, 0], // faces west
  WEST:  [0, Math.PI/2, 0],  // faces east
};

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function lerpVector3(start: number[], end: number[], t: number): [number, number, number] {
  return [
    lerp(start[0], end[0], t),
    lerp(start[1], end[1], t),
    lerp(start[2], end[2], t)
  ];
}

export interface RenderVehicle extends VehiclePhysicsState {
  position: [number, number, number];
  rotation: [number, number, number];
  isMoving: boolean;
  isAmbulance: boolean;
}

export const useVehiclePhysics = (state: GlobalTrafficState | null) => {
  return useMemo(() => {
    const renderData: Record<string, RenderVehicle[]> = {
      NORTH: [], SOUTH: [], EAST: [], WEST: []
    };

    if (!state || !state.lanes) return renderData;

    Object.keys(state.lanes).forEach((laneKey: any) => {
      const lane = state.lanes[laneKey as keyof typeof state.lanes];
      if (!lane) return;
      
      const positions = lane.vehiclePositions || [];

      renderData[laneKey] = positions.map(v => {
        const { start, end, exitEnd } = LANE_ENTRY_POINTS[laneKey];
        let position: [number, number, number];

        if (v.laneProgress <= 1.0) {
          position = lerpVector3(start, end, v.laneProgress);
        } else {
          const t = v.laneProgress - 1.0;
          position = lerpVector3(end, exitEnd, t);
        }

        return {
          ...v,
          position,
          rotation: LANE_ROTATION[laneKey] as [number, number, number],
          isMoving: v.state === 'moving' || v.state === 'crossing',
          isAmbulance: v.type === 'ambulance'
        };
      });
    });

    return renderData;
  }, [state]);
};

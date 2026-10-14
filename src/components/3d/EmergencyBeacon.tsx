import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCity } from '../../context/CityContext';

export const EmergencyBeacon: React.FC = () => {
  const { incidents, telemetry } = useCity();
  const ringRef = useRef<THREE.Mesh>(null);
  const pinRef = useRef<THREE.Group>(null);

  // Find active incident zone
  const activeIncident = incidents.find((i) => i.status === 'detected' || i.status === 'triaged' || i.status === 'dispatched');
  if (!activeIncident) return null;

  const targetZone = telemetry.zones.find((z) => z.id === activeIncident.zoneId) || telemetry.zones[0];
  const [posX, , posZ] = targetZone.center;

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (ringRef.current) {
      const scale = 1 + (time * 2.5) % 3;
      ringRef.current.scale.set(scale, scale, 1);
      (ringRef.current.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 1 - scale / 4);
    }

    if (pinRef.current) {
      pinRef.current.position.y = 8 + Math.sin(time * 4) * 0.5;
      pinRef.current.rotation.y = time * 2;
    }
  });

  return (
    <group position={[posX, 0.2, posZ]}>
      {/* Ground Pulsing Radar Wave */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0]}>
        <ringGeometry args={[1, 1.3, 32]} />
        <meshBasicMaterial
          color="#EF4444"
          transparent
          opacity={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Floating 3D Warning Beacon */}
      <group ref={pinRef} position={[0, 8, 0]}>
        <mesh position={[0, 0, 0]}>
          <octahedronGeometry args={[1.2, 0]} />
          <meshBasicMaterial color="#EF4444" wireframe />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <octahedronGeometry args={[0.7, 0]} />
          <meshBasicMaterial color="#F87171" transparent opacity={0.7} />
        </mesh>

        {/* Vertical Light Column connecting to ground */}
        <mesh position={[0, -4, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 8, 16]} />
          <meshBasicMaterial color="#EF4444" transparent opacity={0.6} />
        </mesh>
      </group>
    </group>
  );
};

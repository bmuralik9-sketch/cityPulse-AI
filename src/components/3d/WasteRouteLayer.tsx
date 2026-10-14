import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCity } from '../../context/CityContext';

export const WasteRouteLayer: React.FC = () => {
  const { wasteRoute } = useCity();
  const truckRef = useRef<THREE.Group>(null);
  const progressRef = useRef<number>(0);

  // Build curve from coordinates
  const curve = useMemo(() => {
    const points = wasteRoute.coordinatesPath.map(
      (p) => new THREE.Vector3(p[0], p[1], p[2])
    );
    return new THREE.CatmullRomCurve3(points, true);
  }, [wasteRoute.coordinatesPath]);

  // Line geometry for the route
  const linePoints = useMemo(() => {
    return curve.getPoints(100);
  }, [curve]);

  const lineGeometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(linePoints);
  }, [linePoints]);

  useFrame((_, delta) => {
    if (!truckRef.current) return;

    if (wasteRoute.status === 'en_route') {
      progressRef.current = (progressRef.current + delta * 0.08) % 1;
      const pos = curve.getPointAt(progressRef.current);
      const tangent = curve.getTangentAt(progressRef.current);

      truckRef.current.position.copy(pos);
      truckRef.current.position.y += 0.4;
      truckRef.current.lookAt(pos.clone().add(tangent));
      truckRef.current.visible = true;
    } else {
      // Park at depot
      const startPos = curve.getPointAt(0);
      truckRef.current.position.copy(startPos);
      truckRef.current.position.y += 0.4;
      truckRef.current.visible = wasteRoute.status === 'completed' || wasteRoute.status === 'idle';
    }
  });

  return (
    <group>
      {/* Route Path Polyline */}
      <line geometry={lineGeometry}>
        <lineBasicMaterial
          color="#10B981"
          linewidth={2}
          transparent
          opacity={0.8}
        />
      </line>

      {/* Collection Waypoints */}
      {wasteRoute.coordinatesPath.map((pt, idx) => (
        <mesh key={idx} position={[pt[0], 0.35, pt[2]]}>
          <cylinderGeometry args={[0.3, 0.3, 0.2, 12]} />
          <meshBasicMaterial
            color={idx === 0 ? '#3B82F6' : '#10B981'}
            transparent
            opacity={0.9}
          />
        </mesh>
      ))}

      {/* Smart Garbage Truck 3D Marker */}
      <group ref={truckRef}>
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[0.7, 0.45, 1.2]} />
          <meshStandardMaterial color="#10B981" emissive="#065F46" roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.45, 0.1]}>
          <boxGeometry args={[0.6, 0.3, 0.5]} />
          <meshStandardMaterial color="#047857" roughness={0.3} />
        </mesh>
        {/* Flashing Beacon */}
        <mesh position={[0, 0.65, 0.1]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshBasicMaterial color="#FBBF24" />
        </mesh>
      </group>
    </group>
  );
};

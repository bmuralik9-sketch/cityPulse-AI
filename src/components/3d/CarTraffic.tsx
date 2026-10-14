import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface RealisticCar {
  x: number;
  y: number;
  z: number;
  speed: number;
  axis: 'x' | 'z';
  direction: 1 | -1;
  color: THREE.Color;
  range: number;
}

export const CarTraffic: React.FC<{ count?: number }> = ({ count = 80 }) => {
  const bodyMeshRef = useRef<THREE.InstancedMesh>(null);
  const headLightMeshRef = useRef<THREE.InstancedMesh>(null);
  const tailLightMeshRef = useRef<THREE.InstancedMesh>(null);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Road coordinates matching RealisticRoadNetwork
  const roadStreets = useMemo(() => [-22, -11, 0, 11, 22], []);
  const roadAvenues = useMemo(() => [-22, -11, 0, 11, 22], []);

  const cars = useMemo<RealisticCar[]>(() => {
    const list: RealisticCar[] = [];
    // Realistic automobile colors: silver, dark blue, white, black, red, yellow cab
    const carPalette = [
      new THREE.Color('#cbd5e1'), // Silver
      new THREE.Color('#0284c7'), // Blue
      new THREE.Color('#f8fafc'), // White
      new THREE.Color('#1e293b'), // Midnight Grey
      new THREE.Color('#dc2626'), // Red
      new THREE.Color('#eab308'), // Yellow Taxi
    ];

    for (let i = 0; i < count; i++) {
      const isXAxis = Math.random() > 0.5;
      const speed = 0.12 + Math.random() * 0.18;
      const direction = Math.random() > 0.5 ? 1 : -1;
      const color = carPalette[Math.floor(Math.random() * carPalette.length)];

      if (isXAxis) {
        const roadZ =
          roadAvenues[Math.floor(Math.random() * roadAvenues.length)] +
          (direction > 0 ? 0.7 : -0.7);
        list.push({
          x: (Math.random() - 0.5) * 65,
          y: 0.18,
          z: roadZ,
          speed,
          axis: 'x',
          direction,
          color,
          range: 34,
        });
      } else {
        const roadX =
          roadStreets[Math.floor(Math.random() * roadStreets.length)] +
          (direction > 0 ? 0.7 : -0.7);
        list.push({
          x: roadX,
          y: 0.18,
          z: (Math.random() - 0.5) * 65,
          speed,
          axis: 'z',
          direction,
          color,
          range: 34,
        });
      }
    }
    return list;
  }, [count, roadStreets, roadAvenues]);

  // Set initial car body colors
  React.useEffect(() => {
    if (!bodyMeshRef.current) return;
    cars.forEach((car, i) => {
      bodyMeshRef.current?.setColorAt(i, car.color);
    });
    if (bodyMeshRef.current.instanceColor) {
      bodyMeshRef.current.instanceColor.needsUpdate = true;
    }
  }, [cars]);

  useFrame((_, delta) => {
    if (!bodyMeshRef.current || !headLightMeshRef.current || !tailLightMeshRef.current) return;

    cars.forEach((car, i) => {
      if (car.axis === 'x') {
        car.x += car.speed * car.direction * (delta * 60);
        if (car.direction > 0 && car.x > car.range) car.x = -car.range;
        if (car.direction < 0 && car.x < -car.range) car.x = car.range;

        // Vehicle body
        dummy.position.set(car.x, car.y, car.z);
        dummy.rotation.set(0, car.direction > 0 ? 0 : Math.PI, 0);
        dummy.scale.set(1.2, 0.35, 0.6);
        dummy.updateMatrix();
        bodyMeshRef.current?.setMatrixAt(i, dummy.matrix);

        // Headlight (front)
        dummy.position.set(car.x + (car.direction > 0 ? 0.65 : -0.65), car.y + 0.05, car.z);
        dummy.scale.set(0.15, 0.12, 0.45);
        dummy.updateMatrix();
        headLightMeshRef.current?.setMatrixAt(i, dummy.matrix);

        // Taillight (rear)
        dummy.position.set(car.x + (car.direction > 0 ? -0.65 : 0.65), car.y + 0.05, car.z);
        dummy.scale.set(0.12, 0.12, 0.45);
        dummy.updateMatrix();
        tailLightMeshRef.current?.setMatrixAt(i, dummy.matrix);
      } else {
        car.z += car.speed * car.direction * (delta * 60);
        if (car.direction > 0 && car.z > car.range) car.z = -car.range;
        if (car.direction < 0 && car.z < -car.range) car.z = car.range;

        // Vehicle body
        dummy.position.set(car.x, car.y, car.z);
        dummy.rotation.set(0, car.direction > 0 ? Math.PI / 2 : -Math.PI / 2, 0);
        dummy.scale.set(1.2, 0.35, 0.6);
        dummy.updateMatrix();
        bodyMeshRef.current?.setMatrixAt(i, dummy.matrix);

        // Headlight (front)
        dummy.position.set(car.x, car.y + 0.05, car.z + (car.direction > 0 ? 0.65 : -0.65));
        dummy.scale.set(0.45, 0.12, 0.15);
        dummy.updateMatrix();
        headLightMeshRef.current?.setMatrixAt(i, dummy.matrix);

        // Taillight (rear)
        dummy.position.set(car.x, car.y + 0.05, car.z + (car.direction > 0 ? -0.65 : 0.65));
        dummy.scale.set(0.45, 0.12, 0.12);
        dummy.updateMatrix();
        tailLightMeshRef.current?.setMatrixAt(i, dummy.matrix);
      }
    });

    bodyMeshRef.current.instanceMatrix.needsUpdate = true;
    headLightMeshRef.current.instanceMatrix.needsUpdate = true;
    tailLightMeshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      {/* Automobile Body */}
      <instancedMesh ref={bodyMeshRef} args={[undefined, undefined, count]} frustumCulled={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial metalness={0.8} roughness={0.2} />
      </instancedMesh>

      {/* Headlights (Warm White Glow) */}
      <instancedMesh ref={headLightMeshRef} args={[undefined, undefined, count]} frustumCulled={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#fef08a" />
      </instancedMesh>

      {/* Taillights (Red Glow) */}
      <instancedMesh ref={tailLightMeshRef} args={[undefined, undefined, count]} frustumCulled={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#ef4444" />
      </instancedMesh>
    </group>
  );
};

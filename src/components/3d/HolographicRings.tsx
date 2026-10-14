import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const HolographicRings: React.FC = () => {
  const outerRingRef = useRef<THREE.Mesh>(null);
  const midRingRef = useRef<THREE.Mesh>(null);
  const innerRingRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);

  // Generate floating AI data particle positions
  const particleCount = 200;
  const particlePositions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 45;
      pos[i * 3 + 1] = 8 + Math.random() * 25;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 45;
    }
    return pos;
  }, [particleCount]);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    if (outerRingRef.current) {
      outerRingRef.current.rotation.z = time * 0.12;
      outerRingRef.current.rotation.x = Math.PI / 2 + Math.sin(time * 0.4) * 0.15;
      outerRingRef.current.position.y = 16 + Math.sin(time * 0.7) * 0.8;
    }

    if (midRingRef.current) {
      midRingRef.current.rotation.z = -time * 0.18;
      midRingRef.current.rotation.y = Math.cos(time * 0.3) * 0.2;
      midRingRef.current.position.y = 16.5 + Math.sin(time * 0.7 + 1) * 0.8;
    }

    if (innerRingRef.current) {
      innerRingRef.current.rotation.z = time * 0.28;
      innerRingRef.current.position.y = 17 + Math.sin(time * 0.7 + 2) * 0.8;
    }

    if (particlesRef.current) {
      particlesRef.current.rotation.y = time * 0.03;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Outer Hologram Ring */}
      <mesh ref={outerRingRef} position={[0, 16, 0]}>
        <torusGeometry args={[14, 0.08, 16, 100]} />
        <meshBasicMaterial color="#22D3EE" transparent opacity={0.65} wireframe />
      </mesh>

      {/* Mid Ring */}
      <mesh ref={midRingRef} position={[0, 16.5, 0]}>
        <torusGeometry args={[9.5, 0.06, 16, 80]} />
        <meshBasicMaterial color="#8B5CF6" transparent opacity={0.6} />
      </mesh>

      {/* Inner Ring with Segmented Dash look */}
      <mesh ref={innerRingRef} position={[0, 17, 0]}>
        <torusGeometry args={[5, 0.08, 12, 48]} />
        <meshBasicMaterial color="#67E8F9" transparent opacity={0.8} wireframe />
      </mesh>

      {/* Center AI Core Pulse Orb */}
      <mesh position={[0, 16.5, 0]}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshBasicMaterial color="#22D3EE" transparent opacity={0.4} />
      </mesh>

      {/* Floating Data Particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particlePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.22}
          color="#38BDF8"
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
};

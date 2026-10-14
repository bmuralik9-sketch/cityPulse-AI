import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// 1. Procedural Realistic Skyscraper Facade Canvas Texture
export function createSkyscraperTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Dark architectural glass base
  ctx.fillStyle = '#080d1a';
  ctx.fillRect(0, 0, 256, 512);

  // Vertical structural columns (mullions)
  ctx.fillStyle = '#1e293b';
  for (let x = 0; x < 256; x += 16) {
    ctx.fillRect(x, 0, 2, 512);
  }

  // Window grid with realistic office illumination
  const cols = 14;
  const rows = 32;
  const w = 10;
  const h = 9;
  const startX = 6;
  const startY = 8;
  const gapX = 6;
  const gapY = 6;

  for (let r = 0; r < rows; r++) {
    // Floor floor slabs
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, startY + r * (h + gapY) - 2, 256, 2);

    for (let c = 0; c < cols; c++) {
      const isLit = Math.random() > 0.42;
      const x = startX + c * (w + gapX);
      const y = startY + r * (h + gapY);

      if (isLit) {
        const rand = Math.random();
        if (rand > 0.65) {
          ctx.fillStyle = '#fef08a'; // Warm amber office light
        } else if (rand > 0.3) {
          ctx.fillStyle = '#e0f2fe'; // Cool white LED light
        } else {
          ctx.fillStyle = '#67e8f9'; // Cyber cyan glow
        }
      } else {
        // Unlit window reflecting night sky
        ctx.fillStyle = Math.random() > 0.5 ? '#0b1329' : '#070b18';
      }

      ctx.fillRect(x, y, w, h);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// Procedural Photorealistic Satellite Orthophoto Earth Texture
export function createSatelliteGroundTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // 1. Earth terrain base (urban satellite brown-grey & vegetation)
  ctx.fillStyle = '#1c2833';
  ctx.fillRect(0, 0, 512, 512);

  // 2. Coastal water body on West/Southwest
  ctx.fillStyle = '#0f3854';
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(160, 0);
  ctx.bezierCurveTo(180, 160, 140, 360, 200, 512);
  ctx.lineTo(0, 512);
  ctx.closePath();
  ctx.fill();

  // 3. Sandy coastal shoreline
  ctx.strokeStyle = '#4a5568';
  ctx.lineWidth = 6;
  ctx.stroke();

  // 4. Green parklands & tree canopies
  ctx.fillStyle = '#1e3a1e';
  ctx.fillRect(320, 320, 150, 150);
  ctx.fillStyle = '#14532d';
  ctx.fillRect(340, 340, 110, 110);

  // 5. Urban grid blocks (satellite roofs & industrial lots)
  ctx.fillStyle = '#2d3748';
  for (let x = 180; x < 500; x += 40) {
    for (let y = 30; y < 480; y += 40) {
      if (x > 320 && y > 320) continue; // Park
      ctx.fillStyle = Math.random() > 0.4 ? '#334155' : '#1e293b';
      ctx.fillRect(x + 4, y + 4, 32, 32);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

// 2. Realistic Asphalt Roads with Lane Striping and Crosswalks
export const RealisticRoadNetwork: React.FC<{ isSatellite?: boolean }> = ({ isSatellite }) => {
  const roadTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Dark asphalt
    ctx.fillStyle = '#111827';
    ctx.fillRect(0, 0, 512, 512);

    // Subtle asphalt grain texture
    for (let i = 0; i < 4000; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      ctx.fillStyle = Math.random() > 0.5 ? '#1f2937' : '#030712';
      ctx.fillRect(x, y, 1, 1);
    }

    // Yellow double center divider line
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(253, 0, 2, 512);
    ctx.fillRect(257, 0, 2, 512);

    // White dashed lane markings
    ctx.fillStyle = '#f8fafc';
    for (let y = 0; y < 512; y += 32) {
      ctx.fillRect(128, y, 2, 16);
      ctx.fillRect(384, y, 2, 16);
    }

    // Crosswalk pedestrian zebra stripes at ends
    for (let x = 30; x < 480; x += 20) {
      ctx.fillRect(x, 15, 12, 40);
      ctx.fillRect(x, 455, 12, 40);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1, 10);
    return tex;
  }, []);

  const roadCrossTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Dark asphalt
    ctx.fillStyle = '#111827';
    ctx.fillRect(0, 0, 512, 512);

    // Yellow double center divider line
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(0, 253, 512, 2);
    ctx.fillRect(0, 257, 512, 2);

    // White dashed lane markings
    ctx.fillStyle = '#f8fafc';
    for (let x = 0; x < 512; x += 32) {
      ctx.fillRect(x, 128, 16, 2);
      ctx.fillRect(x, 384, 16, 2);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(10, 1);
    return tex;
  }, []);

  // Road coordinates
  const streetsZ = [-22, -11, 0, 11, 22];
  const avenuesX = [-22, -11, 0, 11, 22];

  return (
    <group position={[0, 0.05, 0]}>
      {/* North-South Avenues */}
      {avenuesX.map((x, i) => (
        <mesh key={`ave-${i}`} position={[x, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[3.2, 70]} />
          <meshStandardMaterial
            map={roadTexture}
            roughness={0.8}
            metalness={0.1}
          />
        </mesh>
      ))}

      {/* East-West Streets */}
      {streetsZ.map((z, i) => (
        <mesh key={`str-${i}`} position={[0, 0.01, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[70, 3.2]} />
          <meshStandardMaterial
            map={roadCrossTexture}
            roughness={0.8}
            metalness={0.1}
          />
        </mesh>
      ))}

      {/* Sidewalk Curbs / Pedestrian pavement or Satellite Terrain */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[72, 72]} />
        <meshStandardMaterial
          color={isSatellite ? '#1e293b' : '#0f172a'}
          roughness={0.9}
        />
      </mesh>
    </group>
  );
};

// 3. Waterfront Bay & Marina with Animated Water Shimmer
export const RealisticWaterfront: React.FC = () => {
  const waterRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (waterRef.current) {
      const time = state.clock.getElapsedTime();
      (waterRef.current.material as THREE.MeshStandardMaterial).roughness =
        0.1 + Math.sin(time * 1.5) * 0.05;
    }
  });

  return (
    <group position={[-26, 0.04, -20]}>
      <mesh ref={waterRef} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[26, 30, 32, 32]} />
        <meshStandardMaterial
          color="#0369a1"
          roughness={0.15}
          metalness={0.85}
          transparent
          opacity={0.88}
        />
      </mesh>

      {/* Marina Boardwalk Docks */}
      <mesh position={[6, 0.1, 0]}>
        <boxGeometry args={[1.5, 0.2, 28]} />
        <meshStandardMaterial color="#78350f" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.1, -4]}>
        <boxGeometry args={[10, 0.2, 1.2]} />
        <meshStandardMaterial color="#92400e" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.1, 6]}>
        <boxGeometry args={[10, 0.2, 1.2]} />
        <meshStandardMaterial color="#92400e" roughness={0.7} />
      </mesh>
    </group>
  );
};

// 4. Northridge Eco-Residential Park with Landscaping and 3D Trees
export const EcoResidentialPark: React.FC = () => {
  const treePositions = useMemo(() => {
    return [
      [14, 0, 16],
      [16, 0, 18],
      [18, 0, 15],
      [13, 0, 20],
      [17, 0, 21],
      [19, 0, 18],
      [15, 0, 23],
    ];
  }, []);

  return (
    <group position={[0, 0.06, 0]}>
      {/* Green Lawn Patch */}
      <mesh position={[16, 0.01, 18]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#14532d" roughness={0.8} />
      </mesh>

      {/* 3D Trees */}
      {treePositions.map((pos, idx) => (
        <group key={idx} position={[pos[0], 0, pos[2]]}>
          {/* Trunk */}
          <mesh position={[0, 0.6, 0]}>
            <cylinderGeometry args={[0.1, 0.15, 1.2, 8]} />
            <meshStandardMaterial color="#451a03" roughness={0.9} />
          </mesh>
          {/* Foliage */}
          <mesh position={[0, 1.6, 0]}>
            <coneGeometry args={[0.8, 1.6, 8]} />
            <meshStandardMaterial color="#15803d" roughness={0.7} />
          </mesh>
          <mesh position={[0, 2.3, 0]}>
            <coneGeometry args={[0.55, 1.2, 8]} />
            <meshStandardMaterial color="#16a34a" roughness={0.7} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

// 5. Rooftop Spires with Blinking Red Aviation Lights
export const RooftopSpires: React.FC<{
  spires: { x: number; y: number; z: number }[];
}> = ({ spires }) => {
  const beaconRef = useRef<THREE.InstancedMesh>(null);

  useFrame((state) => {
    if (!beaconRef.current) return;
    const time = state.clock.getElapsedTime();
    // Blink every 1 second
    const isBlinkOn = Math.sin(time * 4) > 0.2;
    (beaconRef.current.material as THREE.MeshBasicMaterial).color.set(
      isBlinkOn ? '#ef4444' : '#450a0a'
    );
  });

  return (
    <group>
      {spires.map((s, i) => (
        <group key={i} position={[s.x, s.y, s.z]}>
          {/* Antenna Spire */}
          <mesh position={[0, 2, 0]}>
            <cylinderGeometry args={[0.04, 0.12, 4, 8]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Rooftop HVAC box */}
          <mesh position={[0, 0.4, 0]}>
            <boxGeometry args={[1.2, 0.8, 1.2]} />
            <meshStandardMaterial color="#334155" roughness={0.7} />
          </mesh>
          {/* Red Aviation Warning Light */}
          <mesh position={[0, 4.1, 0]}>
            <sphereGeometry args={[0.12, 8, 8]} />
            <meshBasicMaterial color="#ef4444" />
          </mesh>
        </group>
      ))}
    </group>
  );
};

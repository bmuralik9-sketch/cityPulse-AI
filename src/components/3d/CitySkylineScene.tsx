import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { useCity } from '../../context/CityContext';
import { CarTraffic } from './CarTraffic';
import { HolographicRings } from './HolographicRings';
import { WasteRouteLayer } from './WasteRouteLayer';
import { EmergencyBeacon } from './EmergencyBeacon';
import {
  createSkyscraperTexture,
  RealisticRoadNetwork,
  RealisticWaterfront,
  EcoResidentialPark,
  RooftopSpires,
} from './RealisticCityElements';
import type { ZoneData } from '../../types/city';

// Definition of each procedural building
interface BuildingData {
  index: number;
  x: number;
  z: number;
  w: number;
  d: number;
  targetHeight: number;
  distFromCenter: number;
  zoneId: string;
  zoneName: string;
  hasSpire: boolean;
}

// Interactive Buildings using InstancedMesh with Realistic Skyscraper Texture
const ProceduralBuildings: React.FC<{
  buildings: BuildingData[];
  onHoverBuilding: (info: { zoneId: string; name: string; metric: string } | null) => void;
  onClickBuilding: (zoneId: string) => void;
}> = ({ buildings, onHoverBuilding, onClickBuilding }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const { heatmapMode, telemetry, isInputFocused } = useCity();

  // Procedural realistic architectural window texture
  const buildingTexture = useMemo(() => createSkyscraperTexture(), []);

  // Animation scales tracker for GSAP
  const scalesRef = useRef<Float32Array>(new Float32Array(buildings.length).fill(0.001));
  const glowPulseRef = useRef<number>(0);

  // Initial GSAP Wave Rise from Center Outward
  useEffect(() => {
    if (!meshRef.current) return;

    buildings.forEach((b, i) => {
      const delay = Math.min(2.5, b.distFromCenter * 0.045);
      const targetObj = { scaleY: 0.001 };

      gsap.to(targetObj, {
        scaleY: 1.0,
        duration: 1.2,
        delay: delay + 0.2,
        ease: 'back.out(1.4)',
        onUpdate: () => {
          scalesRef.current[i] = targetObj.scaleY;
        },
      });
    });
  }, [buildings]);

  // Compute colors based on zone & heatmap
  const getBuildingColor = (b: BuildingData, pulseBoost: number = 0) => {
    const zone = telemetry.zones.find((z) => z.id === b.zoneId) || telemetry.zones[0];
    const c = new THREE.Color();

    if (heatmapMode === 'traffic') {
      const t = zone.trafficCongestion / 100;
      if (t < 0.45) c.set('#10B981'); // Emerald
      else if (t < 0.75) c.set('#F59E0B'); // Amber
      else c.set('#EF4444'); // Red
    } else if (heatmapMode === 'energy') {
      const e = zone.energyLoad / 550;
      if (zone.energyPeakWarning) c.set('#EF4444');
      else if (e > 0.6) c.set('#F59E0B');
      else c.set('#06B6D4');
    } else if (heatmapMode === 'pollution') {
      if (zone.aqi > 150) c.set('#DC2626');
      else if (zone.aqi > 100) c.set('#F97316');
      else if (zone.aqi > 50) c.set('#EAB308');
      else c.set('#10B981');
    } else if (heatmapMode === 'waste') {
      if (zone.wasteFillAverage > 80) c.set('#EC4899');
      else if (zone.wasteFillAverage > 60) c.set('#8B5CF6');
      else c.set('#06B6D4');
    } else if (heatmapMode === 'safety') {
      if (zone.safetyScore > 90) c.set('#10B981');
      else if (zone.safetyScore > 75) c.set('#3B82F6');
      else c.set('#F59E0B');
    } else {
      // Realistic default palette: cool architectural blue-grey glass with status tint
      if (zone.status === 'critical') c.set('#f87171');
      else if (zone.status === 'warning') c.set('#fde047');
      else c.set('#93c5fd');
    }

    if (pulseBoost > 0) {
      c.offsetHSL(0, 0, pulseBoost * 0.25);
    }

    return c;
  };

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();

    const pulseFactor = isInputFocused ? Math.sin(time * 6) * 0.4 + 0.4 : 0;
    glowPulseRef.current = pulseFactor;

    buildings.forEach((b, i) => {
      const currentScaleY = scalesRef.current[i];
      const h = b.targetHeight * currentScaleY;

      dummy.position.set(b.x, h / 2, b.z);
      dummy.scale.set(b.w, Math.max(0.01, h), b.d);
      dummy.updateMatrix();
      meshRef.current?.setMatrixAt(i, dummy.matrix);

      const color = getBuildingColor(b, pulseFactor);
      meshRef.current?.setColorAt(i, color);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, buildings.length]}
      onPointerMove={(e) => {
        e.stopPropagation();
        const instanceId = e.instanceId;
        if (instanceId !== undefined && buildings[instanceId]) {
          const b = buildings[instanceId];
          const zone = telemetry.zones.find((z) => z.id === b.zoneId);
          let metricStr = `Energy: ${zone?.energyLoad || 320} MW`;
          if (heatmapMode === 'traffic') metricStr = `Congestion: ${zone?.trafficCongestion}%`;
          if (heatmapMode === 'pollution') metricStr = `AQI: ${zone?.aqi} (${zone?.aqiCategory})`;
          if (heatmapMode === 'waste') metricStr = `Bin Fill: ${zone?.wasteFillAverage}%`;
          if (heatmapMode === 'safety') metricStr = `Safety Score: ${zone?.safetyScore}/100`;

          onHoverBuilding({
            zoneId: b.zoneId,
            name: b.zoneName,
            metric: metricStr,
          });
        }
      }}
      onPointerOut={() => {
        onHoverBuilding(null);
      }}
      onClick={(e) => {
        e.stopPropagation();
        const instanceId = e.instanceId;
        if (instanceId !== undefined && buildings[instanceId]) {
          onClickBuilding(buildings[instanceId].zoneId);
        }
      }}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        map={buildingTexture}
        roughness={0.15}
        metalness={0.85}
      />
    </instancedMesh>
  );
};

// Camera Controller managing orbit, focus zoom, login dive fly-through, and views
const CameraManager: React.FC = () => {
  const { camera } = useThree();
  const {
    isAuthenticated,
    isInputFocused,
    isTransitioningToDashboard,
    cameraView,
    selectedZone,
  } = useCity();

  const mousePos = useRef({ x: 0, y: 0 });
  const orbitAngle = useRef<number>(0.6);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mousePos.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((_, delta) => {
    if (isTransitioningToDashboard) {
      camera.position.lerp(new THREE.Vector3(0, 4, -4), delta * 2.8);
      camera.lookAt(0, 2, -20);
      return;
    }

    if (!isAuthenticated) {
      orbitAngle.current += delta * 0.08;

      let targetRadius = 38;
      let targetHeight = 18;

      if (isInputFocused) {
        targetRadius = 24;
        targetHeight = 12;
      }

      const camX = Math.sin(orbitAngle.current) * targetRadius + mousePos.current.x * 3.5;
      const camZ = Math.cos(orbitAngle.current) * targetRadius + mousePos.current.y * 2.5;
      const camY = targetHeight + mousePos.current.y * 2.0;

      camera.position.lerp(new THREE.Vector3(camX, camY, camZ), delta * 2.5);
      camera.lookAt(0, 5, 0);
      return;
    }

    if (selectedZone) {
      const [zx, , zz] = selectedZone.center;
      const targetPos = new THREE.Vector3(zx + 10, 14, zz + 10);
      camera.position.lerp(targetPos, delta * 3.0);
      camera.lookAt(zx, 2, zz);
      return;
    }

    if (cameraView === 'satellite') {
      const targetPos = new THREE.Vector3(0, 56, 16);
      camera.position.lerp(targetPos, delta * 2.5);
      camera.lookAt(0, 0, 0);
      return;
    } else if (cameraView === 'topDown') {
      const targetPos = new THREE.Vector3(0, 54, 0.1);
      camera.position.lerp(targetPos, delta * 2.5);
      camera.lookAt(0, 0, 0);
    } else if (cameraView === 'isometric') {
      const targetPos = new THREE.Vector3(
        28 + mousePos.current.x * 2,
        30 + mousePos.current.y * 1.5,
        28
      );
      camera.position.lerp(targetPos, delta * 2.5);
      camera.lookAt(0, 2, 0);
    } else {
      orbitAngle.current += delta * 0.04;
      const camX = Math.sin(orbitAngle.current) * 34 + mousePos.current.x * 2;
      const camZ = Math.cos(orbitAngle.current) * 34 + mousePos.current.y * 2;
      camera.position.lerp(new THREE.Vector3(camX, 22, camZ), delta * 2.0);
      camera.lookAt(0, 3, 0);
    }
  });

  return null;
};

export const CitySkylineScene: React.FC = () => {
  const { setSelectedZone, hoveredBuildingInfo, setHoveredBuildingInfo, telemetry, mapStyle } = useCity();
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const isSatellite = mapStyle === 'satellite';

  // Generate 160+ procedural buildings across 5 distinct zones with rooftop spires
  const { buildings, spires } = useMemo(() => {
    const list: BuildingData[] = [];
    const spireList: { x: number; y: number; z: number }[] = [];
    const gridSize = 14;
    const spacing = 3.6;

    let index = 0;
    for (let gx = -gridSize / 2; gx < gridSize / 2; gx++) {
      for (let gz = -gridSize / 2; gz < gridSize / 2; gz++) {
        // Leave main avenues open
        if (Math.abs(gx) === 0 || Math.abs(gz) === 0) continue;
        if (Math.abs(gx) === 4 || Math.abs(gz) === 4) continue;

        // Skip waterfront harbor bay area so water is open
        if (gx < -4 && gz < -3) continue;

        // Skip park area in Northridge
        if (gx > 3 && gz > 3 && gx < 6 && gz < 6) continue;

        const posX = gx * spacing + (Math.random() - 0.5) * 0.6;
        const posZ = gz * spacing + (Math.random() - 0.5) * 0.6;
        const dist = Math.sqrt(posX * posX + posZ * posZ);

        let zoneId = 'zone-1';
        let zoneName = 'Downtown Commercial Core';

        if (posX > 6 && posZ < -4) {
          zoneId = 'zone-2';
          zoneName = 'Cyberport Tech Corridor';
        } else if (posX < -6 && posZ > 4) {
          zoneId = 'zone-3';
          zoneName = 'Harbor Logistics & Port Hub';
        } else if (posX > 4 && posZ > 6) {
          zoneId = 'zone-4';
          zoneName = 'Northridge Eco-Residential';
        } else if (posX < -4 && posZ < -6) {
          zoneId = 'zone-5';
          zoneName = 'Marina Promenade & Arts Bay';
        }

        let baseHeight = Math.max(3.5, 18 - dist * 0.45);
        if (zoneId === 'zone-1') baseHeight += (Math.random() - 0.2) * 6;
        if (zoneId === 'zone-2') baseHeight += (Math.random() - 0.2) * 3;
        if (zoneId === 'zone-3') baseHeight = 3.5 + Math.random() * 3.5;
        if (zoneId === 'zone-4') baseHeight = 4.0 + Math.random() * 4.0;

        const targetHeight = Math.max(2.5, Math.min(24, baseHeight));
        const w = 1.4 + Math.random() * 0.9;
        const d = 1.4 + Math.random() * 0.9;

        const hasSpire = targetHeight > 14 && Math.random() > 0.4;
        if (hasSpire) {
          spireList.push({ x: posX, y: targetHeight, z: posZ });
        }

        list.push({
          index: index++,
          x: posX,
          z: posZ,
          w,
          d,
          targetHeight,
          distFromCenter: dist,
          zoneId,
          zoneName,
          hasSpire,
        });
      }
    }
    return { buildings: list, spires: spireList };
  }, []);

  const handlePointerMove = (e: React.PointerEvent) => {
    setTooltipPos({ x: e.clientX, y: e.clientY });
  };

  const handleClickBuilding = (zoneId: string) => {
    const zone = telemetry.zones.find((z: ZoneData) => z.id === zoneId);
    if (zone) setSelectedZone(zone);
  };

  return (
    <div
      className="absolute inset-0 w-full h-full overflow-hidden"
      onPointerMove={handlePointerMove}
    >
      <Canvas
        camera={{ position: [25, 18, 30], fov: 45, near: 0.1, far: 300 }}
        dpr={Math.min(2, typeof window !== 'undefined' ? window.devicePixelRatio : 1)}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={[isSatellite ? '#1e3a5f' : '#070b14']} />
        <fogExp2 attach="fog" args={[isSatellite ? '#1e3a5f' : '#070b14', isSatellite ? 0.008 : 0.013]} />

        <CameraManager />

        {/* Realistic Skylight & Sun / Street Lights */}
        <ambientLight intensity={isSatellite ? 1.2 : 0.6} color={isSatellite ? '#e0f2fe' : '#e0f2fe'} />
        <directionalLight
          position={[25, 55, 25]}
          intensity={isSatellite ? 2.6 : 1.4}
          color={isSatellite ? '#fffbeb' : '#f8fafc'}
        />
        {!isSatellite && (
          <>
            <pointLight position={[0, 25, 0]} intensity={2.0} color="#38bdf8" distance={70} />
            <pointLight position={[-15, 12, -15]} intensity={1.8} color="#fef08a" distance={45} />
            <pointLight position={[15, 12, 15]} intensity={1.5} color="#67e8f9" distance={45} />
          </>
        )}

        {/* Realistic Asphalt Road Network with Markings */}
        <RealisticRoadNetwork isSatellite={isSatellite} />

        {/* Realistic Waterfront Bay & Marina */}
        <RealisticWaterfront />

        {/* Eco-Residential Park with Landscaping & 3D Trees */}
        <EcoResidentialPark />

        {/* Procedural Buildings with Real Window Textures */}
        <ProceduralBuildings
          buildings={buildings}
          onHoverBuilding={setHoveredBuildingInfo}
          onClickBuilding={handleClickBuilding}
        />

        {/* Rooftop Antenna Spires with Blinking Red Aviation Lights */}
        <RooftopSpires spires={spires} />

        {/* Moving Realistic Cars with Headlights & Taillights */}
        <CarTraffic count={90} />

        {/* Floating AI Holographic Rings & Particles */}
        <HolographicRings />

        {/* Animated Waste Collection Route */}
        <WasteRouteLayer />

        {/* 3D Incident Beacon */}
        <EmergencyBeacon />
      </Canvas>

      {/* Building Hover Interactive Tooltip */}
      {hoveredBuildingInfo && tooltipPos && (
        <div
          className="fixed pointer-events-none z-50 px-3 py-1.5 rounded-lg bg-slate-900/95 border border-cyan-400 text-xs font-mono text-cyan-200 shadow-neon-cyan transform -translate-x-1/2 -translate-y-full mb-3 backdrop-blur-md transition-all duration-75"
          style={{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y}px` }}
        >
          <div className="font-semibold text-white tracking-wide">{hoveredBuildingInfo.name}</div>
          <div className="text-cyan-400 font-bold">{hoveredBuildingInfo.metric}</div>
          <div className="text-[10px] text-slate-400">Click to inspect sector details</div>
        </div>
      )}
    </div>
  );
};

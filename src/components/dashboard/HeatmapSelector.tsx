import React from 'react';
import {
  Layers,
  Activity,
  Zap,
  Wind,
  Trash2,
  ShieldCheck,
  Eye,
  Compass,
  Maximize2,
  Globe2,
  Moon,
  Sun,
} from 'lucide-react';
import { useCity } from '../../context/CityContext';
import type { HeatmapMode, CameraViewMode, MapStyleMode } from '../../types/city';

export const HeatmapSelector: React.FC = () => {
  const { heatmapMode, setHeatmapMode, cameraView, setCameraView, mapStyle, setMapStyle, language } = useCity();

  const layers: { id: HeatmapMode; label: string; icon: React.ReactNode; color: string }[] = [
    { id: 'traffic', label: 'Traffic', icon: <Activity className="w-3.5 h-3.5" />, color: 'hover:border-cyan-400' },
    { id: 'energy', label: 'Energy', icon: <Zap className="w-3.5 h-3.5" />, color: 'hover:border-amber-400' },
    { id: 'pollution', label: 'Pollution', icon: <Wind className="w-3.5 h-3.5" />, color: 'hover:border-emerald-400' },
    { id: 'waste', label: 'Waste', icon: <Trash2 className="w-3.5 h-3.5" />, color: 'hover:border-pink-400' },
    { id: 'safety', label: 'Safety', icon: <ShieldCheck className="w-3.5 h-3.5" />, color: 'hover:border-blue-400' },
  ];

  const views: { id: CameraViewMode; label: string }[] = [
    { id: 'isometric', label: 'Isometric' },
    { id: 'topDown', label: 'Top-Down 2D' },
    { id: 'satellite', label: '🛰️ Satellite' },
    { id: 'orbit', label: 'Orbit' },
  ];

  const handleToggleSatelliteStyle = () => {
    const next = mapStyle === 'night' ? 'satellite' : 'night';
    setMapStyle(next);
    if (next === 'satellite') {
      setCameraView('satellite');
    } else {
      setCameraView('isometric');
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl glass-panel border border-cyan-500/25 shadow-lg backdrop-blur-md pointer-events-auto">
      {/* Real-World Satellite Style Switcher */}
      <button
        type="button"
        onClick={handleToggleSatelliteStyle}
        className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer ${
          mapStyle === 'satellite'
            ? 'bg-amber-400 text-slate-950 shadow-neon-cyan border border-amber-300'
            : 'bg-slate-900/80 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-950/50'
        }`}
      >
        <Globe2 className="w-3.5 h-3.5" />
        <span>{mapStyle === 'satellite' ? '🛰️ Real-World Satellite' : '🛰️ Switch to Satellite View'}</span>
      </button>

      <div className="hidden sm:block w-px h-5 bg-slate-800 mx-0.5" />

      {/* Layer Toggles */}
      <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none">
        <div className="px-2 py-1 text-[10px] font-mono uppercase text-slate-400 flex items-center gap-1 border-r border-slate-700/80 mr-1 shrink-0">
          <Layers className="w-3 h-3 text-cyan-400" />
          <span className="hidden sm:inline">Heatmaps:</span>
        </div>
        {layers.map((l) => {
          const isActive = heatmapMode === l.id;
          return (
            <button
              key={l.id}
              type="button"
              onClick={() => setHeatmapMode(l.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-mono transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400 font-semibold shadow-neon-cyan'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {l.icon}
              <span>{l.label}</span>
            </button>
          );
        })}
      </div>

      <div className="hidden md:block w-px h-5 bg-slate-800 mx-0.5" />

      {/* Camera View Switcher */}
      <div className="flex items-center gap-1">
        <div className="px-1.5 text-[10px] font-mono text-slate-400 hidden xl:flex items-center gap-1">
          <Compass className="w-3 h-3 text-indigo-400" />
          <span>Camera:</span>
        </div>
        {views.map((v) => {
          const isSelected = cameraView === v.id;
          return (
            <button
              key={v.id}
              type="button"
              onClick={() => {
                setCameraView(v.id);
                if (v.id === 'satellite') setMapStyle('satellite');
              }}
              className={`px-2 py-1 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                isSelected
                  ? 'bg-indigo-500/30 text-indigo-200 border border-indigo-400/50 font-semibold'
                  : 'bg-slate-900/40 text-slate-400 hover:text-slate-200 border border-slate-800/80'
              }`}
            >
              {v.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Activity,
  Zap,
  Wind,
  Trash2,
  ShieldCheck,
  Camera,
  AlertTriangle,
  CheckCircle,
  PlayCircle,
  ArrowRight,
} from 'lucide-react';
import { useCity } from '../../context/CityContext';

export const ZoneDetailDrawer: React.FC = () => {
  const { selectedZone, setSelectedZone, setCameraView, language } = useCity();

  if (!selectedZone) return null;

  const handleClose = () => {
    setSelectedZone(null);
    setCameraView('isometric');
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: '100%', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed top-16 right-4 bottom-4 w-full max-w-md z-40 p-5 rounded-2xl glass-panel-glow border border-cyan-400/40 shadow-2xl flex flex-col overflow-y-auto pointer-events-auto"
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                {selectedZone.code}
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[11px] font-mono uppercase font-bold ${
                  selectedZone.status === 'critical'
                    ? 'bg-rose-950/80 text-rose-300 border border-rose-500/40'
                    : selectedZone.status === 'warning'
                    ? 'bg-amber-950/80 text-amber-300 border border-amber-500/40'
                    : 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                }`}
              >
                {selectedZone.status}
              </span>
            </div>
            <h2 className="text-xl font-bold font-display text-white mt-1">
              {selectedZone.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-lg bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-300 mt-3 leading-relaxed">
          {selectedZone.description}
        </p>

        {/* Live Camera Snapshot */}
        {selectedZone.cameraFeedUrl && (
          <div className="mt-4 rounded-xl overflow-hidden border border-slate-700 relative group">
            <img
              src={selectedZone.cameraFeedUrl}
              alt="Sector CCTV Feed"
              className="w-full h-36 object-cover brightness-90 group-hover:brightness-100 transition-all"
            />
            <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-950/80 text-[10px] font-mono text-cyan-300 flex items-center gap-1.5 backdrop-blur-sm border border-cyan-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
              <span>LIVE CAM #08</span>
            </div>
            <div className="absolute bottom-2 right-2 text-[10px] font-mono text-slate-300 bg-slate-950/70 px-1.5 py-0.5 rounded">
              Optical Telemetry Active
            </div>
          </div>
        )}

        {/* Telemetry Metrics Grid */}
        <div className="grid grid-cols-2 gap-2.5 mt-4">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>Traffic Congestion</span>
            </div>
            <div className="text-lg font-bold font-display text-white">
              {selectedZone.trafficCongestion}%
            </div>
            <div className="w-full bg-slate-950 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div
                className={`h-full ${
                  selectedZone.trafficCongestion > 75
                    ? 'bg-rose-500'
                    : selectedZone.trafficCongestion > 50
                    ? 'bg-amber-500'
                    : 'bg-cyan-500'
                }`}
                style={{ width: `${selectedZone.trafficCongestion}%` }}
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Grid Energy Load</span>
            </div>
            <div className="text-lg font-bold font-display text-white">
              {selectedZone.energyLoad}{' '}
              <span className="text-xs font-mono font-normal text-slate-400">MW</span>
            </div>
            <div className="text-[10px] font-mono text-amber-300/80 mt-1">
              {selectedZone.energyPeakWarning ? '⚠️ Peak Threshold' : '✓ Normal Load'}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <Wind className="w-3.5 h-3.5 text-emerald-400" />
              <span>Air Quality (AQI)</span>
            </div>
            <div className="text-lg font-bold font-display text-white">
              {selectedZone.aqi}{' '}
              <span className="text-xs font-mono font-normal text-slate-400">
                ({selectedZone.aqiCategory})
              </span>
            </div>
            <div className="text-[10px] font-mono text-emerald-400 mt-1">
              PM2.5: {(selectedZone.aqi * 0.4).toFixed(1)} µg/m³
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <Trash2 className="w-3.5 h-3.5 text-purple-400" />
              <span>Waste Capacity</span>
            </div>
            <div className="text-lg font-bold font-display text-white">
              {selectedZone.wasteFillAverage}%
            </div>
            <div className="text-[10px] font-mono text-purple-300 mt-1">
              {selectedZone.wasteFillAverage > 75 ? '⚡ Collection Due' : '✓ Sufficient Space'}
            </div>
          </div>
        </div>

        {/* AI Operational Recommendation */}
        {selectedZone.recommendedAction && (
          <div className="mt-4 p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30">
            <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-300 font-semibold mb-1">
              <CheckCircle className="w-4 h-4 text-cyan-400" />
              <span>Gemini Operational Advisory</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">
              {selectedZone.recommendedAction}
            </p>
          </div>
        )}

        {/* Quick Action Footer */}
        <div className="mt-auto pt-4 flex gap-2">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 py-2.5 px-3 rounded-xl text-xs font-mono bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 border border-cyan-400/30 flex items-center justify-center gap-1.5 transition-all"
          >
            <span>Reset Camera Orbit</span>
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

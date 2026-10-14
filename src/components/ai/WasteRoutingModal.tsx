import React from 'react';
import { motion } from 'framer-motion';
import {
  Trash2,
  Truck,
  Navigation,
  CheckCircle2,
  Clock,
  Fuel,
  MapPin,
  Play,
  X,
  Sparkles,
} from 'lucide-react';
import { useCity } from '../../context/CityContext';

export const WasteRoutingModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { wasteRoute, dispatchWasteTruck, setCameraView, language } = useCity();

  if (!isOpen) return null;

  const handleDispatch = () => {
    dispatchWasteTruck();
    setCameraView('topDown');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md pointer-events-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-xl rounded-2xl glass-panel-glow border border-cyan-400/40 p-5 sm:p-6 flex flex-col shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-400">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-display text-white">
                AI Smart Waste Logistics Router
              </h2>
              <p className="text-xs font-sans text-slate-400">
                Dynamic Traveling-Salesperson Heuristic + Bin Sensor Telemetry
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Truck Stats Card */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-4">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
            <span className="text-[10px] font-mono uppercase text-slate-400">Target Bins</span>
            <div className="text-xl font-bold font-display text-white mt-0.5">
              {wasteRoute.stopsCount}
            </div>
            <span className="text-[10px] font-mono text-emerald-400">{wasteRoute.highPriorityBins} High-Risk</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
            <span className="text-[10px] font-mono uppercase text-slate-400">Total Waste</span>
            <div className="text-xl font-bold font-display text-white mt-0.5">
              {(wasteRoute.totalEstimatedKg / 1000).toFixed(1)} <span className="text-xs font-normal">Tons</span>
            </div>
            <span className="text-[10px] font-mono text-cyan-400">Compactor Ready</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
            <span className="text-[10px] font-mono uppercase text-slate-400">Est. Time</span>
            <div className="text-xl font-bold font-display text-white mt-0.5">
              {wasteRoute.estimatedMinutes} <span className="text-xs font-normal">m</span>
            </div>
            <span className="text-[10px] font-mono text-amber-300">-22% vs static</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
            <span className="text-[10px] font-mono uppercase text-slate-400">Diesel Saved</span>
            <div className="text-xl font-bold font-display text-white mt-0.5">
              {wasteRoute.fuelSavedLiters} <span className="text-xs font-normal">L</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400">48 kg CO2</span>
          </div>
        </div>

        {/* AI Route Explanation */}
        <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 mb-4 text-xs leading-relaxed text-slate-300">
          <div className="flex items-center gap-1.5 text-emerald-300 font-mono font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Gemini Route Optimization Brief</span>
          </div>
          <p>
            AI analyzed real-time load sensors across 150 municipal bins. By prioritizing Marina Promenade and Downtown overflow nodes before the afternoon traffic peak, the algorithm bypasses congested arterials and eliminates 8 redundant collection loops.
          </p>
        </div>

        {/* Live Route Status & Waypoints */}
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 mb-4 text-xs font-mono text-slate-400">
          <div className="flex items-center justify-between mb-2">
            <span>Assigned Vehicle: <strong className="text-slate-100">{wasteRoute.truckId}</strong></span>
            <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
              wasteRoute.status === 'en_route'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                : wasteRoute.status === 'completed'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-slate-800 text-slate-400'
            }`}>
              {wasteRoute.status}
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="truncate">Active Loop: Bayside Depot → Zone 5 Promenade → Zone 1 Core → Eco Recycler</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={handleDispatch}
          disabled={wasteRoute.status === 'en_route'}
          className={`w-full py-3 rounded-xl font-mono font-semibold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 ${
            wasteRoute.status === 'en_route'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40 cursor-default'
              : 'bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 hover:from-emerald-300 hover:to-teal-300 shadow-neon-cyan cursor-pointer'
          }`}
        >
          {wasteRoute.status === 'en_route' ? (
            <>
              <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
              <span>Truck En Route (Simulating on 3D Map)</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Authorize & Animate 3D Collection Route</span>
            </>
          )}
        </button>
      </motion.div>
    </div>
  );
};

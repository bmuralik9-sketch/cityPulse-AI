import React from 'react';
import { motion } from 'framer-motion';
import {
  Zap,
  Leaf,
  Sun,
  BatteryCharging,
  Sliders,
  CheckCircle2,
  DollarSign,
  X,
  Sparkles,
} from 'lucide-react';
import { useCity } from '../../context/CityContext';

export const EnergyOptimizerModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { energyPlan, applyEnergyPlan, telemetry } = useCity();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md pointer-events-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-xl rounded-2xl glass-panel-glow border border-amber-500/40 p-5 sm:p-6 flex flex-col shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-display text-white">
                Municipal Grid Energy Optimizer
              </h2>
              <p className="text-xs font-sans text-slate-400">
                AI Demand-Response & Microgrid Storage Arbitrage
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

        {/* Current Grid State Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 my-4">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] font-mono uppercase text-slate-400">Current Load</span>
            <div className="text-xl font-bold font-display text-white mt-0.5">
              {telemetry.totalEnergyDemandMW} <span className="text-xs font-normal">MW</span>
            </div>
            <span className="text-[10px] font-mono text-amber-400">Peak Demand Period</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] font-mono uppercase text-slate-400">Renewable Mix</span>
            <div className="text-xl font-bold font-display text-emerald-400 mt-0.5">
              {telemetry.renewableEnergyPercent}%
            </div>
            <span className="text-[10px] font-mono text-slate-400">Solar + Wind</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 col-span-2 sm:col-span-1">
            <span className="text-[10px] font-mono uppercase text-slate-400">Est. Savings</span>
            <div className="text-xl font-bold font-display text-cyan-300 mt-0.5">
              34.5 <span className="text-xs font-normal">MWh</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400">~$4,820 USD</span>
          </div>
        </div>

        {/* Proposed Control Strategies */}
        <div className="space-y-2.5 mb-4">
          <span className="block text-[11px] font-mono uppercase text-slate-400">
            Automated Energy Balancing Directives:
          </span>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-300">
                <Sun className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-200">
                  Adaptive Streetlight Dimming
                </div>
                <div className="text-[10px] font-mono text-slate-400">
                  Dim non-arterial public lighting by {energyPlan.streetlightDimmingPercent}% (sensor-reactive)
                </div>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-amber-300">-4.2 MW</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-300">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-200">
                  Commercial HVAC Load Shift
                </div>
                <div className="text-[10px] font-mono text-slate-400">
                  Pre-cool municipal offices; shift peak chillers by 45 minutes
                </div>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-cyan-300">-{energyPlan.hvacLoadShiftMW} MW</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-300">
                <BatteryCharging className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-200">
                  Grid Battery Peak Shaving
                </div>
                <div className="text-[10px] font-mono text-slate-400">
                  Discharge {energyPlan.batteryDischargeMW} MW from Cyberport solar battery storage
                </div>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-300">-{energyPlan.batteryDischargeMW} MW</span>
          </div>
        </div>

        {/* Environmental Impact Badge */}
        <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-center gap-3 mb-4 text-xs font-mono text-emerald-300">
          <Leaf className="w-5 h-5 shrink-0" />
          <span>
            Projected Carbon Reduction: <strong>{energyPlan.estimatedCo2ReductionKg.toLocaleString()} kg CO2</strong> during this 2-hour window.
          </span>
        </div>

        {/* Apply Button */}
        <button
          type="button"
          onClick={applyEnergyPlan}
          disabled={energyPlan.status === 'applied'}
          className={`w-full py-3 rounded-xl font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
            energyPlan.status === 'applied'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
              : 'bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 hover:from-amber-300 hover:to-yellow-300 shadow-neon-cyan cursor-pointer'
          }`}
        >
          {energyPlan.status === 'applied' ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Optimization Active (Grid Load Shaved)</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Apply AI Energy Balancing Protocol</span>
            </>
          )}
        </button>
      </motion.div>
    </div>
  );
};

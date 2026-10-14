import React, { useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  ShieldAlert,
  Flame,
  Car,
  Waves,
  Zap,
  CheckCircle2,
  Clock,
  Navigation,
  Radio,
  Send,
  AlertTriangle,
  X,
  Sparkles,
} from 'lucide-react';
import { useCity } from '../../context/CityContext';
import type { EmergencyIncident } from '../../types/city';

export const EmergencyAgentModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const {
    incidents,
    dispatchIncidentResponders,
    triggerNewIncidentSimulation,
    language,
    setCameraView,
  } = useCity();

  const [activeTabLang, setActiveTabLang] = useState<'en' | 'hi' | 'te'>('en');

  if (!isOpen) return null;

  const currentIncident = incidents[0];

  const handleApproveDispatch = (incidentId: string) => {
    dispatchIncidentResponders(incidentId);

    // Confetti celebration for emergency dispatch readiness
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#EF4444', '#F59E0B', '#22D3EE'],
      });
    } catch (e) {
      // ignore
    }
  };

  const getIncidentIcon = (type: EmergencyIncident['type']) => {
    switch (type) {
      case 'Fire Outbreak':
        return <Flame className="w-4 h-4 text-rose-400" />;
      case 'Multi-Vehicle Collision':
        return <Car className="w-4 h-4 text-amber-400" />;
      case 'Flash Flood':
        return <Waves className="w-4 h-4 text-cyan-400" />;
      case 'Substation Electrical Failure':
        return <Zap className="w-4 h-4 text-yellow-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md pointer-events-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl max-h-[90vh] rounded-2xl glass-panel-glow border border-rose-500/40 p-5 sm:p-6 flex flex-col overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-500/20 border border-rose-400/40 text-rose-400 shadow-neon-rose">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-display text-white">
                Emergency Response AI Agent
              </h2>
              <p className="text-xs font-sans text-slate-400">
                Multi-Agency Rapid Dispatch & Dynamic Clearance Corridors
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

        {/* Quick Simulation Trigger Bar */}
        <div className="my-3.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-2 flex-wrap">
          <span className="text-xs font-mono text-slate-300 flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
            <span>Simulate Incident:</span>
          </span>
          <div className="flex gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => triggerNewIncidentSimulation('Fire Outbreak')}
              className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-rose-950/60 hover:bg-rose-900/60 text-rose-200 border border-rose-500/30 transition-all cursor-pointer"
            >
              🔥 Fire Outbreak
            </button>
            <button
              type="button"
              onClick={() => triggerNewIncidentSimulation('Multi-Vehicle Collision')}
              className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-amber-950/60 hover:bg-amber-900/60 text-amber-200 border border-amber-500/30 transition-all cursor-pointer"
            >
              🚗 Collision
            </button>
            <button
              type="button"
              onClick={() => triggerNewIncidentSimulation('Flash Flood')}
              className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-200 border border-cyan-500/30 transition-all cursor-pointer"
            >
              🌊 Flash Flood
            </button>
          </div>
        </div>

        {/* Current Priority Incident Card */}
        {currentIncident ? (
          <div className="flex-1 overflow-y-auto space-y-3.5 pr-1">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-rose-500/30">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-slate-950">
                    {getIncidentIcon(currentIncident.type)}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">
                      {currentIncident.type}
                    </h3>
                    <span className="text-xs font-mono text-slate-400">
                      📍 {currentIncident.locationName} ({currentIncident.timeReported})
                    </span>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider ${
                    currentIncident.status === 'dispatched'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                  }`}
                >
                  {currentIncident.status}
                </span>
              </div>

              {/* Recommended Emergency Responders */}
              <div className="mt-3">
                <span className="block text-[11px] font-mono uppercase text-slate-400 mb-1.5">
                  Proposed Emergency Responders:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {currentIncident.recommendedResponders.map((resp, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 text-xs font-mono"
                    >
                      <div className="font-semibold text-slate-200">{resp.unitType}</div>
                      <div className="text-[10px] text-slate-400 truncate mt-0.5">
                        {resp.nearestStation}
                      </div>
                      <div className="text-cyan-400 font-bold mt-1">
                        ETA: ~{resp.estimatedEtaMinutes} mins
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Traffic Clearance Route */}
              <div className="mt-3 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs font-mono text-slate-300 flex items-start gap-2">
                <Navigation className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>Corridor: {currentIncident.clearanceRoute}</span>
              </div>

              {/* Multilingual Advisory Bulletin */}
              <div className="mt-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-mono uppercase text-slate-400">
                    Public Safety Advisory:
                  </span>
                  <div className="flex gap-1 text-[10px] font-mono">
                    <button
                      type="button"
                      onClick={() => setActiveTabLang('en')}
                      className={`px-1.5 py-0.5 rounded ${
                        activeTabLang === 'en' ? 'bg-cyan-500/30 text-cyan-300' : 'text-slate-400'
                      }`}
                    >
                      English
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTabLang('hi')}
                      className={`px-1.5 py-0.5 rounded ${
                        activeTabLang === 'hi' ? 'bg-cyan-500/30 text-cyan-300' : 'text-slate-400'
                      }`}
                    >
                      हिंदी
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTabLang('te')}
                      className={`px-1.5 py-0.5 rounded ${
                        activeTabLang === 'te' ? 'bg-cyan-500/30 text-cyan-300' : 'text-slate-400'
                      }`}
                    >
                      తెలుగు
                    </button>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-500/30 text-xs leading-relaxed text-slate-200 font-sans">
                  {currentIncident.advisoryMessage[activeTabLang]}
                </div>
              </div>

              {/* Approve & Dispatch Button */}
              <div className="mt-4 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  disabled={currentIncident.status === 'dispatched'}
                  onClick={() => handleApproveDispatch(currentIncident.id)}
                  className={`w-full py-3 rounded-xl font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                    currentIncident.status === 'dispatched'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                      : 'bg-rose-500 hover:bg-rose-400 text-white shadow-neon-rose cursor-pointer'
                  }`}
                >
                  {currentIncident.status === 'dispatched' ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Units Dispatched & Corridors Cleared</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>One-Click: Approve & Dispatch Emergency Units</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-slate-400 font-mono text-xs">
            No active emergency incidents detected. City operating normally.
          </div>
        )}
      </motion.div>
    </div>
  );
};

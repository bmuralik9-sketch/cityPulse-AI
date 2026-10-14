import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  Clock,
  TrendingUp,
  CheckCircle2,
  PlayCircle,
  Activity,
  Zap,
  Trash2,
  CloudRain,
  X,
} from 'lucide-react';
import { useCity } from '../../context/CityContext';
import type { PredictiveAlert } from '../../types/city';

export const PredictiveAlertsModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { predictiveAlerts, executeAlertAction, language } = useCity();

  if (!isOpen) return null;

  const getCategoryIcon = (category: PredictiveAlert['category']) => {
    switch (category) {
      case 'traffic':
        return <Activity className="w-4 h-4 text-cyan-400" />;
      case 'energy':
        return <Zap className="w-4 h-4 text-amber-400" />;
      case 'waste':
        return <Trash2 className="w-4 h-4 text-pink-400" />;
      case 'weather':
        return <CloudRain className="w-4 h-4 text-blue-400" />;
    }
  };

  const getSeverityBadge = (severity: PredictiveAlert['severity']) => {
    switch (severity) {
      case 'critical':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'high':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      default:
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md pointer-events-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl max-h-[85vh] rounded-2xl glass-panel-glow border border-cyan-400/40 p-5 sm:p-6 flex flex-col overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-display text-white">
                Next-2-Hour Predictive Alerts
              </h2>
              <p className="text-xs font-sans text-slate-400">
                Gemini Machine Intelligence Early Warning System
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Alerts List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3.5 pr-1">
          {predictiveAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-xl border transition-all ${
                alert.actionExecuted
                  ? 'bg-emerald-950/20 border-emerald-500/30 opacity-80'
                  : 'bg-slate-900/70 border-slate-700/80 hover:border-cyan-500/40'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="p-1 rounded bg-slate-950">
                    {getCategoryIcon(alert.category)}
                  </div>
                  <span className="font-semibold text-sm text-slate-100">
                    {alert.title}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono border uppercase font-bold ${getSeverityBadge(
                      alert.severity
                    )}`}
                  >
                    {alert.severity}
                  </span>
                </div>

                {/* Confidence Score Pill */}
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950 border border-cyan-500/30 text-xs font-mono text-cyan-300 shrink-0">
                  <span className="text-[10px] text-slate-400">Confidence:</span>
                  <span className="font-bold">{alert.probabilityScore}%</span>
                </div>
              </div>

              {/* District & Timeframe */}
              <div className="flex items-center gap-3 text-xs font-mono text-slate-400 mb-2">
                <span>📍 {alert.zoneName}</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-amber-300">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{alert.predictedTimeframe}</span>
                </span>
              </div>

              {/* Plain-Language Explanation */}
              <p className="text-xs text-slate-300 leading-relaxed mb-3 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/80">
                {alert.plainLanguageExplanation}
              </p>

              {/* Recommended Action & Dispatch Button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2 border-t border-slate-800/60">
                <div className="text-xs text-slate-400">
                  <span className="text-cyan-400 font-mono font-semibold">
                    Recommended Automation:{' '}
                  </span>
                  <span>{alert.recommendedAutomatedAction}</span>
                </div>

                <button
                  type="button"
                  disabled={alert.actionExecuted}
                  onClick={() => executeAlertAction(alert.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold shrink-0 transition-all flex items-center justify-center gap-1.5 ${
                    alert.actionExecuted
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 cursor-default'
                      : 'bg-cyan-400 text-slate-950 hover:bg-cyan-300 shadow-neon-cyan cursor-pointer'
                  }`}
                >
                  {alert.actionExecuted ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Mitigation Enforced</span>
                    </>
                  ) : (
                    <>
                      <PlayCircle className="w-3.5 h-3.5" />
                      <span>Execute Directive</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

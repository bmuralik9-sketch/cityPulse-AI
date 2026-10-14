import React from 'react';
import { motion } from 'framer-motion';

interface KpiCardProps {
  title: string;
  value: string | number;
  unit?: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  status?: 'optimal' | 'warning' | 'critical';
  icon: React.ReactNode;
  subtitle?: string;
  progressPercent?: number;
  onClick?: () => void;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  unit,
  change,
  trend,
  status = 'optimal',
  icon,
  subtitle,
  progressPercent,
  onClick,
}) => {
  const getStatusBorder = () => {
    switch (status) {
      case 'critical':
        return 'border-rose-500/40 hover:border-rose-400 bg-rose-950/20';
      case 'warning':
        return 'border-amber-500/40 hover:border-amber-400 bg-amber-950/20';
      default:
        return 'border-cyan-500/30 hover:border-cyan-400 bg-slate-900/60';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'critical':
        return 'text-rose-400';
      case 'warning':
        return 'text-amber-400';
      default:
        return 'text-cyan-400';
    }
  };

  const getProgressColor = () => {
    switch (status) {
      case 'critical':
        return 'bg-gradient-to-r from-rose-500 to-red-400';
      case 'warning':
        return 'bg-gradient-to-r from-amber-500 to-yellow-400';
      default:
        return 'bg-gradient-to-r from-cyan-500 to-teal-400';
    }
  };

  return (
    <motion.div
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      onClick={onClick}
      className={`p-3.5 sm:p-4 rounded-xl border backdrop-blur-md transition-all duration-200 cursor-pointer ${getStatusBorder()}`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
          {title}
        </span>
        <div className={`p-1.5 rounded-lg bg-slate-950/60 ${getStatusColor()}`}>
          {icon}
        </div>
      </div>

      <div className="flex items-baseline gap-1.5 mb-1.5">
        <span className="text-xl sm:text-2xl font-bold font-display tracking-tight text-white">
          {value}
        </span>
        {unit && <span className="text-xs font-mono text-slate-400">{unit}</span>}
      </div>

      {progressPercent !== undefined && (
        <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden mb-2">
          <div
            className={`h-full rounded-full transition-all duration-500 ${getProgressColor()}`}
            style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
          />
        </div>
      )}

      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
        <span>{subtitle}</span>
        {change && (
          <span
            className={`px-1.5 py-0.2 rounded ${
              trend === 'down'
                ? 'text-emerald-400 bg-emerald-950/40'
                : trend === 'up'
                ? 'text-amber-400 bg-amber-950/40'
                : 'text-slate-400'
            }`}
          >
            {change}
          </span>
        )}
      </div>
    </motion.div>
  );
};

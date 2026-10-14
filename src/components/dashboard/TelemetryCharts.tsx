import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { Activity, Zap, Wind, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { HOURLY_TELEMETRY_CHART } from '../../data/mockCityData';
import { useCity } from '../../context/CityContext';

export const TelemetryCharts: React.FC = () => {
  const { telemetry } = useCity();
  const [activeTab, setActiveTab] = useState<'traffic' | 'energy' | 'pollution' | 'zones'>('traffic');
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Dynamic zone data for bar chart
  const zoneChartData = telemetry.zones.map((z) => ({
    name: z.code,
    fullName: z.name,
    traffic: z.trafficCongestion,
    energy: z.energyLoad,
    aqi: z.aqi,
    waste: z.wasteFillAverage,
  }));

  return (
    <div className="rounded-2xl glass-panel border border-cyan-500/20 overflow-hidden shadow-xl backdrop-blur-xl">
      {/* Chart Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950/60 border-b border-slate-800">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('traffic')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
              activeTab === 'traffic'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>Traffic Flow</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('energy')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
              activeTab === 'energy'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Grid vs Solar</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('zones')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
              activeTab === 'zones'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-400/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wind className="w-3.5 h-3.5 text-purple-400" />
            <span>Sector AQI</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded text-slate-400 hover:text-slate-200 text-xs font-mono flex items-center gap-1"
        >
          <span>{isCollapsed ? 'Expand' : 'Collapse'}</span>
          {isCollapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Chart Canvas */}
      {!isCollapsed && (
        <div className="p-3 sm:p-4 h-48 w-full">
          {activeTab === 'traffic' && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={HOURLY_TELEMETRY_CHART} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="trafficGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22D3EE" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#22D3EE" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="time" stroke="#64748B" fontSize={10} fontVariant="mono" />
                <YAxis stroke="#64748B" fontSize={10} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#22D3EE',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="traffic"
                  name="Congestion %"
                  stroke="#22D3EE"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#trafficGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}

          {activeTab === 'energy' && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={HOURLY_TELEMETRY_CHART} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="energyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="solarGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="time" stroke="#64748B" fontSize={10} />
                <YAxis stroke="#64748B" fontSize={10} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#F59E0B',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="energy"
                  name="Grid Load (MW)"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#energyGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="solarWind"
                  name="Clean Solar/Wind (MW)"
                  stroke="#10B981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#solarGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}

          {activeTab === 'zones' && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={zoneChartData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="name" stroke="#64748B" fontSize={10} />
                <YAxis stroke="#64748B" fontSize={10} domain={[0, 200]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#A855F7',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                  }}
                />
                <Bar dataKey="aqi" name="AQI Level" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="traffic" name="Congestion %" fill="#22D3EE" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      )}
    </div>
  );
};

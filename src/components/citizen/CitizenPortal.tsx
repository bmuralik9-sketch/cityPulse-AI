import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  MapPin,
  Clock,
  CheckCircle2,
  Wind,
  Navigation,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Send,
  Building2,
  ChevronRight,
  ShieldCheck,
  Compass,
  X,
  Bell,
  Zap,
  Trash2,
  SunMedium,
  ExternalLink,
} from 'lucide-react';
import { useCity } from '../../context/CityContext';
import { CitizenTriageModal } from '../ai/CitizenTriage';
import type { CitizenReport } from '../../types/city';
import { SpeechService } from '../../services/speechService';

export const CitizenPortal: React.FC = () => {
  const { citizenReports, telemetry, language, setUserRole, setCameraView, setSelectedZone } = useCity();
  const [activeTab, setActiveTab] = useState<'tracker' | 'routes' | 'alerts'>('tracker');
  const [showTriageModal, setShowTriageModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<CitizenReport | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const bestZone = [...telemetry.zones].sort((a, b) => a.aqi - b.aqi)[0];

  const getStatusStepIndex = (status: string) => {
    switch (status) {
      case 'Submitted':
        return 1;
      case 'AI Triaged':
        return 2;
      case 'Assigned':
        return 3;
      case 'Crew Dispatched':
        return 4;
      case 'Resolved':
        return 5;
      default:
        return 2;
    }
  };

  const steps = ['Submitted', 'AI Triaged', 'Assigned', 'Dispatched', 'Resolved'];

  const filteredReports = citizenReports.filter((r) => {
    if (filterCategory === 'all') return true;
    if (filterCategory === 'flickering' || filterCategory === 'lighting') {
      return r.category === 'Broken Streetlight' || r.title.toLowerCase().includes('flicker');
    }
    if (filterCategory === 'overflow' || filterCategory === 'waste') {
      return r.category === 'Overflowing Waste' || r.title.toLowerCase().includes('overflow');
    }
    if (filterCategory === 'pothole') {
      return r.category === 'Pothole';
    }
    return true;
  });

  const handleReportClick = (report: CitizenReport) => {
    setSelectedReport(report);
  };

  const handleExpedite = (reportId: string) => {
    setActionNotice('Priority Escalated: Technician dispatched with express repair order.');
    SpeechService.speakText('Priority escalated. Department dispatched.', language);
    setTimeout(() => setActionNotice(null), 4000);
  };

  const handleLocateOnMap = (zoneId: string) => {
    const zone = telemetry.zones.find((z) => z.id === zoneId) || telemetry.zones[0];
    setUserRole('operator');
    setSelectedZone(zone);
    setCameraView('focus');
  };

  return (
    <div className="relative z-10 max-w-5xl mx-auto px-4 pt-20 pb-16 pointer-events-auto">
      {/* Hero Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-2xl glass-panel-glow border border-emerald-500/30 relative overflow-hidden mb-6 shadow-2xl">
        <div className="absolute -top-16 -right-16 w-40 h-40 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 text-xs font-mono mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>CITIZEN PULSE RESIDENT PORTAL</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
              Civic Action & Community Safety
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Report infrastructure defects with instant Gemini AI triage, monitor resolution in real-time, and discover clean-air transit corridors.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={() => setShowTriageModal(true)}
              className="px-5 py-3 rounded-xl font-semibold text-xs sm:text-sm font-mono tracking-wider uppercase text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 transition-all shadow-neon-cyan flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>Report An Issue (AI Triage)</span>
            </button>
          </div>
        </div>

        {/* Quick Report Issue Action Bar */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center gap-2 flex-wrap">
          <span className="text-xs font-mono text-slate-400">Quick Issue Triage:</span>
          <button
            type="button"
            onClick={() => {
              setFilterCategory('flickering');
              const flick = citizenReports.find((r) => r.category === 'Broken Streetlight');
              if (flick) setSelectedReport(flick);
            }}
            className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <SunMedium className="w-3.5 h-3.5" />
            <span>💡 Flickering Streetlight</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setFilterCategory('overflow');
              const over = citizenReports.find((r) => r.category === 'Overflowing Waste');
              if (over) setSelectedReport(over);
            }}
            className="px-3 py-1.5 rounded-lg bg-pink-500/20 hover:bg-pink-500/30 border border-pink-400/40 text-pink-300 text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>🗑️ Overflowing Waste</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setFilterCategory('pothole');
              const pot = citizenReports.find((r) => r.category === 'Pothole');
              if (pot) setSelectedReport(pot);
            }}
            className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-300 text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>🚧 Hazardous Pothole</span>
          </button>
          <button
            type="button"
            onClick={() => setFilterCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-all cursor-pointer ${
              filterCategory === 'all'
                ? 'bg-slate-700 text-white border-slate-500'
                : 'bg-slate-900/60 text-slate-400 border-slate-800'
            }`}
          >
            Show All
          </button>
        </div>
      </div>

      {/* Action Notification Banner */}
      {actionNotice && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-400 text-emerald-200 text-xs font-mono flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{actionNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setActionNotice(null)}
            className="text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </motion.div>
      )}

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-6">
        <button
          type="button"
          onClick={() => setActiveTab('tracker')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-mono transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'tracker'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>My Civic Reports ({filteredReports.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('routes')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-mono transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'routes'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Wind className="w-4 h-4" />
          <span>Air Quality & Safe Routes</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('alerts')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-mono transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'alerts'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Community Advisories</span>
        </button>
      </div>

      {/* Tab 1: Civic Reports Tracker */}
      {activeTab === 'tracker' && (
        <div className="space-y-4">
          <div className="text-xs font-mono text-slate-400 mb-2 flex items-center justify-between">
            <span>Click any report to view live diagnostic details and dispatch actions:</span>
            {filterCategory !== 'all' && (
              <span className="text-cyan-400">
                Filtered: {filterCategory} (
                <button
                  type="button"
                  onClick={() => setFilterCategory('all')}
                  className="underline ml-1 cursor-pointer"
                >
                  Clear
                </button>
                )
              </span>
            )}
          </div>

          {filteredReports.map((report) => {
            const stepIdx = getStatusStepIndex(report.status);
            return (
              <div
                key={report.id}
                onClick={() => handleReportClick(report)}
                className="p-5 rounded-2xl glass-panel border border-slate-800 hover:border-emerald-400/60 hover:shadow-neon-cyan transition-all duration-200 cursor-pointer group"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                  <div className="flex items-start gap-3">
                    <img
                      src={report.imageUrl}
                      alt={report.title}
                      className="w-20 h-20 rounded-xl object-cover border border-slate-700 shrink-0 group-hover:border-cyan-400 transition-colors"
                    />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] font-mono font-bold text-cyan-300 bg-cyan-950/70 px-2 py-0.5 rounded border border-cyan-500/30">
                          {report.trackingNumber}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-slate-800 text-slate-300">
                          {report.category}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                            report.severity === 'Critical'
                              ? 'bg-rose-950 text-rose-300 border border-rose-500/40'
                              : report.severity === 'High'
                              ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                              : 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                          }`}
                        >
                          {report.severity} Priority
                        </span>
                      </div>

                      <h3 className="font-bold text-base text-white mt-1 group-hover:text-cyan-300 transition-colors">
                        {report.title}
                      </h3>
                      <div className="text-xs font-mono text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        <span>{report.location}</span>
                        <span>•</span>
                        <span>{report.timestamp}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-mono uppercase text-slate-400 block">
                      Assigned Department:
                    </span>
                    <span className="text-xs font-mono font-semibold text-emerald-300">
                      {report.assignedDepartment}
                    </span>
                    <span className="text-[10px] text-cyan-400 font-mono mt-1 block group-hover:translate-x-1 transition-transform">
                      Click to inspect details →
                    </span>
                  </div>
                </div>

                {/* Progress Step Bar */}
                <div className="my-4 pt-2">
                  <div className="grid grid-cols-5 gap-1 relative">
                    {steps.map((st, i) => {
                      const isComplete = i + 1 <= stepIdx;
                      return (
                        <div key={st} className="text-center">
                          <div
                            className={`h-1.5 rounded-full mb-2 transition-all ${
                              isComplete ? 'bg-emerald-400' : 'bg-slate-800'
                            }`}
                          />
                          <span
                            className={`text-[10px] font-mono block truncate ${
                              isComplete ? 'text-emerald-300 font-semibold' : 'text-slate-600'
                            }`}
                          >
                            {st}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* AI Resolution Note & Citizen Draft */}
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
                  <span className="font-mono text-cyan-400 font-semibold block mb-1">
                    AI Municipal Status Dispatch:
                  </span>
                  {report.citizenReplyDraft}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Clean Air & Safe Routes */}
      {activeTab === 'routes' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl glass-panel border border-cyan-500/20">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-cyan-300 uppercase font-semibold">
                  Metropolitan Air Telemetry
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-xs font-mono">
                  Cleanest Zone: {bestZone.name}
                </span>
              </div>

              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-extrabold font-display text-white">
                  {telemetry.avgCityAqi}
                </span>
                <span className="text-sm font-mono text-slate-400">Average City AQI</span>
              </div>

              <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                Air quality is currently favorable for outdoor jogging in Northridge and Marina Promenade. Industrial Harbor (Sector 03) has localized PM2.5 spikes.
              </p>

              <div className="space-y-2">
                {telemetry.zones.map((z) => (
                  <div
                    key={z.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs font-mono"
                  >
                    <span className="text-slate-200">{z.name}</span>
                    <span
                      className={`font-bold ${
                        z.aqi < 50
                          ? 'text-emerald-400'
                          : z.aqi < 100
                          ? 'text-yellow-400'
                          : 'text-rose-400'
                      }`}
                    >
                      AQI {z.aqi} ({z.aqiCategory})
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-2xl glass-panel border border-emerald-500/20 space-y-3">
              <span className="text-xs font-mono text-emerald-300 uppercase font-semibold block mb-1">
                AI Suggested Eco-Pedestrian Corridors
              </span>

              <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold text-sm text-emerald-200">
                    🌿 Promenade Greenway Corridor
                  </h4>
                  <span className="text-[10px] font-mono text-emerald-400">AQI 38 (Pristine)</span>
                </div>
                <p className="text-xs text-slate-300">
                  Runs from Marina Boardwalk to Northridge Botanical Path. Tree-lined canopy provides 65% less particulate exposure than arterial roads.
                </p>
                <div className="mt-2 text-[10px] font-mono text-cyan-300 flex items-center gap-1">
                  <Navigation className="w-3 h-3" />
                  <span>3.2 km • Safe Pedestrian Path • Low Traffic Noise</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold text-sm text-slate-200">
                    🚲 Cyberport Eco Bike Expressway
                  </h4>
                  <span className="text-[10px] font-mono text-yellow-400">AQI 55 (Moderate)</span>
                </div>
                <p className="text-xs text-slate-300">
                  Separated grade bike lane with automated green-wave priority at 4 crossings.
                </p>
                <div className="mt-2 text-[10px] font-mono text-cyan-300 flex items-center gap-1">
                  <Navigation className="w-3 h-3" />
                  <span>4.8 km • Dedicated Cycle Track</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Community Advisories */}
      {activeTab === 'alerts' && (
        <div className="space-y-3">
          <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/40 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm text-rose-200">
                Traffic Advisory: Westbound Grand Ave Diverted
              </h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Emergency response teams are clearing an incident near North Interchange. Westbound lanes are diverted to 8th Avenue for the next 45 minutes.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/40 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm text-cyan-200">
                Marina Arts Festival Eco-Zone Active Tonight
              </h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Autonomous electric shuttles are running free loops every 6 minutes between Central Station and Marina Promenade until midnight.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Report Detail Modal (opens when clicking ANY report card) */}
      <AnimatePresence>
        {selectedReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl max-h-[90vh] rounded-2xl glass-panel-glow border border-emerald-400/40 p-5 sm:p-6 flex flex-col overflow-hidden shadow-2xl"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between pb-3 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                      {selectedReport.trackingNumber}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-slate-800 text-slate-300">
                      {selectedReport.category}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                        selectedReport.severity === 'Critical'
                          ? 'bg-rose-950 text-rose-300 border border-rose-500/40'
                          : selectedReport.severity === 'High'
                          ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                      }`}
                    >
                      {selectedReport.severity} Severity
                    </span>
                  </div>
                  <h2 className="text-lg font-bold font-display text-white mt-1">
                    {selectedReport.title}
                  </h2>
                  <div className="text-xs font-mono text-slate-400 flex items-center gap-1.5 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{selectedReport.location}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedReport(null)}
                  className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
                {/* Photo & Metadata */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                  <div className="rounded-xl overflow-hidden border border-slate-700 h-44 bg-slate-950">
                    <img
                      src={selectedReport.imageUrl}
                      alt={selectedReport.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-2 text-xs font-mono">
                    <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase block">Status</span>
                      <span className="text-emerald-400 font-bold">{selectedReport.status}</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase block">Assigned Bureau</span>
                      <span className="text-slate-100">{selectedReport.assignedDepartment}</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase block">Reported Timestamp</span>
                      <span className="text-slate-300">{selectedReport.timestamp}</span>
                    </div>
                  </div>
                </div>

                {/* AI Computer Vision Analysis */}
                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-cyan-500/30 text-xs text-slate-200">
                  <span className="font-mono text-cyan-300 font-semibold block mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Gemini AI Visual Diagnostic:</span>
                  </span>
                  <p className="leading-relaxed">{selectedReport.aiAnalysisSummary}</p>
                </div>

                {/* Citizen Dispatch Response */}
                <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs text-slate-200">
                  <span className="font-mono text-emerald-300 font-semibold block mb-1">
                    Municipal Notification Broadcast:
                  </span>
                  <p className="leading-relaxed italic">"{selectedReport.citizenReplyDraft}"</p>
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="pt-3 border-t border-slate-800 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleExpedite(selectedReport.id)}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/40 text-xs font-mono font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Request Priority Expedite</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleLocateOnMap(selectedReport.zoneId)}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 border border-cyan-400/40 text-xs font-mono font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Locate on 3D City Map</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Citizen Report Modal */}
      <CitizenTriageModal
        isOpen={showTriageModal}
        onClose={() => setShowTriageModal(false)}
      />
    </div>
  );
};

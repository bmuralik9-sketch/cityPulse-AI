import React, { useState } from 'react';
import {
  Activity,
  Zap,
  Wind,
  Trash2,
  ShieldAlert,
  Bot,
  TrendingUp,
  Truck,
  Sparkles,
  Camera,
  Layers,
  BarChart3,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import { useCity } from '../../context/CityContext';
import { KpiCard } from '../common/KpiCard';
import { HeatmapSelector } from './HeatmapSelector';
import { ZoneDetailDrawer } from './ZoneDetailDrawer';
import { TelemetryCharts } from './TelemetryCharts';
import { AiChatAssistant } from '../ai/AiChatAssistant';
import { PredictiveAlertsModal } from '../ai/PredictiveAlerts';
import { WasteRoutingModal } from '../ai/WasteRoutingModal';
import { EmergencyAgentModal } from '../ai/EmergencyAgent';
import { EnergyOptimizerModal } from '../ai/EnergyOptimizer';
import { CitizenTriageModal } from '../ai/CitizenTriage';

export const OperatorDashboard: React.FC = () => {
  const {
    telemetry,
    predictiveAlerts,
    incidents,
    wasteRoute,
    energyPlan,
    setSelectedZone,
    language,
  } = useCity();

  // Modals state
  const [showAiChat, setShowAiChat] = useState(false);
  const [showPredictive, setShowPredictive] = useState(false);
  const [showWasteModal, setShowWasteModal] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [showEnergyModal, setShowEnergyModal] = useState(false);
  const [showTriageModal, setShowTriageModal] = useState(false);

  const activeAlertsCount = predictiveAlerts.filter((a) => !a.actionExecuted).length;
  const criticalIncidentsCount = incidents.filter((i) => i.status === 'detected' || i.status === 'triaged').length;

  return (
    <div className="relative z-10 w-full min-h-screen pt-16 pb-12 pointer-events-none">
      <div className="max-w-7xl mx-auto px-4 space-y-4">
        {/* Top KPI Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pointer-events-auto">
          <KpiCard
            title={language === 'hi' ? 'ट्रैफ़िक कंजेक्शन' : language === 'te' ? 'ట్రాఫిక్ రద్దీ' : 'Traffic Congestion'}
            value={`${telemetry.overallCongestion}%`}
            change={telemetry.overallCongestion > 65 ? '+3.4%' : '-1.2%'}
            trend={telemetry.overallCongestion > 65 ? 'up' : 'down'}
            status={telemetry.overallCongestion > 75 ? 'critical' : telemetry.overallCongestion > 55 ? 'warning' : 'optimal'}
            icon={<Activity className="w-4 h-4" />}
            subtitle="Downtown Peak"
            progressPercent={telemetry.overallCongestion}
            onClick={() => setSelectedZone(telemetry.zones[0])}
          />

          <KpiCard
            title={language === 'hi' ? 'ग्रिड विद्युत मांग' : language === 'te' ? 'విద్యుత్ లోడ్' : 'Power Grid Demand'}
            value={telemetry.totalEnergyDemandMW}
            unit="MW"
            change={`${telemetry.renewableEnergyPercent}% Clean`}
            trend="down"
            status={telemetry.totalEnergyDemandMW > 500 ? 'warning' : 'optimal'}
            icon={<Zap className="w-4 h-4" />}
            subtitle="Solar/Wind Mix"
            progressPercent={(telemetry.totalEnergyDemandMW / 600) * 100}
            onClick={() => setShowEnergyModal(true)}
          />

          <KpiCard
            title={language === 'hi' ? 'कचरा डिब्बे भराव' : language === 'te' ? 'చెత్త డబ్బాల నిల్వ' : 'Overflowing Bins'}
            value={telemetry.wasteBinOverflowCount}
            change={wasteRoute.status === 'en_route' ? 'Truck Active' : 'Route Queued'}
            trend="neutral"
            status={telemetry.wasteBinOverflowCount > 10 ? 'warning' : 'optimal'}
            icon={<Trash2 className="w-4 h-4" />}
            subtitle="10-Stop Optimized Loop"
            progressPercent={(telemetry.wasteBinOverflowCount / 20) * 100}
            onClick={() => setShowWasteModal(true)}
          />

          <KpiCard
            title={language === 'hi' ? 'वायु गुणवत्ता सूचकांक' : language === 'te' ? 'గాలి నాణ్యత' : 'Air Quality Index'}
            value={telemetry.avgCityAqi}
            unit="AQI"
            change={telemetry.avgCityAqi > 100 ? 'Moderate' : 'Good'}
            trend={telemetry.avgCityAqi > 100 ? 'up' : 'down'}
            status={telemetry.avgCityAqi > 150 ? 'critical' : telemetry.avgCityAqi > 100 ? 'warning' : 'optimal'}
            icon={<Wind className="w-4 h-4" />}
            subtitle="PM2.5 Sensor Array"
            progressPercent={(telemetry.avgCityAqi / 200) * 100}
            onClick={() => setSelectedZone(telemetry.zones[2])}
          />

          <KpiCard
            title={language === 'hi' ? 'सक्रिय आपात स्थिति' : language === 'te' ? 'అత్యవసర సంఘటనలు' : 'Active Incidents'}
            value={criticalIncidentsCount}
            change={criticalIncidentsCount > 0 ? 'Action Required' : 'Nominal'}
            trend={criticalIncidentsCount > 0 ? 'up' : 'neutral'}
            status={criticalIncidentsCount > 0 ? 'critical' : 'optimal'}
            icon={<ShieldAlert className="w-4 h-4" />}
            subtitle="Rapid Dispatch Ready"
            progressPercent={criticalIncidentsCount * 50}
            onClick={() => setShowEmergencyModal(true)}
          />
        </div>

        {/* Floating Map Controls & Quick AI Action Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pointer-events-auto">
          {/* Heatmap & Camera Selectors */}
          <HeatmapSelector />

          {/* Quick AI Trigger Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {/* Gemini AI Assistant Button */}
            <button
              type="button"
              onClick={() => setShowAiChat(true)}
              className="px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 font-mono font-bold text-xs tracking-wider uppercase flex items-center gap-1.5 shadow-neon-cyan hover:from-cyan-300 hover:to-teal-300 transition-all shrink-0 cursor-pointer"
            >
              <Bot className="w-4 h-4" />
              <span>AI City Assistant</span>
            </button>

            {/* Predictive Alerts */}
            <button
              type="button"
              onClick={() => setShowPredictive(true)}
              className="px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-amber-500/40 text-amber-300 font-mono text-xs flex items-center gap-1.5 transition-all shrink-0 cursor-pointer"
            >
              <TrendingUp className="w-4 h-4 text-amber-400" />
              <span>Predictive Alerts ({activeAlertsCount})</span>
            </button>

            {/* Smart Waste */}
            <button
              type="button"
              onClick={() => setShowWasteModal(true)}
              className="px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-emerald-500/40 text-emerald-300 font-mono text-xs flex items-center gap-1.5 transition-all shrink-0 cursor-pointer"
            >
              <Truck className="w-4 h-4 text-emerald-400" />
              <span>Waste Router</span>
            </button>

            {/* Emergency Agent */}
            <button
              type="button"
              onClick={() => setShowEmergencyModal(true)}
              className="px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-rose-500/40 text-rose-300 font-mono text-xs flex items-center gap-1.5 transition-all shrink-0 cursor-pointer"
            >
              <ShieldAlert className="w-4 h-4 text-rose-400 animate-pulse" />
              <span>Emergency Agent</span>
            </button>

            {/* Energy Optimizer */}
            <button
              type="button"
              onClick={() => setShowEnergyModal(true)}
              className="px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-yellow-500/40 text-yellow-300 font-mono text-xs flex items-center gap-1.5 transition-all shrink-0 cursor-pointer"
            >
              <Zap className="w-4 h-4 text-yellow-400" />
              <span>Energy Optimizer</span>
            </button>

            {/* Vision Triage */}
            <button
              type="button"
              onClick={() => setShowTriageModal(true)}
              className="px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-purple-500/40 text-purple-300 font-mono text-xs flex items-center gap-1.5 transition-all shrink-0 cursor-pointer"
            >
              <Camera className="w-4 h-4 text-purple-400" />
              <span>Vision Triage</span>
            </button>
          </div>
        </div>

        {/* Lower Left/Center Telemetry Charts Dock */}
        <div className="w-full max-w-xl pointer-events-auto">
          <TelemetryCharts />
        </div>
      </div>

      {/* Interactive Drawers & AI Modals Container */}
      <div className="pointer-events-auto">
        <ZoneDetailDrawer />
        <AiChatAssistant
          isOpen={showAiChat}
          onClose={() => setShowAiChat(false)}
        />
        <PredictiveAlertsModal
          isOpen={showPredictive}
          onClose={() => setShowPredictive(false)}
        />
        <WasteRoutingModal
          isOpen={showWasteModal}
          onClose={() => setShowWasteModal(false)}
        />
        <EmergencyAgentModal
          isOpen={showEmergencyModal}
          onClose={() => setShowEmergencyModal(false)}
        />
        <EnergyOptimizerModal
          isOpen={showEnergyModal}
          onClose={() => setShowEnergyModal(false)}
        />
        <CitizenTriageModal
          isOpen={showTriageModal}
          onClose={() => setShowTriageModal(false)}
        />
      </div>
    </div>
  );
};

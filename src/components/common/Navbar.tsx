import React, { useState } from 'react';
import {
  Sparkles,
  Volume2,
  VolumeX,
  Contrast,
  Type,
  Key,
  Globe,
  LogOut,
  Radio,
  Sliders,
  Users,
  ShieldAlert,
  HelpCircle,
} from 'lucide-react';
import { useCity } from '../../context/CityContext';
import { getGeminiApiKey, setGeminiApiKey } from '../../services/geminiService';
import type { Language, UserRole } from '../../types/city';

export const Navbar: React.FC<{ onOpenAssistant?: () => void }> = ({ onOpenAssistant }) => {
  const {
    userRole,
    setUserRole,
    logout,
    language,
    setLanguage,
    highContrast,
    setHighContrast,
    largeText,
    setLargeText,
    voiceReadout,
    setVoiceReadout,
    telemetry,
    predictiveAlerts,
  } = useCity();

  const [showKeyModal, setShowKeyModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(getGeminiApiKey());
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveApiKey = () => {
    setGeminiApiKey(apiKeyInput);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setShowKeyModal(false);
    }, 800);
  };

  const activeAlertsCount = predictiveAlerts.filter((a) => !a.actionExecuted).length;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-cyan-500/20 px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo & City Title */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-indigo-600 flex items-center justify-center shadow-neon-cyan">
                <Sparkles className="w-4 h-4 text-slate-950 font-bold" />
              </div>
              <div>
                <span className="font-display font-bold text-base sm:text-lg tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-teal-100 to-white">
                  CityPulse AI
                </span>
                <span className="hidden sm:inline-block ml-2 px-1.5 py-0.5 rounded text-[10px] font-mono bg-cyan-950 border border-cyan-500/40 text-cyan-300">
                  METRO INTELLIGENCE
                </span>
              </div>
            </div>

            {/* Live Ticker */}
            <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900/70 border border-slate-700/60 text-xs font-mono text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>IoT Mesh: Nominal</span>
              <span className="text-slate-500">|</span>
              <span className="text-amber-400">{activeAlertsCount} Predictive Alerts</span>
            </div>
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Role Switcher Pill */}
            <div className="flex items-center bg-slate-900/90 rounded-lg p-0.5 border border-slate-800 text-xs font-mono">
              <button
                type="button"
                onClick={() => setUserRole('operator')}
                title="Switch to Operator View"
                className={`flex items-center gap-1 px-2 py-1 rounded-md transition-all ${
                  userRole === 'operator'
                    ? 'bg-cyan-500/25 text-cyan-300 font-semibold border border-cyan-400/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Operator</span>
              </button>
              <button
                type="button"
                onClick={() => setUserRole('citizen')}
                title="Switch to Citizen View"
                className={`flex items-center gap-1 px-2 py-1 rounded-md transition-all ${
                  userRole === 'citizen'
                    ? 'bg-emerald-500/25 text-emerald-300 font-semibold border border-emerald-400/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Citizen</span>
              </button>
              <button
                type="button"
                onClick={() => setUserRole('responder')}
                title="Switch to Emergency Responder View"
                className={`flex items-center gap-1 px-2 py-1 rounded-md transition-all ${
                  userRole === 'responder'
                    ? 'bg-rose-500/25 text-rose-300 font-semibold border border-rose-400/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Emergency</span>
              </button>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center bg-slate-900/90 rounded-lg p-0.5 border border-slate-800 text-xs font-mono">
              {(['en', 'hi', 'te'] as Language[]).map((lng) => (
                <button
                  key={lng}
                  type="button"
                  onClick={() => setLanguage(lng)}
                  className={`px-2 py-1 rounded-md uppercase font-semibold transition-all ${
                    language === lng
                      ? 'bg-indigo-500/25 text-indigo-300 border border-indigo-400/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {lng === 'en' ? 'EN' : lng === 'hi' ? 'हिं' : 'తె'}
                </button>
              ))}
            </div>

            {/* Accessibility Quick Toggles */}
            <div className="flex items-center gap-1">
              {/* High Contrast */}
              <button
                type="button"
                onClick={() => setHighContrast(!highContrast)}
                title={highContrast ? 'Disable High Contrast' : 'Enable High Contrast'}
                className={`p-2 rounded-lg border transition-all ${
                  highContrast
                    ? 'bg-cyan-400 text-black border-cyan-300 shadow-neon-cyan'
                    : 'bg-slate-900/80 border-slate-700/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Contrast className="w-4 h-4" />
              </button>

              {/* Large Text */}
              <button
                type="button"
                onClick={() => setLargeText(!largeText)}
                title={largeText ? 'Normal Font Size' : 'Large Accessibility Font'}
                className={`p-2 rounded-lg border transition-all ${
                  largeText
                    ? 'bg-cyan-400 text-black border-cyan-300 shadow-neon-cyan'
                    : 'bg-slate-900/80 border-slate-700/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Type className="w-4 h-4" />
              </button>

              {/* Voice Readout */}
              <button
                type="button"
                onClick={() => setVoiceReadout(!voiceReadout)}
                title={voiceReadout ? 'Mute AI Voice Narration' : 'Enable AI Voice Narration'}
                className={`p-2 rounded-lg border transition-all ${
                  voiceReadout
                    ? 'bg-cyan-400 text-black border-cyan-300 shadow-neon-cyan'
                    : 'bg-slate-900/80 border-slate-700/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                {voiceReadout ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
            </div>

            {/* Gemini API Key Configuration Modal Trigger */}
            <button
              type="button"
              onClick={() => setShowKeyModal(true)}
              title="Configure Gemini API Key"
              className="p-2 rounded-lg bg-slate-900/80 border border-slate-700/60 text-slate-400 hover:text-cyan-300 transition-all flex items-center gap-1.5 text-xs font-mono"
            >
              <Key className="w-4 h-4 text-cyan-400" />
              <span className="hidden xl:inline">AI Config</span>
            </button>

            {/* Logout */}
            <button
              type="button"
              onClick={logout}
              title="Sign Out"
              className="p-2 rounded-lg bg-slate-900/80 border border-slate-700/60 text-slate-400 hover:text-rose-400 transition-all"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Gemini API Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md p-6 rounded-2xl glass-panel-glow border border-cyan-400/40">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-300">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-white text-base">
                    Google Gemini AI Configuration
                  </h3>
                  <p className="text-xs text-slate-400 font-sans">
                    Gemini 2.5 / 1.5 Flash Reasoning Engine
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowKeyModal(false)}
                className="text-slate-400 hover:text-slate-200 text-sm font-mono"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              CityPulse AI is equipped with a full realistic offline AI simulation engine that generates instant, contextual telemetry analysis. To connect directly to your live Google Gemini API key:
            </p>

            <div className="mb-4">
              <label className="block text-xs font-mono text-cyan-300 mb-1">
                Google AI Studio API Key (Optional)
              </label>
              <input
                type="password"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-slate-100 focus:outline-none focus:border-cyan-400"
              />
              <span className="text-[10px] text-slate-400 block mt-1">
                Keys are stored securely in local browser storage and never logged.
              </span>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowKeyModal(false)}
                className="px-3 py-2 rounded-xl text-xs font-mono text-slate-300 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveApiKey}
                className="px-4 py-2 rounded-xl text-xs font-mono font-semibold bg-cyan-400 text-slate-950 hover:bg-cyan-300 transition-all shadow-neon-cyan"
              >
                {saveSuccess ? 'Saved!' : 'Save & Activate'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

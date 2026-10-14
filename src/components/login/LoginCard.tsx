import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert,
  Sliders,
  Users,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useCity } from '../../context/CityContext';
import type { UserRole } from '../../types/city';

export const LoginCard: React.FC = () => {
  const {
    userRole,
    setUserRole,
    login,
    setIsInputFocused,
    isTransitioningToDashboard,
    language,
  } = useCity();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const roles: { role: UserRole; title: string; subtitle: string; icon: React.ReactNode; color: string }[] = [
    {
      role: 'operator',
      title: language === 'hi' ? 'सिटी ऑपरेटर' : language === 'te' ? 'సిటీ ఆపరేటర్' : 'City Operator',
      subtitle: language === 'hi' ? 'कमांड सेंटर नियंत्रण' : language === 'te' ? 'కమాండ్ సెంటర్' : 'AI Command & Control',
      icon: <Sliders className="w-5 h-5" />,
      color: 'from-cyan-500 to-blue-600',
    },
    {
      role: 'citizen',
      title: language === 'hi' ? 'नागरिक पोर्टल' : language === 'te' ? 'పౌరుల పోర్టల్' : 'Citizen Resident',
      subtitle: language === 'hi' ? 'समस्या रिपोर्ट व ट्रैकिंग' : language === 'te' ? 'సమస్యల నివేదిక' : 'Reports, AQI & Clean Routes',
      icon: <Users className="w-5 h-5" />,
      color: 'from-emerald-500 to-teal-600',
    },
    {
      role: 'responder',
      title: language === 'hi' ? 'आपातकालीन दल' : language === 'te' ? 'అత్యవసర రక్షక దళం' : 'Emergency Unit',
      subtitle: language === 'hi' ? 'त्वरित डिस्पैच व सुरक्षा' : language === 'te' ? 'త్వరిత డిస్పాచ్' : 'Rapid Unit Dispatch',
      icon: <ShieldAlert className="w-5 h-5" />,
      color: 'from-rose-500 to-amber-600',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage(
        language === 'hi'
          ? 'कृपया ईमेल और पासवर्ड दर्ज करें'
          : language === 'te'
          ? 'దయచేసి ఈమెయిల్ మరియు పాస్‌వర్డ్ నమోదు చేయండి'
          : 'Please enter both email and password'
      );
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      return;
    }

    setErrorMessage('');
    setIsLoading(true);
    setTimeout(() => {
      login(userRole);
    }, 400);
  };

  const handleQuickDemo = (selectedRole: UserRole) => {
    setUserRole(selectedRole);
    setIsLoading(true);
    setTimeout(() => {
      login(selectedRole);
    }, 300);
  };

  return (
    <div className="relative z-20 flex items-center justify-center min-h-screen px-4 py-8 pointer-events-none">
      <AnimatePresence>
        {!isTransitioningToDashboard && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 1.15, filter: 'blur(10px)', transition: { duration: 0.8 } }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className={`pointer-events-auto w-full max-w-md p-6 sm:p-8 rounded-2xl glass-panel-glow border border-cyan-400/30 relative overflow-hidden ${
              isShaking ? 'animate-[shake_0.5s_ease-in-out]' : ''
            }`}
          >
            {/* Ambient Background Gradient Accent */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

            {/* Header Badge & Brand */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-mono tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span>AUTONOMOUS CITY OS v2.6</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-200 to-indigo-300">
                CityPulse AI
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 font-sans">
                Next-Gen Urban Intelligence & Community Action Platform
              </p>
            </div>

            {/* Role Selector Tabs */}
            <div className="mb-5">
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
                Select Operational Role:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {roles.map((r) => {
                  const isSelected = userRole === r.role;
                  return (
                    <button
                      key={r.role}
                      type="button"
                      onClick={() => setUserRole(r.role)}
                      className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all duration-200 ${
                        isSelected
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-neon-cyan'
                          : 'bg-slate-900/40 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:border-slate-600'
                      }`}
                    >
                      <div className={`mb-1 p-1 rounded-lg ${isSelected ? 'text-cyan-300' : 'text-slate-400'}`}>
                        {r.icon}
                      </div>
                      <span className="text-[11px] font-semibold tracking-tight leading-tight">
                        {r.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mb-4 flex items-center gap-2 p-2.5 rounded-lg bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Operator / Citizen ID
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-cyan-400/70 absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setIsInputFocused(true)}
                    onBlur={() => setIsInputFocused(false)}
                    placeholder="operator@citypulse.gov"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-sans"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-mono text-slate-300">
                    Security Passcode
                  </label>
                  <span className="text-[10px] text-cyan-400/80 hover:underline cursor-pointer">
                    Demo: any key
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-cyan-400/70 absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setIsInputFocused(true)}
                    onBlur={() => setIsInputFocused(false)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-sans"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl font-semibold text-sm tracking-wide text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-300 hover:from-cyan-300 hover:to-teal-200 transition-all shadow-neon-cyan flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Initiating Neural Uplink...</span>
                  </>
                ) : (
                  <>
                    <span>Enter Command Center</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Access Bar for Hackathon Judges */}
            <div className="mt-5 pt-4 border-t border-slate-800/80">
              <div className="text-[11px] font-mono text-slate-400 text-center mb-2.5 flex items-center justify-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Instant Hackathon Demo Logins:</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemo('operator')}
                  className="py-2 px-2.5 rounded-lg bg-cyan-950/50 hover:bg-cyan-900/50 border border-cyan-500/30 text-cyan-300 text-xs font-mono flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Demo Operator</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo('citizen')}
                  className="py-2 px-2.5 rounded-lg bg-emerald-950/50 hover:bg-emerald-900/50 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Users className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Demo Citizen</span>
                </button>
              </div>

              {/* Continue with Google button */}
              <button
                type="button"
                onClick={() => handleQuickDemo('operator')}
                className="mt-2.5 w-full py-2 px-3 rounded-lg bg-slate-900/60 hover:bg-slate-800/70 border border-slate-700/60 text-slate-300 text-xs flex items-center justify-center gap-2 transition-all cursor-pointer font-sans"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5c1.5 0 2.9.5 4 1.5l3-3C17.2 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.3 8.9 5 12 5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.7s.1-2 .4-2.7L1.6 6.4C.6 8.3 0 10.1 0 12s.6 3.7 1.6 5.6l3.7-2.9z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.3-6.7-5.3L1.6 16c1.9 3.8 5.8 7 10.4 7z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>
            </div>

            {/* Telemetry ping ticker footer */}
            <div className="mt-4 flex items-center justify-between text-[10px] font-mono text-slate-500">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>Simulated IoT Mesh Active</span>
              </span>
              <span>150+ Smart Nodes</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fly-Through Transition Indicator */}
      {isTransitioningToDashboard && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex flex-col items-center justify-center bg-slate-950/40 backdrop-blur-sm z-30 pointer-events-none"
        >
          <div className="p-4 rounded-2xl glass-panel text-center">
            <div className="w-8 h-8 mx-auto border-3 border-cyan-400 border-t-transparent rounded-full animate-spin mb-3" />
            <div className="text-cyan-300 font-display text-lg tracking-widest uppercase">
              Entering City Command Grid
            </div>
            <div className="text-xs text-slate-400 font-mono mt-1">
              Synchronizing 5 Sector Telemetries...
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

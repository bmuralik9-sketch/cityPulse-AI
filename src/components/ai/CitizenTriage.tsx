import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Upload,
  Camera,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  RefreshCw,
  Building2,
  ShieldAlert,
  Send,
  X,
  Image as ImageIcon,
} from 'lucide-react';
import { triageCitizenPhoto } from '../../services/geminiService';
import { useCity } from '../../context/CityContext';
import type { CitizenReport } from '../../types/city';

export const CitizenTriageModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { submitCitizenReport } = useCity();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CitizenReport['category']>('Pothole');
  const [location, setLocation] = useState('Central District, 4th Avenue');
  const [selectedImage, setSelectedImage] = useState<string>(
    'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80'
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [triageResult, setTriageResult] = useState<Partial<CitizenReport> | null>(null);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  // Preset sample photos for fast judging review
  const samplePresets = [
    {
      label: 'Deep Pothole',
      category: 'Pothole' as CitizenReport['category'],
      title: 'Pothole with exposed asphalt sub-base',
      location: 'Grand Ave & 6th St',
      url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80',
    },
    {
      label: 'Overflowing Waste',
      category: 'Overflowing Waste' as CitizenReport['category'],
      title: 'Dumpster bin overflow onto walkway',
      location: 'Marina Promenade Bayside',
      url: 'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=600&q=80',
    },
    {
      label: 'Broken Streetlight',
      category: 'Broken Streetlight' as CitizenReport['category'],
      title: 'Dark pole fixture near school crosswalk',
      location: 'Northridge School Crossing',
      url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
    },
    {
      label: 'Water Main Leak',
      category: 'Water Main Leak' as CitizenReport['category'],
      title: 'Sub-surface pipe fracture pooling on road',
      location: 'Industrial Park Way',
      url: 'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?auto=format&fit=crop&w=600&q=80',
    },
  ];

  const handleSelectPreset = (preset: typeof samplePresets[0]) => {
    setTitle(preset.title);
    setCategory(preset.category);
    setLocation(preset.location);
    setSelectedImage(preset.url);
    setTriageResult(null);
  };

  const handleCustomFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setTriageResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRunTriage = async () => {
    if (!title) setTitle(`${category} Issue Reported`);
    setIsAnalyzing(true);
    try {
      const res = await triageCitizenPhoto(
        title || `${category} Hazard`,
        category,
        location,
        selectedImage
      );
      setTriageResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmitFinalReport = () => {
    if (!triageResult) return;
    submitCitizenReport({
      title: title || `${category} Issue`,
      category,
      imageUrl: selectedImage,
      location,
      zoneId: 'zone-1',
      severity: triageResult.severity || 'Medium',
      assignedDepartment: triageResult.assignedDepartment || 'Department of Public Works',
      aiAnalysisSummary: triageResult.aiAnalysisSummary || 'Verified by municipal triage model.',
      citizenReplyDraft: triageResult.citizenReplyDraft || 'Thank you for your report.',
    });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md pointer-events-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl max-h-[90vh] rounded-2xl glass-panel-glow border border-cyan-400/40 p-5 sm:p-6 flex flex-col overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300">
              <Sparkles className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-display text-white">
                Gemini Vision Citizen Triage
              </h2>
              <p className="text-xs font-sans text-slate-400">
                Multimodal Image Classification & Municipal Department Routing
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          {/* Preset Buttons for Fast Demo */}
          <div>
            <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1.5">
              Quick Test Presets (or upload custom photo):
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {samplePresets.map((preset, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`p-2 rounded-xl border text-left text-xs font-mono transition-all ${
                    selectedImage === preset.url
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="font-semibold">{preset.label}</div>
                  <div className="text-[10px] text-slate-500 truncate">{preset.location}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Image Preview & Upload Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
            <div className="relative rounded-xl overflow-hidden border border-slate-700 h-44 bg-slate-950 flex items-center justify-center group">
              <img
                src={selectedImage}
                alt="Selected preview"
                className="w-full h-full object-cover"
              />
              <label className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1.5 text-cyan-300 text-xs font-mono cursor-pointer transition-opacity backdrop-blur-sm">
                <Upload className="w-5 h-5" />
                <span>Upload Custom Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCustomFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="space-y-2.5">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Report Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Hazardous Pothole with exposed steel"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="Pothole">Pothole / Road Damage</option>
                  <option value="Overflowing Waste">Overflowing Waste Bin</option>
                  <option value="Broken Streetlight">Broken Public Lighting</option>
                  <option value="Water Main Leak">Water Main Leak</option>
                  <option value="Hazardous Tree">Fallen Tree / Hazard</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Street / Landmark"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          </div>

          {/* Trigger Vision Analysis Button */}
          {!triageResult && (
            <button
              type="button"
              disabled={isAnalyzing}
              onClick={handleRunTriage}
              className="w-full py-3 rounded-xl font-mono font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 hover:from-cyan-300 hover:to-teal-300 shadow-neon-cyan flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Gemini Vision Triage in Progress...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Run Multimodal Vision Triage</span>
                </>
              )}
            </button>
          )}

          {/* AI Triage Results */}
          {triageResult && (
            <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-300">Severity Level:</span>
                  <span
                    className={`px-2.5 py-0.5 rounded text-xs font-mono uppercase font-bold ${
                      triageResult.severity === 'Critical'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : triageResult.severity === 'High'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    }`}
                  >
                    {triageResult.severity}
                  </span>
                </div>

                <div className="text-xs font-mono text-cyan-300 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>{triageResult.assignedDepartment}</span>
                </div>
              </div>

              <div>
                <span className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                  AI Computer Vision Diagnosis:
                </span>
                <p className="text-xs text-slate-200 leading-relaxed bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                  {triageResult.aiAnalysisSummary}
                </p>
              </div>

              <div>
                <span className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                  Drafted Citizen Status Update:
                </span>
                <p className="text-xs text-slate-200 leading-relaxed bg-slate-950/60 p-2.5 rounded-lg border border-slate-800 italic">
                  "{triageResult.citizenReplyDraft}"
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setTriageResult(null)}
                  className="px-3 py-2 rounded-xl text-xs font-mono text-slate-400 hover:bg-slate-800"
                >
                  Re-evaluate
                </button>
                <button
                  type="button"
                  disabled={submitted}
                  onClick={handleSubmitFinalReport}
                  className="flex-1 py-2 rounded-xl font-mono font-semibold text-xs bg-cyan-400 text-slate-950 hover:bg-cyan-300 transition-all shadow-neon-cyan flex items-center justify-center gap-2 cursor-pointer"
                >
                  {submitted ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Ticket Dispatched to Work Queue!</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Log Ticket & Dispatch Department</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

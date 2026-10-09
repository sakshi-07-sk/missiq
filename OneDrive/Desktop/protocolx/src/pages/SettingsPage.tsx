import React, { useState } from 'react';
import { 
  Settings, 
  Cpu, 
  Server, 
  Check, 
  Trash2, 
  ShieldCheck, 
  Lock, 
  Sliders,
  Sun,
  Moon,
  Palette
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface SettingsPageProps {
  preferBackend: boolean;
  setPreferBackend: (val: boolean) => void;
  summaryLength: 'short' | 'detailed';
  setSummaryLength: (val: 'short' | 'detailed') => void;
  backendOnline: boolean;
  onClearSession: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  preferBackend,
  setPreferBackend,
  summaryLength,
  setSummaryLength,
  backendOnline,
  onClearSession,
}) => {
  const { theme, setTheme } = useTheme();
  const [wipedToast, setWipedToast] = useState(false);

  const handleWipe = () => {
    onClearSession();
    setWipedToast(true);
    setTimeout(() => setWipedToast(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
      <div className="pb-4 border-b border-aurora-border/70">
        <h1 className="text-2xl font-bold text-aurora-text tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6 text-aurora-primary" />
          <span>Platform Settings & Appearance</span>
        </h1>
        <p className="text-xs text-aurora-muted mt-1">
          Customize visual theme, processing engine, summary granularity, and local device storage
        </p>
      </div>

      {/* 1. Appearance / Theme */}
      <div className="p-6 rounded-3xl bg-aurora-surface border border-aurora-border space-y-4">
        <div className="flex items-center gap-2.5">
          <Palette className="w-5 h-5 text-aurora-primary" />
          <div>
            <h3 className="text-sm font-bold text-aurora-text">Theme & Visual Experience</h3>
            <p className="text-xs text-aurora-muted">Choose your preferred workspace aesthetic</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {/* Light Theme */}
          <div
            onClick={() => setTheme('light')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              theme === 'light'
                ? 'bg-aurora-elevated border-aurora-primary shadow-sm'
                : 'bg-aurora-input border-aurora-border hover:border-aurora-primary/40'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-aurora-text flex items-center gap-1.5">
                <Sun className="w-4 h-4 text-aurora-warning" />
                Arctic Frost (Light Mode)
              </span>
              {theme === 'light' && <Check className="w-4 h-4 text-aurora-primary" />}
            </div>
            <p className="text-[11px] text-aurora-muted leading-relaxed">
              Crisp, clean, high-contrast light background optimized for daylight productivity and focused reading.
            </p>
          </div>

          {/* Dark Theme */}
          <div
            onClick={() => setTheme('dark')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              theme === 'dark'
                ? 'bg-aurora-elevated border-aurora-primary shadow-sm'
                : 'bg-aurora-input border-aurora-border hover:border-aurora-primary/40'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-aurora-text flex items-center gap-1.5">
                <Moon className="w-4 h-4 text-aurora-secondary" />
                Arctic Aurora (Dark Mode)
              </span>
              {theme === 'dark' && <Check className="w-4 h-4 text-aurora-primary" />}
            </div>
            <p className="text-[11px] text-aurora-muted leading-relaxed">
              Deep atmospheric teal background inspired by the northern lights for low-light environments.
            </p>
          </div>
        </div>
      </div>

      {/* 1. Processing Engine */}
      <div className="p-6 rounded-3xl bg-aurora-surface border border-aurora-border space-y-4">
        <div className="flex items-center gap-2.5">
          <Cpu className="w-5 h-5 text-aurora-primary" />
          <div>
            <h3 className="text-sm font-bold text-aurora-text">Execution Environment</h3>
            <p className="text-xs text-aurora-muted">Select your preferred NLP processing runtime</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {/* On-Device RAM */}
          <div
            onClick={() => setPreferBackend(false)}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              !preferBackend
                ? 'bg-aurora-elevated border-aurora-primary shadow-sm'
                : 'bg-aurora-input border-aurora-border hover:border-aurora-primary/40'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-aurora-text flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-aurora-secondary" />
                100% On-Device (Browser RAM)
              </span>
              {!preferBackend && <Check className="w-4 h-4 text-aurora-primary" />}
            </div>
            <p className="text-[11px] text-aurora-muted leading-relaxed">
              Completely offline. All entity detection, priorities, and summarizers run in client JavaScript memory.
            </p>
          </div>

          {/* FastAPI Backend */}
          <div
            onClick={() => setPreferBackend(true)}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              preferBackend
                ? 'bg-aurora-elevated border-aurora-primary shadow-sm'
                : 'bg-aurora-input border-aurora-border hover:border-aurora-primary/40'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-aurora-text flex items-center gap-1.5">
                <Server className="w-4 h-4 text-aurora-primary" />
                Python FastAPI Local Service
              </span>
              {preferBackend && <Check className="w-4 h-4 text-aurora-primary" />}
            </div>
            <p className="text-[11px] text-aurora-muted leading-relaxed">
              Connects to localhost:8000. Status: 
              <strong className={backendOnline ? 'text-aurora-success ml-1' : 'text-aurora-warning ml-1'}>
                {backendOnline ? 'Connected' : 'Offline (Local Engine Active)'}
              </strong>
            </p>
          </div>
        </div>
      </div>

      {/* 2. Granularity Preference */}
      <div className="p-6 rounded-3xl bg-aurora-surface border border-aurora-border space-y-4">
        <div className="flex items-center gap-2.5">
          <Sliders className="w-5 h-5 text-aurora-secondary" />
          <div>
            <h3 className="text-sm font-bold text-aurora-text">Summary Granularity</h3>
            <p className="text-xs text-aurora-muted">Control the length of synthesized executive briefs</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={() => setSummaryLength('short')}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
              summaryLength === 'short'
                ? 'bg-aurora-elevated border-aurora-primary text-aurora-text'
                : 'bg-aurora-input border-aurora-border text-aurora-muted'
            }`}
          >
            <div className="text-xs font-bold text-aurora-text mb-1">Ultra-Concise (1–2 Sentences)</div>
            <p className="text-[11px] leading-relaxed">Designed for fast scans when you only have 30 seconds.</p>
          </button>

          <button
            type="button"
            onClick={() => setSummaryLength('detailed')}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
              summaryLength === 'detailed'
                ? 'bg-aurora-elevated border-aurora-primary text-aurora-text'
                : 'bg-aurora-input border-aurora-border text-aurora-muted'
            }`}
          >
            <div className="text-xs font-bold text-aurora-text mb-1">Detailed Brief (Multi-Sentence)</div>
            <p className="text-[11px] leading-relaxed">Includes context rationale, immediate blockers, and timeline context.</p>
          </button>
        </div>
      </div>

      {/* 3. Session State & Privacy Reset */}
      <div className="p-6 rounded-3xl bg-aurora-surface border border-aurora-border space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-aurora-text flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-aurora-primary" />
              <span>Volatile Session Wipe</span>
            </h3>
            <p className="text-xs text-aurora-muted">
              Instantly purges volatile RAM memory and active conversation analysis state.
            </p>
          </div>

          <button
            onClick={handleWipe}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-aurora-error bg-aurora-error/15 border border-aurora-error/30 hover:bg-aurora-error/25 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Wipe Active Session</span>
          </button>
        </div>

        {wipedToast && (
          <div className="p-3 rounded-xl bg-aurora-primary/15 border border-aurora-primary/30 text-aurora-primary text-xs font-medium animate-slide-up">
            ✓ Active volatile session memory wiped successfully.
          </div>
        )}
      </div>
    </div>
  );
};

import React from 'react';
import { ShieldCheck, Sparkles, Trash2, Moon, Sun, Lock } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onClearSession: () => void;
  onOpenPrivacy: () => void;
  hasAnalysis: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  setDarkMode,
  onClearSession,
  onOpenPrivacy,
  hasAnalysis,
}) => {
  return (
    <header className="sticky top-0 z-30 border-b border-aurora-border/70 bg-aurora-surface/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-aurora-primary to-aurora-secondary shadow-md">
            <Sparkles className="w-5 h-5 text-aurora-bg" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-aurora-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-aurora-primary"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-aurora-text flex items-center gap-2 font-display">
                MissIQ <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-aurora-primary/15 text-aurora-primary border border-aurora-primary/30">PRO</span>
              </h1>
              <span className="text-xs font-medium text-aurora-muted hidden sm:inline-block">
                “Never Miss What Matters”
              </span>
            </div>
            <p className="text-[11px] text-aurora-muted hidden md:block">
              Zero-exposure, on-device conversation intelligence & priority triage
            </p>
          </div>
        </div>

        {/* Badges & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* 100% Local-First Badge */}
          <button
            onClick={onOpenPrivacy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all cursor-pointer group"
            title="Click to view Local-First Privacy verification"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span className="hidden xs:inline">100% Local-First</span>
            <Lock className="w-3 h-3 text-emerald-400/70" />
          </button>

          {/* Clear Session Button */}
          {hasAnalysis && (
            <button
              onClick={onClearSession}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-500/10 text-rose-300 border border-rose-500/20 hover:bg-rose-500/20 transition-colors"
              title="Wipe conversation data from browser memory"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden sm:inline">Wipe Session</span>
            </button>
          )}

          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 border border-slate-800 transition-colors"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-300" />}
          </button>
        </div>
      </div>
    </header>
  );
};

import React from 'react';
import { Sparkles } from 'lucide-react';

export const PageLoadingSkeleton: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 space-y-4 font-sans animate-fade-in">
      <div className="relative">
        <div className="w-12 h-12 rounded-2xl bg-aurora-primary/20 border border-aurora-primary/30 flex items-center justify-center text-aurora-primary animate-pulse">
          <Sparkles className="w-6 h-6 animate-spin" />
        </div>
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-aurora-primary opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-aurora-primary"></span>
        </span>
      </div>

      <div className="text-center space-y-1">
        <h3 className="text-sm font-bold text-aurora-text">Preparing Isolated Sandbox</h3>
        <p className="text-xs text-aurora-muted font-mono">Initializing client-side intelligence modules...</p>
      </div>

      {/* Subtle skeleton bar */}
      <div className="w-48 h-1.5 rounded-full bg-aurora-surface border border-aurora-border overflow-hidden">
        <div className="h-full bg-aurora-primary rounded-full animate-progress" />
      </div>
    </div>
  );
};

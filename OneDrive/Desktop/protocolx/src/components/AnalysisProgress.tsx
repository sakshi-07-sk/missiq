import React, { useState, useEffect } from 'react';
import { Sparkles, MessageSquare, AlertTriangle, CheckSquare, Calendar, Layers } from 'lucide-react';

interface AnalysisProgressProps {
  onComplete: () => void;
}

const STAGES = [
  { label: 'Reading messages...', icon: MessageSquare, delay: 420 },
  { label: 'Finding important updates...', icon: AlertTriangle, delay: 450 },
  { label: 'Extracting action items...', icon: CheckSquare, delay: 450 },
  { label: 'Checking dates and mentions...', icon: Calendar, delay: 420 },
  { label: 'Preparing the summary...', icon: Sparkles, delay: 400 },
];

export const AnalysisProgress: React.FC<AnalysisProgressProps> = ({ onComplete }) => {
  const [currentStage, setCurrentStage] = useState(0);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (currentStage < STAGES.length - 1) {
      timer = setTimeout(() => {
        setCurrentStage(prev => prev + 1);
      }, STAGES[currentStage].delay);
    } else {
      timer = setTimeout(() => {
        onComplete();
      }, 400);
    }
    return () => clearTimeout(timer);
  }, [currentStage, onComplete]);

  const ActiveIcon = STAGES[currentStage].icon;

  return (
    <div className="p-8 sm:p-12 rounded-3xl bg-aurora-surface border border-aurora-border shadow-glow-mint max-w-xl mx-auto text-center space-y-6 animate-fade-in relative overflow-hidden">
      {/* Background glow orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-aurora-primary/10 rounded-full blur-3xl pointer-events-none" />

      {/* Central Pulsing Animated Icon */}
      <div className="relative mx-auto w-16 h-16 flex items-center justify-center">
        <div className="absolute inset-0 rounded-2xl bg-aurora-primary/20 animate-ping opacity-60" />
        <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-aurora-primary to-aurora-secondary flex items-center justify-center shadow-lg shadow-aurora-primary/30">
          <ActiveIcon className="w-8 h-8 text-aurora-bg animate-pulse stroke-[2.5]" />
        </div>
      </div>

      <div>
        <span className="text-[11px] font-mono tracking-widest uppercase text-aurora-primary font-bold">
          CONVERSATION INTELLIGENCE PIPELINE
        </span>
        <h3 className="text-lg font-bold text-aurora-text mt-1">
          {STAGES[currentStage].label}
        </h3>
        <p className="text-xs text-aurora-muted mt-1 font-normal">
          Running local parsing & grounded extraction
        </p>
      </div>

      {/* Step Indicators */}
      <div className="flex items-center justify-center gap-2 pt-2">
        {STAGES.map((stage, idx) => (
          <div
            key={idx}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              idx === currentStage
                ? 'w-10 bg-aurora-primary shadow-sm shadow-aurora-primary/50'
                : idx < currentStage
                ? 'w-6 bg-aurora-secondary'
                : 'w-4 bg-aurora-input'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

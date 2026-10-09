import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, ArrowRight, UserPlus, ArrowLeft } from 'lucide-react';
import { WorkspacePage } from './WorkspacePage';
import { CatchUpAnalysis } from '../types';

interface DemoPageProps {
  onViewSource: (messageId: string, excerpt: string, sender: string) => void;
}

export const DemoPage: React.FC<DemoPageProps> = ({ onViewSource }) => {
  const [analysis, setAnalysis] = useState<CatchUpAnalysis | null>(null);
  const [userName, setUserName] = useState('Priya');

  return (
    <div className="min-h-screen bg-aurora-bg text-aurora-text flex flex-col font-sans selection:bg-aurora-primary selection:text-aurora-bg">
      {/* Top Banner */}
      <header className="border-b border-aurora-border/70 bg-aurora-surface/90 backdrop-blur-xl px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-aurora-primary text-aurora-bg flex items-center justify-center font-bold shadow-md shadow-aurora-primary/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4 text-aurora-bg" />
            </div>
            <span className="text-base font-bold text-aurora-text">
              Miss<span className="text-aurora-primary">IQ</span>
            </span>
          </Link>
          <span className="text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-aurora-primary/15 text-aurora-primary border border-aurora-primary/30">
            PUBLIC GUEST DEMO
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-aurora-muted">
            <ShieldCheck className="w-3.5 h-3.5 text-aurora-primary" />
            <span>Zero Sign-up · Ephemeral Local Session</span>
          </div>

          <Link
            to="/signup"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-aurora-bg bg-aurora-primary hover:bg-aurora-primary-hover shadow-sm transition-all"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Create Account</span>
          </Link>
        </div>
      </header>

      {/* Main Workspace Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1240px] mx-auto w-full">
        <WorkspacePage
          analysis={analysis}
          setAnalysis={setAnalysis}
          userName={userName}
          setUserName={setUserName}
          onClearSession={() => setAnalysis(null)}
          onViewSource={onViewSource}
        />
      </main>
    </div>
  );
};

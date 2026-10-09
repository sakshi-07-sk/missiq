import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Play, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Scale, 
  Calendar, 
  AtSign, 
  Lock, 
  Database, 
  Cpu,
  Layers,
  GraduationCap,
  Trophy,
  Briefcase
} from 'lucide-react';
import { PresetSample } from '../data/samples';

interface LandingPageProps {
  onStartWorkspace: () => void;
  onSelectPresetAndAnalyze: (preset: PresetSample) => void;
  presets: PresetSample[];
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartWorkspace,
  onSelectPresetAndAnalyze,
  presets,
}) => {
  return (
    <div className="space-y-20 pb-16 animate-fade-in">
      {/* 1. Hero Section */}
      <section className="relative pt-12 sm:pt-20 text-center max-w-4xl mx-auto px-4">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/25 text-teal-300 text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>MissIQ Conversation Intelligence • Never Miss What Matters</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Hundreds of messages.<br />
          <span className="bg-gradient-to-r from-teal-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
            Only a few things matter.
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Tired of drowning in college group chats, Slack channels, and team threads? MissIQ answers the only question that counts:
          <span className="block mt-1 font-semibold text-teal-300 italic">
            “What did I miss, and what do I need to do next?”
          </span>
        </p>

        {/* Primary and Secondary CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <button
            onClick={onStartWorkspace}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3 rounded-xl font-semibold text-sm text-navy-950 bg-gradient-to-r from-teal-400 to-cyan-400 hover:from-teal-300 hover:to-cyan-300 shadow-lg shadow-teal-500/20 transform hover:-translate-y-0.5 transition-all cursor-pointer"
          >
            <span>Start Catching Up</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onSelectPresetAndAnalyze(presets[0])}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium text-sm text-slate-200 bg-navy-900 border border-navy-700 hover:bg-navy-800 hover:border-teal-500/40 transition-colors"
          >
            <Play className="w-4 h-4 text-teal-400 fill-teal-400" />
            <span>Try 1-Click Demo (College)</span>
          </button>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-teal-400" />
            No account required (Guest mode)
          </span>
          <span className="flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-teal-400" />
            Zero cloud leakage by default
          </span>
          <span className="flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-teal-400" />
            Instant client & FastAPI NLP
          </span>
        </div>
      </section>

      {/* 2. Quick Demo Launcher Scenarios */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-xs font-bold uppercase tracking-widest text-teal-400">
            Instant Test Scenarios
          </h2>
          <p className="text-xl font-bold text-white mt-1">
            Choose a realistic scenario to test immediately
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {presets.map((preset) => (
            <div
              key={preset.id}
              onClick={() => onSelectPresetAndAnalyze(preset)}
              className="p-5 rounded-2xl bg-navy-900/70 border border-navy-800 hover:border-teal-500/40 hover:bg-navy-850 transition-all cursor-pointer group relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-300 border border-teal-500/20 group-hover:scale-110 transition-transform">
                  {preset.context === 'college' && <GraduationCap className="w-5 h-5" />}
                  {preset.context === 'project' && <Trophy className="w-5 h-5" />}
                  {preset.context === 'work' && <Briefcase className="w-5 h-5" />}
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-navy-800 text-slate-300 border border-navy-700">
                  {preset.context}
                </span>
              </div>

              <h3 className="text-sm font-bold text-white group-hover:text-teal-300 transition-colors">
                {preset.title}
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {preset.description}
              </p>

              <div className="mt-4 pt-3 border-t border-navy-800 flex items-center justify-between text-xs text-teal-400 font-medium">
                <span>Load & Catch Up</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Core Capabilities Grid */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-xs font-bold uppercase tracking-widest text-teal-400">
            Intelligent Triage Engine
          </h2>
          <p className="text-2xl font-bold text-white mt-1">
            Every critical piece of information, surfaced and structured
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Card 1: Executive Summary */}
          <div className="p-5 rounded-2xl bg-navy-900/60 border border-navy-800">
            <div className="p-2.5 w-fit rounded-xl bg-teal-500/10 text-teal-300 border border-teal-500/20 mb-3">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Grounded Catch-Up Summary</h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Synthesizes overall context, important announcements, and main discussion points. Supports both short and detailed briefs without hallucinating.
            </p>
          </div>

          {/* Card 2: Priority Engine */}
          <div className="p-5 rounded-2xl bg-navy-900/60 border border-navy-800">
            <div className="p-2.5 w-fit rounded-xl bg-rose-500/10 text-rose-300 border border-rose-500/20 mb-3">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Smart Priority Engine</h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Categorizes messages into HIGH, MEDIUM, and LOW with explicit justification reasons so you know exactly why each item demands attention.
            </p>
          </div>

          {/* Card 3: Action Items */}
          <div className="p-5 rounded-2xl bg-navy-900/60 border border-navy-800">
            <div className="p-2.5 w-fit rounded-xl bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 mb-3">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Action Item Tracking</h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Extracts tasks, assigned owners, and explicit due dates (strictly marking "Not specified" when missing). Includes interactive completion checkmarks!
            </p>
          </div>

          {/* Card 4: Decisions */}
          <div className="p-5 rounded-2xl bg-navy-900/60 border border-navy-800">
            <div className="p-2.5 w-fit rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 mb-3">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Decisions & Agreements</h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Distinguishes between confirmed consensus and open proposals under discussion. Displays verbatim quotes for complete peace of mind.
            </p>
          </div>

          {/* Card 5: Deadlines & Calendar */}
          <div className="p-5 rounded-2xl bg-navy-900/60 border border-navy-800">
            <div className="p-2.5 w-fit rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/20 mb-3">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Deadlines & iCal Export</h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Detects assignment due dates, exam dates, fee deadlines, and meetings. Export them directly as an .ics calendar file for Google or Apple Calendar.
            </p>
          </div>

          {/* Card 6: Direct Mentions */}
          <div className="p-5 rounded-2xl bg-navy-900/60 border border-navy-800">
            <div className="p-2.5 w-fit rounded-xl bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 mb-3">
              <AtSign className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Direct Mention Alerts</h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Enter your name or identifier to isolate direct inquiries, mentions, and tasks assigned to you across lengthy discussions.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Privacy-First Architecture */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="p-8 rounded-3xl bg-gradient-to-b from-navy-900 to-navy-950 border border-navy-800 shadow-2xl relative overflow-hidden">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Privacy is Core to MissIQ</h3>
              <p className="text-xs text-teal-300">Your conversations belong to you — period.</p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            MissIQ was designed from the ground up for strict privacy. Conversations are processed locally on your machine using an on-device heuristic pipeline.
          </p>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-3.5 rounded-xl bg-navy-950/70 border border-navy-800 text-xs">
              <Database className="w-4 h-4 text-teal-400 mb-1.5" />
              <strong className="text-white block mb-0.5">IndexedDB Local History</strong>
              <span className="text-slate-400">Past summaries are kept privately in your browser storage.</span>
            </div>

            <div className="p-3.5 rounded-xl bg-navy-950/70 border border-navy-800 text-xs">
              <Lock className="w-4 h-4 text-teal-400 mb-1.5" />
              <strong className="text-white block mb-0.5">Zero Silent Uploads</strong>
              <span className="text-slate-400">No telemetry, tracking pixels, or third-party ad loggers.</span>
            </div>

            <div className="p-3.5 rounded-xl bg-navy-950/70 border border-navy-800 text-xs">
              <Cpu className="w-4 h-4 text-teal-400 mb-1.5" />
              <strong className="text-white block mb-0.5">Dual Processing Option</strong>
              <span className="text-slate-400">Run via FastAPI or 100% on-device in browser RAM.</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

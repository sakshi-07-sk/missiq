import React, { useState } from 'react';
import { 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  AlertCircle, 
  Lightbulb, 
  HelpCircle,
  FileDown
} from 'lucide-react';
import { CatchUpSummary } from '../types';

interface SummaryCardProps {
  summary: CatchUpSummary;
  onOpenExport: () => void;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ summary, onOpenExport }) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleAudioNarration = () => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-Speech is not supported in your browser.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    const textToSpeak = `${summary.executiveOverview}. Key highlights: ${summary.keyThemes.join('. ')}. ${
      summary.immediateAttentionItems.length > 0 
        ? `Immediate items needing attention: ${summary.immediateAttentionItems.join('. ')}` 
        : ''
    }`;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
  };

  const handleCopySummary = () => {
    const text = `Executive Catch-Up Summary:\n${summary.executiveOverview}\n\nKey Themes:\n${summary.keyThemes.map(t => `- ${t}`).join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full bg-slate-900/70 rounded-2xl border border-slate-800 p-5 shadow-xl backdrop-blur-md relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header with audio and copy buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/25">
            <Sparkles className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white tracking-tight">
              Executive Catch-Up Summary
            </h2>
            <p className="text-xs text-slate-400">
              Grounded TL;DR synthesized directly from message transcripts
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Audio TTS Briefing */}
          <button
            onClick={handleAudioNarration}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              isPlayingAudio
                ? 'bg-indigo-600 text-white border-indigo-400 shadow-lg shadow-indigo-500/25 animate-pulse'
                : 'bg-slate-800/90 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
            }`}
            title="Listen to synthesized audio briefing"
          >
            {isPlayingAudio ? (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span>Stop Audio</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>Audio Briefing</span>
              </>
            )}
          </button>

          {/* Copy summary */}
          <button
            onClick={handleCopySummary}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/90 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white transition-colors"
            title="Copy summary to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>

          {/* Export full report */}
          <button
            onClick={onOpenExport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/25 transition-colors"
            title="Export full catch-up intelligence report"
          >
            <FileDown className="w-3.5 h-3.5 text-indigo-400" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Main Executive Paragraph */}
      <div className="mt-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800/90">
        <p className="text-sm text-slate-200 leading-relaxed font-sans">
          {summary.executiveOverview}
        </p>
      </div>

      {/* Structured Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 mt-4">
        {/* Immediate Attention Items */}
        {summary.immediateAttentionItems.length > 0 && (
          <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/25">
            <div className="flex items-center gap-2 mb-2 text-rose-300">
              <AlertCircle className="w-4 h-4 text-rose-400" />
              <h3 className="text-xs font-semibold uppercase tracking-wider">
                Needs Immediate Attention
              </h3>
            </div>
            <ul className="space-y-1.5">
              {summary.immediateAttentionItems.map((item, idx) => (
                <li key={idx} className="text-xs text-rose-200/90 flex items-start gap-1.5 leading-snug">
                  <span className="text-rose-400 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Key Themes / Accomplishments */}
        <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800">
          <div className="flex items-center gap-2 mb-2 text-indigo-300">
            <Lightbulb className="w-4 h-4 text-indigo-400" />
            <h3 className="text-xs font-semibold uppercase tracking-wider">
              Key Themes & Highlights
            </h3>
          </div>
          <ul className="space-y-1.5">
            {summary.keyThemes.map((theme, idx) => (
              <li key={idx} className="text-xs text-slate-300 flex items-start gap-1.5 leading-snug">
                <span className="text-indigo-400 font-bold">•</span>
                <span>{theme}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Open Questions or Risks */}
        {summary.openQuestionsOrRisks.length > 0 && (
          <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/25">
            <div className="flex items-center gap-2 mb-2 text-amber-300">
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-semibold uppercase tracking-wider">
                Open Questions & Risks
              </h3>
            </div>
            <ul className="space-y-1.5">
              {summary.openQuestionsOrRisks.map((risk, idx) => (
                <li key={idx} className="text-xs text-amber-200/90 flex items-start gap-1.5 leading-snug">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>{risk}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

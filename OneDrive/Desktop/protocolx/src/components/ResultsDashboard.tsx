import React, { useState } from 'react';
import { 
  CatchUpAnalysis,
  ActionItem,
  DecisionItem,
  PriorityItem,
  MentionItem,
  DeadlineItem
} from '../types';
import { 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  Download, 
  Search, 
  CheckSquare, 
  Scale, 
  AlertTriangle, 
  AtSign, 
  Calendar, 
  Layers, 
  Clock, 
  User, 
  CheckCircle2, 
  Circle, 
  ExternalLink, 
  Info, 
  FileDown,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  MessageSquare
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { generateMarkdownReport, generateIcsCalendar, downloadTextFile } from '../services/exportService';

interface ResultsDashboardProps {
  analysis: CatchUpAnalysis;
  userName: string;
  onToggleCompleteAction: (id: string) => void;
  onViewSource: (messageId: string, excerpt: string, sender: string) => void;
  onNewAnalysisClick: () => void;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({
  analysis,
  userName,
  onToggleCompleteAction,
  onViewSource,
  onNewAnalysisClick,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'priority' | 'deadline'>('priority');
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(true);

  // Audio Narration
  const handleAudioNarration = () => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-Speech is not supported in this browser.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    const textToSpeak = `${analysis.summary.executiveOverview}. Highlights: ${analysis.summary.keyThemes.join('. ')}.`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 1.05;
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
  };

  const handleCopySummary = () => {
    const text = `MissIQ Briefing:\n${analysis.summary.executiveOverview}\n\nKey Themes:\n${analysis.summary.keyThemes.map(t => `- ${t}`).join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportMarkdown = () => {
    const md = generateMarkdownReport(analysis);
    downloadTextFile('missiq-catchup-briefing.md', md, 'text/markdown');
  };

  const handleExportIcs = () => {
    const ics = generateIcsCalendar(analysis);
    downloadTextFile('missiq-deadlines.ics', ics, 'text/calendar');
  };

  const handleToggleTask = (id: string, currentlyCompleted?: boolean) => {
    onToggleCompleteAction(id);
    if (!currentlyCompleted) {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#45E0C1', '#8AA8FF', '#45D6A0', '#F0FFFC']
      });
    }
  };

  // Sort action items
  const sortedActionItems = [...analysis.actionItems].sort((a, b) => {
    if (sortBy === 'priority') {
      const order = { High: 1, Medium: 2, Low: 3 };
      return (order[a.priority] || 2) - (order[b.priority] || 2);
    } else {
      return a.dueDate.localeCompare(b.dueDate);
    }
  }).filter(item => {
    return !searchQuery || item.task.toLowerCase().includes(searchQuery.toLowerCase()) || item.owner.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* A. SUMMARY HERO CARD WITH SUBTLE MINT ACCENT LINE */}
      <section className="p-6 sm:p-8 rounded-3xl bg-aurora-surface border border-aurora-border border-l-4 border-l-aurora-primary shadow-2xl relative overflow-hidden">
        {/* Subtle radial ambient glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-aurora-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-aurora-border/60">
          <div>
            <span className="text-[11px] font-mono tracking-widest uppercase text-aurora-primary font-bold">
              CONVERSATION INTELLIGENCE BRIEF
            </span>
            <h2 className="text-2xl font-extrabold text-aurora-text tracking-tight mt-0.5">
              Here's what you missed.
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Audio player */}
            <button
              onClick={handleAudioNarration}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                isPlayingAudio
                  ? 'bg-aurora-primary text-aurora-bg border-aurora-primary font-bold animate-pulse'
                  : 'bg-aurora-elevated text-aurora-muted border-aurora-border hover:text-aurora-text hover:border-aurora-primary/40'
              }`}
              title="Narrate synthesized brief aloud"
            >
              {isPlayingAudio ? (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-aurora-primary" />
                  <span>Audio Brief</span>
                </>
              )}
            </button>

            {/* Copy button */}
            <button
              onClick={handleCopySummary}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-aurora-elevated text-aurora-muted border border-aurora-border hover:text-aurora-text transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-aurora-success" />
                  <span className="text-aurora-success font-semibold">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>

            {/* Export Markdown */}
            <button
              onClick={handleExportMarkdown}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-aurora-elevated text-aurora-primary border border-aurora-primary/30 hover:bg-aurora-surface transition-colors cursor-pointer"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Export .MD</span>
            </button>

            {/* Collapse/Expand */}
            <button
              onClick={() => setIsSummaryExpanded(!isSummaryExpanded)}
              className="p-1.5 rounded-xl bg-aurora-elevated border border-aurora-border text-aurora-muted hover:text-aurora-text cursor-pointer"
              title={isSummaryExpanded ? "Collapse summary" : "Expand summary"}
            >
              {isSummaryExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Prose summary */}
        {isSummaryExpanded && (
          <div className="mt-5 space-y-4">
            <p className="text-sm sm:text-base text-aurora-text leading-relaxed font-sans">
              {analysis.summary.executiveOverview}
            </p>

            {analysis.summary.immediateAttentionItems.length > 0 && (
              <div className="p-4 rounded-2xl bg-aurora-error/15 border border-aurora-error/30">
                <span className="text-xs font-bold uppercase tracking-wider text-aurora-error flex items-center gap-1.5 mb-2">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Needs Immediate Attention:
                </span>
                <ul className="space-y-1 text-xs text-aurora-text">
                  {analysis.summary.immediateAttentionItems.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-aurora-error font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </section>

      {/* B. INSIGHT STATISTICS (5 COMPACT METRIC CARDS) */}
      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="p-4 rounded-2xl bg-aurora-surface border border-aurora-border hover:border-aurora-primary/40 transition-colors">
          <span className="text-[10px] font-mono uppercase text-aurora-muted">Messages Analyzed</span>
          <div className="text-2xl font-bold text-aurora-text mt-1">
            {analysis.summary.totalMessagesCount}
          </div>
          <p className="text-[11px] text-aurora-secondary mt-0.5 font-mono">
            {analysis.summary.participantCount} speakers
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-aurora-surface border border-aurora-border hover:border-aurora-primary/40 transition-colors">
          <span className="text-[10px] font-mono uppercase text-aurora-muted">Important Updates</span>
          <div className="text-2xl font-bold text-aurora-primary mt-1">
            {analysis.priorities.length}
          </div>
          <p className="text-[11px] text-aurora-error mt-0.5 font-mono">
            {analysis.priorities.filter(p => p.priority === 'High').length} high priority
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-aurora-surface border border-aurora-border hover:border-aurora-primary/40 transition-colors">
          <span className="text-[10px] font-mono uppercase text-aurora-muted">Decisions</span>
          <div className="text-2xl font-bold text-aurora-secondary mt-1">
            {analysis.decisions.length}
          </div>
          <p className="text-[11px] text-aurora-muted mt-0.5 font-mono">
            {analysis.decisions.filter(d => d.status === 'Confirmed').length} confirmed
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-aurora-surface border border-aurora-border hover:border-aurora-primary/40 transition-colors">
          <span className="text-[10px] font-mono uppercase text-aurora-muted">Action Items</span>
          <div className="text-2xl font-bold text-aurora-success mt-1">
            {analysis.actionItems.length}
          </div>
          <p className="text-[11px] text-aurora-muted mt-0.5 font-mono">
            {analysis.actionItems.filter(a => a.completed).length} completed
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-aurora-surface border border-aurora-border hover:border-aurora-primary/40 transition-colors col-span-2 sm:col-span-1">
          <span className="text-[10px] font-mono uppercase text-aurora-muted">Upcoming Deadlines</span>
          <div className="text-2xl font-bold text-aurora-warning mt-1">
            {analysis.deadlines.length}
          </div>
          <p className="text-[11px] text-aurora-muted mt-0.5 font-mono">
            {analysis.deadlines.filter(d => d.urgency === 'Today').length} due today
          </p>
        </div>
      </section>

      {/* C. PRIORITY INTELLIGENCE WITH SEMANTIC COLORS */}
      <section className="p-6 sm:p-7 rounded-3xl bg-aurora-surface border border-aurora-border space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-aurora-border/60">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-aurora-error" />
            <h3 className="text-sm font-bold text-aurora-text uppercase tracking-wider">
              Priority Intelligence Feed ({analysis.priorities.length})
            </h3>
          </div>
          <span className="text-xs text-aurora-muted">Ranked by urgency & impact</span>
        </div>

        <div className="space-y-3">
          {analysis.priorities.map((item) => {
            const isHigh = item.priority === 'High';
            const isMed = item.priority === 'Medium';

            return (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isHigh 
                    ? 'bg-aurora-error/10 border-aurora-error/30 shadow-sm'
                    : isMed
                    ? 'bg-aurora-warning/10 border-aurora-warning/30'
                    : 'bg-aurora-input border-aurora-border'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      isHigh
                        ? 'bg-aurora-error/20 text-aurora-error border-aurora-error/40'
                        : isMed
                        ? 'bg-aurora-warning/20 text-aurora-warning border-aurora-warning/40'
                        : 'bg-aurora-elevated text-aurora-muted border-aurora-border'
                    }`}>
                      {item.priority} Priority
                    </span>
                    <span className="text-[10px] font-mono text-aurora-muted px-2 py-0.5 rounded bg-aurora-elevated">
                      {item.category}
                    </span>
                    <span className="text-xs text-aurora-muted">
                      From: <strong className="text-aurora-text">{item.sourceSender}</strong>
                    </span>
                  </div>

                  <button
                    onClick={() => onViewSource(item.sourceMessageId, item.sourceExcerpt, item.sourceSender)}
                    className="text-xs text-aurora-primary hover:underline flex items-center gap-1 font-medium cursor-pointer"
                  >
                    <span>View source</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>

                <p className="text-xs sm:text-sm font-semibold text-aurora-text leading-relaxed">
                  {item.description}
                </p>

                <div className="mt-2.5 p-2 rounded-xl bg-aurora-input border border-aurora-border/60 text-[11px] text-aurora-muted flex items-start gap-1.5">
                  <Info className="w-3.5 h-3.5 text-aurora-secondary flex-shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-aurora-text">Why {item.priority}:</strong> {item.reason}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* D. ACTION ITEMS CHECKLIST */}
      <section className="p-6 sm:p-7 rounded-3xl bg-aurora-surface border border-aurora-border space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-aurora-border/60">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-aurora-primary" />
            <h3 className="text-sm font-bold text-aurora-text uppercase tracking-wider">
              Action Items ({sortedActionItems.length})
            </h3>
          </div>

          <div className="flex items-center gap-3">
            {/* Sort Toggle */}
            <button
              onClick={() => setSortBy(sortBy === 'priority' ? 'deadline' : 'priority')}
              className="flex items-center gap-1.5 text-xs text-aurora-muted hover:text-aurora-text px-2.5 py-1 rounded-lg bg-aurora-input border border-aurora-border cursor-pointer transition-colors"
            >
              <ArrowUpDown className="w-3 h-3 text-aurora-secondary" />
              <span>Sort: {sortBy === 'priority' ? 'By Urgency' : 'By Due Date'}</span>
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {sortedActionItems.map((task) => {
            const isDone = !!task.completed;

            return (
              <div
                key={task.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isDone 
                    ? 'bg-aurora-input/40 border-aurora-border/40 opacity-60' 
                    : 'bg-aurora-input border-aurora-border hover:border-aurora-primary/30'
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    type="button"
                    onClick={() => handleToggleTask(task.id, isDone)}
                    className="mt-0.5 text-aurora-muted hover:text-aurora-primary transition-colors focus:outline-none cursor-pointer"
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-aurora-primary" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2 text-xs">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          task.priority === 'High' ? 'bg-aurora-error/20 text-aurora-error border-aurora-error/30' :
                          task.priority === 'Medium' ? 'bg-aurora-warning/20 text-aurora-warning border-aurora-warning/30' :
                          'bg-aurora-elevated text-aurora-muted border-aurora-border'
                        }`}>
                          {task.priority}
                        </span>
                        <span className="text-aurora-muted">
                          Owner: <strong className={task.owner === 'Not specified' ? 'text-aurora-muted italic font-normal' : 'text-aurora-text'}>{task.owner}</strong>
                        </span>
                      </div>

                      <span className="text-xs text-aurora-muted">
                        Due: <strong className={task.dueDate === 'Not specified' ? 'text-aurora-muted italic font-normal' : 'text-aurora-secondary'}>{task.dueDate}</strong>
                      </span>
                    </div>

                    <p className={`text-sm font-semibold ${isDone ? 'line-through text-aurora-muted' : 'text-aurora-text'}`}>
                      {task.task}
                    </p>

                    <div className="mt-2.5 pt-2 border-t border-aurora-border/40 flex items-center justify-between text-xs text-aurora-muted">
                      <span>Source: {task.sourceSender}</span>
                      <button
                        type="button"
                        onClick={() => onViewSource(task.sourceMessageId, task.sourceExcerpt, task.sourceSender)}
                        className="text-aurora-primary hover:underline flex items-center gap-1 font-medium cursor-pointer"
                      >
                        <span>View source</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* E. DECISIONS & AGREEMENTS */}
      <section className="p-6 sm:p-7 rounded-3xl bg-aurora-surface border border-aurora-border space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-aurora-border/60">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-aurora-secondary" />
            <h3 className="text-sm font-bold text-aurora-text uppercase tracking-wider">
              Decisions & Agreements ({analysis.decisions.length})
            </h3>
          </div>
        </div>

        <div className="space-y-3">
          {analysis.decisions.map((dec) => {
            const isConfirmed = dec.status === 'Confirmed';
            return (
              <div
                key={dec.id}
                className="p-4 rounded-2xl bg-aurora-input border border-aurora-border space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    isConfirmed 
                      ? 'bg-aurora-primary/15 text-aurora-primary border-aurora-primary/30' 
                      : 'bg-aurora-warning/15 text-aurora-warning border-aurora-warning/30'
                  }`}>
                    {dec.status}
                  </span>
                  <button
                    onClick={() => onViewSource(dec.sourceMessageId, dec.sourceExcerpt, dec.sourceSender)}
                    className="text-xs text-aurora-primary hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>View source</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>

                <p className="text-sm font-bold text-aurora-text">
                  {dec.decision}
                </p>

                <blockquote className="p-2.5 rounded-xl bg-aurora-surface text-xs font-mono text-aurora-muted italic border-l-2 border-aurora-primary">
                  "{dec.sourceExcerpt}"
                </blockquote>
              </div>
            );
          })}
        </div>
      </section>

      {/* F. DEADLINE TIMELINE & G. PERSONAL MENTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Deadlines */}
        <div className="p-6 rounded-3xl bg-aurora-surface border border-aurora-border space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-aurora-border/60">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-aurora-warning" />
              <h3 className="text-sm font-bold text-aurora-text uppercase tracking-wider">
                Upcoming Deadlines ({analysis.deadlines.length})
              </h3>
            </div>
            {analysis.deadlines.length > 0 && (
              <button
                onClick={handleExportIcs}
                className="text-xs font-semibold text-aurora-primary hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3 h-3" />
                <span>Export .ics</span>
              </button>
            )}
          </div>

          <div className="space-y-3">
            {analysis.deadlines.map((dl) => (
              <div key={dl.id} className="p-3.5 rounded-2xl bg-aurora-input border border-aurora-border">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-mono text-aurora-warning font-bold">{dl.dueDate}</span>
                  <span className="text-[10px] uppercase font-bold text-aurora-muted">{dl.urgency}</span>
                </div>
                <p className="text-xs font-medium text-aurora-text">{dl.title}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mentions */}
        <div className="p-6 rounded-3xl bg-aurora-surface border border-aurora-border space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-aurora-border/60">
            <div className="flex items-center gap-2">
              <AtSign className="w-4 h-4 text-aurora-secondary" />
              <h3 className="text-sm font-bold text-aurora-text uppercase tracking-wider">
                Direct Mentions ({analysis.mentions.length})
              </h3>
            </div>
          </div>

          <div className="space-y-3">
            {analysis.mentions.length === 0 ? (
              <div className="p-6 text-center text-xs text-aurora-muted">
                No direct inquiries addressed to your name were found.
              </div>
            ) : (
              analysis.mentions.map((m) => (
                <div key={m.id} className="p-3.5 rounded-2xl bg-aurora-input border border-aurora-secondary/30 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-aurora-secondary">From {m.sourceSender}</span>
                    <button
                      onClick={() => onViewSource(m.sourceMessageId, m.sourceExcerpt, m.sourceSender)}
                      className="text-[11px] text-aurora-muted hover:text-aurora-text cursor-pointer"
                    >
                      View source
                    </button>
                  </div>
                  <p className="text-xs text-aurora-text italic">"{m.sourceExcerpt}"</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Bottom Button to start new analysis */}
      <div className="text-center pt-4">
        <button
          onClick={onNewAnalysisClick}
          className="px-6 py-2.5 rounded-xl text-xs font-semibold text-aurora-text bg-aurora-elevated hover:bg-aurora-surface border border-aurora-border transition-colors cursor-pointer"
        >
          ← Analyze Another Conversation
        </button>
      </div>
    </div>
  );
};

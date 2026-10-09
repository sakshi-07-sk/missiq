import React, { useState } from 'react';
import { 
  CatchUpAnalysis,
  ActionItem,
  DecisionItem,
  PriorityItem,
  MentionItem,
  DeadlineItem
} from '../types';
import { AnalyticsCharts } from './AnalyticsCharts';
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
  Printer,
  BellRing
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { generateMarkdownReport, generateIcsCalendar, downloadTextFile } from '../services/exportService';

interface DashboardProps {
  analysis: CatchUpAnalysis;
  userName: string;
  summaryLength: 'short' | 'detailed';
  setSummaryLength: (val: 'short' | 'detailed') => void;
  onToggleCompleteAction: (id: string) => void;
  onViewSource: (messageId: string, excerpt: string, sender: string) => void;
  onJumpToWorkspace: () => void;
}

type TabFilter = 'all' | 'actions' | 'decisions' | 'priorities' | 'deadlines' | 'mentions';

export const Dashboard: React.FC<DashboardProps> = ({
  analysis,
  userName,
  summaryLength,
  setSummaryLength,
  onToggleCompleteAction,
  onViewSource,
  onJumpToWorkspace,
}) => {
  const [activeTab, setActiveTab] = useState<TabFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'High' | 'Medium' | 'Low'>('all');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copied, setCopied] = useState(false);

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

    const textToSpeak = `${analysis.summary.executiveOverview}. Top highlights: ${analysis.summary.keyThemes.join('. ')}. ${
      analysis.summary.immediateAttentionItems.length > 0 
        ? `Immediate items needing attention: ${analysis.summary.immediateAttentionItems.join('. ')}` 
        : ''
    }`;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 1.05;
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
  };

  const handleCopySummary = () => {
    const text = `MissIQ Catch-Up Summary:\n${analysis.summary.executiveOverview}\n\nTop Themes:\n${analysis.summary.keyThemes.map(t => `- ${t}`).join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportMarkdown = () => {
    const md = generateMarkdownReport(analysis);
    downloadTextFile('missiq-catchup-briefing.md', md, 'text/markdown');
  };

  const handleExportTxt = () => {
    const md = generateMarkdownReport(analysis);
    downloadTextFile('missiq-catchup-briefing.txt', md, 'text/plain');
  };

  const handleExportIcs = () => {
    const ics = generateIcsCalendar(analysis);
    downloadTextFile('missiq-deadlines.ics', ics, 'text/calendar');
  };

  const handleToggleTask = (id: string, currentlyCompleted?: boolean) => {
    onToggleCompleteAction(id);
    if (!currentlyCompleted) {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#14b8a6', '#5eead4', '#f59e0b']
      });
    }
  };

  // Filter actions
  const filteredActions = analysis.actionItems.filter(item => {
    const matchesSearch = !searchQuery || item.task.toLowerCase().includes(searchQuery.toLowerCase()) || item.owner.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = priorityFilter === 'all' || item.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  // Filter decisions
  const filteredDecisions = analysis.decisions.filter(dec => {
    return !searchQuery || dec.decision.toLowerCase().includes(searchQuery.toLowerCase()) || dec.sourceSender.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Filter priorities
  const filteredPriorities = analysis.priorities.filter(p => {
    const matchesSearch = !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = priorityFilter === 'all' || p.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  // Filter deadlines
  const filteredDeadlines = analysis.deadlines.filter(d => {
    return !searchQuery || d.title.toLowerCase().includes(searchQuery.toLowerCase()) || d.dueDate.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Filter mentions
  const filteredMentions = analysis.mentions.filter(m => {
    return !searchQuery || m.context.toLowerCase().includes(searchQuery.toLowerCase()) || m.sourceSender.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* 1. Executive Catch-Up Overview Card */}
      <section className="p-6 rounded-3xl bg-navy-900/80 border border-navy-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-navy-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-teal-500/15 text-teal-400 border border-teal-500/25">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                MissIQ Catch-Up Executive Brief
              </h3>
              <p className="text-xs text-slate-400">
                Grounded answers to “What did I miss, and what do I need to do next?”
              </p>
            </div>
          </div>

          {/* Action Tools */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Short vs Detailed Toggle */}
            <div className="flex items-center bg-navy-950 p-1 rounded-xl border border-navy-800 text-xs">
              <button
                onClick={() => setSummaryLength('short')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  summaryLength === 'short' ? 'bg-teal-500/20 text-teal-300 font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Short TL;DR
              </button>
              <button
                onClick={() => setSummaryLength('detailed')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  summaryLength === 'detailed' ? 'bg-teal-500/20 text-teal-300 font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Detailed
              </button>
            </div>

            {/* Audio narration */}
            <button
              onClick={handleAudioNarration}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                isPlayingAudio
                  ? 'bg-teal-500 text-navy-950 border-teal-400 font-semibold shadow-lg shadow-teal-500/20 animate-pulse'
                  : 'bg-navy-950 text-slate-300 border-navy-800 hover:text-white hover:border-navy-700'
              }`}
              title="Narrate brief via text-to-speech"
            >
              {isPlayingAudio ? (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>Stop Voice</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-teal-400" />
                  <span>Audio Brief</span>
                </>
              )}
            </button>

            {/* Copy button */}
            <button
              onClick={handleCopySummary}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-navy-950 text-slate-300 border border-navy-800 hover:text-white transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-teal-400" />
                  <span className="text-teal-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>

            {/* Export Dropdown / Buttons */}
            <button
              onClick={handleExportMarkdown}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-teal-500/15 text-teal-300 border border-teal-500/30 hover:bg-teal-500/25 transition-colors"
              title="Download as Markdown"
            >
              <FileDown className="w-3.5 h-3.5 text-teal-400" />
              <span>Export .MD</span>
            </button>

            <button
              onClick={handleExportTxt}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium bg-navy-950 text-slate-300 border border-navy-800 hover:text-white transition-colors"
              title="Download plain text report"
            >
              <Download className="w-3.5 h-3.5" />
              <span>.TXT</span>
            </button>
          </div>
        </div>

        {/* Summary Text Paragraph */}
        <div className="mt-4 p-4 rounded-2xl bg-navy-950/70 border border-navy-800/80">
          <p className="text-sm text-slate-200 leading-relaxed">
            {analysis.summary.executiveOverview}
          </p>
        </div>

        {/* Immediate attention banner */}
        {analysis.summary.immediateAttentionItems.length > 0 && (
          <div className="mt-4 p-3.5 rounded-2xl bg-rose-950/20 border border-rose-500/25">
            <div className="flex items-center gap-2 mb-2 text-rose-300">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider">
                Needs Immediate Attention ({analysis.summary.immediateAttentionItems.length})
              </h4>
            </div>
            <ul className="space-y-1">
              {analysis.summary.immediateAttentionItems.map((item, idx) => (
                <li key={idx} className="text-xs text-rose-200 flex items-start gap-2">
                  <span className="text-rose-400 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Key Themes & Open Risks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
          <div className="p-3.5 rounded-2xl bg-navy-950/50 border border-navy-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-300 mb-2">
              Key Discussion Highlights
            </h4>
            <ul className="space-y-1">
              {analysis.summary.keyThemes.slice(0, 4).map((theme, i) => (
                <li key={i} className="text-xs text-slate-300 flex items-start gap-1.5">
                  <span className="text-teal-400 font-bold">•</span>
                  <span>{theme}</span>
                </li>
              ))}
            </ul>
          </div>

          {analysis.summary.openQuestionsOrRisks.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/25">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-2">
                Pending Questions & Risks
              </h4>
              <ul className="space-y-1">
                {analysis.summary.openQuestionsOrRisks.slice(0, 3).map((risk, i) => (
                  <li key={i} className="text-xs text-amber-200 flex items-start gap-1.5">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{risk}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* 2. Visual Metrics & Charts */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Analytics & Triage Breakdown
          </h3>
          <span className="text-xs text-teal-400 font-medium">
            Saved ~{analysis.summary.readingTimeSavedMinutes} mins of reading
          </span>
        </div>
        <AnalyticsCharts analysis={analysis} />
      </section>

      {/* 3. Navigation Filter Tabs & Search Bar */}
      <section className="p-2 rounded-2xl bg-navy-900/80 border border-navy-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Tabs */}
          <div className="flex flex-wrap items-center gap-1">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'all'
                  ? 'bg-teal-500 text-navy-950 font-bold shadow-md shadow-teal-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Sections
            </button>

            <button
              onClick={() => setActiveTab('actions')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'actions'
                  ? 'bg-teal-500 text-navy-950 font-bold shadow-md shadow-teal-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Action Items ({analysis.actionItems.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('decisions')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'decisions'
                  ? 'bg-teal-500 text-navy-950 font-bold shadow-md shadow-teal-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Decisions ({analysis.decisions.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('priorities')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'priorities'
                  ? 'bg-teal-500 text-navy-950 font-bold shadow-md shadow-teal-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Priorities ({analysis.priorities.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('deadlines')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'deadlines'
                  ? 'bg-teal-500 text-navy-950 font-bold shadow-md shadow-teal-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Deadlines ({analysis.deadlines.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('mentions')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'mentions'
                  ? 'bg-teal-500 text-navy-950 font-bold shadow-md shadow-teal-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <AtSign className="w-3.5 h-3.5" />
              <span>Mentions ({analysis.mentions.length})</span>
            </button>
          </div>

          {/* Search & Priority Filter */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 md:w-52">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search extracted results..."
                className="w-full pl-8 pr-3 py-1 text-xs bg-navy-950 border border-navy-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500"
              />
            </div>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as any)}
              className="px-2.5 py-1 text-xs bg-navy-950 border border-navy-800 rounded-xl text-slate-300 focus:outline-none focus:border-teal-500"
            >
              <option value="all">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
      </section>

      {/* 4. Section Grid Rendering */}
      <div className="space-y-6">
        {/* ACTION ITEMS SECTION */}
        {(activeTab === 'all' || activeTab === 'actions') && (
          <div className="p-5 rounded-2xl bg-navy-900/60 border border-navy-800">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-navy-800">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-teal-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Action Items & Task Checklist ({filteredActions.length})
                </h3>
              </div>
              <span className="text-xs text-slate-400">
                {filteredActions.filter(a => a.completed).length} completed
              </span>
            </div>

            {filteredActions.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                No action items match the active filter.
              </div>
            ) : (
              <div className="space-y-3">
                {filteredActions.map((task) => {
                  const isDone = !!task.completed;
                  return (
                    <div
                      key={task.id}
                      className={`p-3.5 rounded-xl border transition-all ${
                        isDone
                          ? 'bg-navy-950/40 border-navy-800 opacity-60'
                          : 'bg-navy-950/70 border-navy-800 hover:border-navy-700'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          type="button"
                          onClick={() => handleToggleTask(task.id, isDone)}
                          className="mt-0.5 text-slate-400 hover:text-teal-400 transition-colors focus:outline-none"
                        >
                          {isDone ? (
                            <CheckCircle2 className="w-5 h-5 text-teal-400" />
                          ) : (
                            <Circle className="w-5 h-5" />
                          )}
                        </button>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                            <div className="flex items-center gap-2">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                task.priority === 'High' ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' :
                                task.priority === 'Medium' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                                'bg-teal-500/20 text-teal-300 border-teal-500/30'
                              }`}>
                                {task.priority}
                              </span>
                              <span className="text-xs text-slate-400 flex items-center gap-1">
                                <User className="w-3 h-3 text-slate-500" />
                                Owner: <strong className={task.owner === 'Not specified' ? 'text-slate-500 font-normal italic' : 'text-slate-200'}>{task.owner}</strong>
                              </span>
                            </div>

                            <span className="text-xs text-slate-400 flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-slate-500" />
                              Due: <strong className={task.dueDate === 'Not specified' ? 'text-slate-500 font-normal italic' : 'text-teal-300'}>{task.dueDate}</strong>
                            </span>
                          </div>

                          <p className={`text-sm font-medium ${isDone ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                            {task.task}
                          </p>

                          <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-400 bg-navy-900/60 px-2 py-1 rounded-lg border border-navy-800">
                            <Info className="w-3 h-3 text-teal-400 flex-shrink-0" />
                            <span><strong>Reason:</strong> {task.priorityReason}</span>
                          </div>

                          <div className="mt-2 flex items-center justify-between pt-1 text-[11px]">
                            <span className="text-slate-500">Source: {task.sourceSender}</span>
                            <button
                              type="button"
                              onClick={() => onViewSource(task.sourceMessageId, task.sourceExcerpt, task.sourceSender)}
                              className="text-teal-400 hover:text-teal-300 flex items-center gap-1 font-medium"
                            >
                              <span>Inspect Source Message</span>
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* DECISIONS SECTION */}
        {(activeTab === 'all' || activeTab === 'decisions') && (
          <div className="p-5 rounded-2xl bg-navy-900/60 border border-navy-800">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-navy-800">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Decisions Made & Plan Changes ({filteredDecisions.length})
                </h3>
              </div>
            </div>

            {filteredDecisions.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                No explicit decisions detected in this discussion.
              </div>
            ) : (
              <div className="space-y-3">
                {filteredDecisions.map((dec) => (
                  <div
                    key={dec.id}
                    className="p-3.5 rounded-xl bg-navy-950/70 border border-navy-800"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        dec.status === 'Confirmed'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      }`}>
                        {dec.status}
                      </span>
                      <button
                        type="button"
                        onClick={() => onViewSource(dec.sourceMessageId, dec.sourceExcerpt, dec.sourceSender)}
                        className="text-teal-400 hover:text-teal-300 text-xs flex items-center gap-1"
                      >
                        <span>Evidence</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>

                    <p className="text-sm font-bold text-white">
                      {dec.decision}
                    </p>

                    <blockquote className="mt-2 p-2 rounded-lg bg-navy-900/60 border border-navy-800 text-xs font-mono text-slate-300 italic">
                      "{dec.sourceExcerpt}"
                    </blockquote>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TOP PRIORITIES SECTION */}
        {(activeTab === 'all' || activeTab === 'priorities') && (
          <div className="p-5 rounded-2xl bg-navy-900/60 border border-navy-800">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-navy-800">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Top Priority Intelligence ({filteredPriorities.length})
                </h3>
              </div>
            </div>

            {filteredPriorities.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                No priority items match the filter.
              </div>
            ) : (
              <div className="space-y-3">
                {filteredPriorities.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3.5 rounded-xl border ${
                      item.priority === 'High' ? 'bg-rose-950/15 border-rose-500/25' :
                      item.priority === 'Medium' ? 'bg-amber-950/15 border-amber-500/25' :
                      'bg-navy-950/70 border-navy-800'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          item.priority === 'High' ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' :
                          item.priority === 'Medium' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                          'bg-teal-500/20 text-teal-300 border-teal-500/30'
                        }`}>
                          {item.priority} Priority
                        </span>
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-navy-800 text-slate-300">
                          {item.category}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => onViewSource(item.sourceMessageId, item.sourceExcerpt, item.sourceSender)}
                        className="text-teal-400 hover:text-teal-300 text-xs flex items-center gap-1"
                      >
                        <span>Evidence</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>

                    <p className="text-sm font-medium text-slate-100">
                      {item.description}
                    </p>

                    <div className="mt-2 text-xs text-slate-400 bg-navy-900/60 p-2 rounded-lg border border-navy-800">
                      <strong className="text-teal-300">Why {item.priority}:</strong> {item.reason}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* DEADLINES & EVENTS SECTION */}
        {(activeTab === 'all' || activeTab === 'deadlines') && (
          <div className="p-5 rounded-2xl bg-navy-900/60 border border-navy-800">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-navy-800">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Deadlines & Scheduled Events ({filteredDeadlines.length})
                </h3>
              </div>

              {filteredDeadlines.length > 0 && (
                <button
                  onClick={handleExportIcs}
                  className="flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/25 transition-colors"
                  title="Download .ics file to sync with calendar"
                >
                  <Download className="w-3 h-3" />
                  <span>Sync to Calendar (.ics)</span>
                </button>
              )}
            </div>

            {filteredDeadlines.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                No explicit dates or deadlines identified.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredDeadlines.map((d) => (
                  <div
                    key={d.id}
                    className="p-3.5 rounded-xl bg-navy-950/70 border border-navy-800 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          d.urgency === 'Today' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                          d.urgency === 'Overdue' ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' :
                          'bg-teal-500/20 text-teal-300 border-teal-500/30'
                        }`}>
                          {d.urgency}
                        </span>
                        <span className="text-xs font-mono text-teal-300 font-semibold">
                          {d.dueDate}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-slate-200">
                        {d.title}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-navy-800 flex items-center justify-between text-xs text-slate-400">
                      <span>Owner: <strong className="text-slate-200">{d.owner}</strong></span>
                      <button
                        type="button"
                        onClick={() => onViewSource(d.sourceMessageId, d.sourceExcerpt, d.sourceSender)}
                        className="text-teal-400 hover:text-teal-300 text-[11px] flex items-center gap-1"
                      >
                        <span>Source</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* DIRECT MENTIONS SECTION */}
        {(activeTab === 'all' || activeTab === 'mentions') && (
          <div className="p-5 rounded-2xl bg-navy-900/60 border border-navy-800">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-navy-800">
              <div className="flex items-center gap-2">
                <AtSign className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Direct Mentions & User Alerts ({filteredMentions.length})
                </h3>
              </div>
            </div>

            {filteredMentions.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                {userName ? (
                  <p>No messages explicitly addressed or assigned to <strong className="text-slate-200">"{userName}"</strong>.</p>
                ) : (
                  <p>Provide your name or handle in Workspace to isolate messages addressed to you.</p>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredMentions.map((m) => (
                  <div
                    key={m.id}
                    className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/30"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        <BellRing className="w-3 h-3 text-cyan-400" />
                        <span>{m.isActionable ? 'Inquiry / Action Required' : 'Mention'}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => onViewSource(m.sourceMessageId, m.sourceExcerpt, m.sourceSender)}
                        className="text-teal-400 hover:text-teal-300 text-xs flex items-center gap-1"
                      >
                        <span>Context</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>

                    <p className="text-xs sm:text-sm font-semibold text-slate-100">
                      "{m.sourceExcerpt}"
                    </p>

                    <div className="mt-2 text-[11px] text-slate-400">
                      From: <strong className="text-white">{m.sourceSender}</strong>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Back to Workspace button */}
      <div className="pt-4 flex justify-center">
        <button
          onClick={onJumpToWorkspace}
          className="text-xs font-semibold text-teal-400 hover:text-teal-300 flex items-center gap-1"
        >
          <span>← Modify Transcript or Test Another Conversation</span>
        </button>
      </div>
    </div>
  );
};

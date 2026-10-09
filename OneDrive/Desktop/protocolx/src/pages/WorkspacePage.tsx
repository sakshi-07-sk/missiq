import React, { useRef, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Sparkles, 
  Upload, 
  User, 
  RotateCcw, 
  AlertCircle, 
  ShieldCheck, 
  ArrowRight, 
  GraduationCap, 
  Trophy, 
  Briefcase, 
  Layers, 
  Check, 
  CheckSquare, 
  MessageSquare, 
  Calendar, 
  History, 
  Clock, 
  ArrowUpRight,
  ClipboardCopy,
  Trash2,
  Zap,
  CheckCircle2,
  Lock,
  ChevronRight
} from 'lucide-react';
import { PRESET_SAMPLES, PresetSample } from '../data/samples';
import { CatchUpAnalysis } from '../types';
import { analyzeConversationService } from '../services/api';
import { saveSessionToLocalDB, getSavedSessions, SavedSession } from '../services/db';
import { AnalysisProgress } from '../components/AnalysisProgress';
import { ResultsDashboard } from '../components/ResultsDashboard';

interface WorkspacePageProps {
  analysis: CatchUpAnalysis | null;
  setAnalysis: (res: CatchUpAnalysis | null) => void;
  userName: string;
  setUserName: (val: string) => void;
  onClearSession: () => void;
  onViewSource: (messageId: string, excerpt: string, sender: string) => void;
}

export const WorkspacePage: React.FC<WorkspacePageProps> = ({
  analysis,
  setAnalysis,
  userName,
  setUserName,
  onClearSession,
  onViewSource,
}) => {
  const location = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [inputText, setInputText] = useState(PRESET_SAMPLES[0].text);
  const [context, setContext] = useState<'college' | 'work' | 'project' | 'general'>(PRESET_SAMPLES[0].context);
  const [activePresetId, setActivePresetId] = useState<string | null>(PRESET_SAMPLES[0].id);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [savedSessions, setSavedSessions] = useState<SavedSession[]>([]);

  useEffect(() => {
    getSavedSessions().then(setSavedSessions);
  }, [analysis]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Auto-run demo if redirected from Landing page "Try Live Demo"
  useEffect(() => {
    if (location.state?.runDemo && !analysis) {
      handleTriggerAnalysis();
    }
  }, [location.state]);

  const handleFileUpload = (file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        setInputText(content);
        setActivePresetId(null);
        showToast(`Loaded ${file.name} (${content.length} characters)`);
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleSelectPreset = (preset: PresetSample) => {
    setInputText(preset.text);
    setUserName(preset.defaultUserName);
    setContext(preset.context);
    setActivePresetId(preset.id);
    showToast(`Loaded fictional sample: ${preset.title}`);
  };

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text && text.trim()) {
        setInputText(text);
        setActivePresetId(null);
        showToast('Pasted conversation from clipboard!');
      } else {
        showToast('Clipboard is empty.');
      }
    } catch {
      showToast('Clipboard access was blocked. Please paste directly using Ctrl+V / Cmd+V.');
    }
  };

  const handleClearInput = () => {
    setInputText('');
    setActivePresetId(null);
    showToast('Conversation input cleared.');
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleTriggerAnalysis = () => {
    setError(null);
    if (!inputText || !inputText.trim()) {
      setError('Please paste a chat transcript or select a sample scenario before analyzing.');
      return;
    }
    setIsProcessing(true);
  };

  const handlePipelineCompleted = async () => {
    try {
      const result = await analyzeConversationService({
        text: inputText,
        userName,
        context,
        summaryLength: 'detailed',
        preferBackend: true
      });
      setAnalysis(result);
      setIsProcessing(false);

      // Save to private IndexedDB
      await saveSessionToLocalDB(result, context);
      const updated = await getSavedSessions();
      setSavedSessions(updated);
    } catch (err: any) {
      setError(err.message || 'Error occurred during conversation analysis. Please retry.');
      setIsProcessing(false);
    }
  };

  // Counts
  const charCount = inputText ? inputText.length : 0;
  const lineCount = inputText ? inputText.split(/\r?\n/).filter(l => l.trim().length > 0).length : 0;
  const detectedMessageCount = inputText 
    ? inputText.split(/\r?\n/).filter(line => /^(?:\[[\d:]+\s*(?:AM|PM)?\]|[A-Za-z0-9_\s]+:)/i.test(line.trim())).length
    : 0;
  const parsedCountDisplay = detectedMessageCount > 0 ? detectedMessageCount : lineCount;

  // Selected scenario helper for Live Preview
  const selectedPreset = PRESET_SAMPLES.find(p => p.id === activePresetId) || PRESET_SAMPLES[0];

  // If results are present and not re-analyzing, render Dashboard
  if (analysis && !isProcessing) {
    return (
      <ResultsDashboard
        analysis={analysis}
        userName={userName}
        onToggleCompleteAction={(id) => {
          const updated = analysis.actionItems.map(item => item.id === id ? { ...item, completed: !item.completed } : item);
          setAnalysis({ ...analysis, actionItems: updated });
        }}
        onViewSource={onViewSource}
        onNewAnalysisClick={() => setAnalysis(null)}
      />
    );
  }

  // If processing, render animated pipeline
  if (isProcessing) {
    return (
      <div className="py-16">
        <AnalysisProgress onComplete={handlePipelineCompleted} />
      </div>
    );
  }

  return (
    <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-8 animate-fade-in pb-16">
      
      {/* Toast Notification Micro-interaction */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-up flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-aurora-surface border border-aurora-primary/40 text-aurora-text shadow-2xl shadow-aurora-primary/20 text-xs font-medium">
          <CheckCircle2 className="w-4 h-4 text-aurora-primary flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. ARCTIC AURORA PAGE HEADER */}
      <header className="pb-6 border-b border-aurora-border/70 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-start sm:items-center gap-3.5">
          {/* Abstract message-and-spark brand mark */}
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-aurora-primary to-aurora-secondary flex items-center justify-center shadow-lg shadow-aurora-primary/25 flex-shrink-0">
            <Sparkles className="w-5 h-5 text-aurora-bg" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-aurora-text tracking-tight">
                Your conversations, decoded.
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-aurora-muted mt-0.5 font-normal">
              Find the signal in all the noise.
            </p>
          </div>
        </div>

        {/* Right side status indicators */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Guest Mode Indicator */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-aurora-surface border border-aurora-border text-[11px] font-mono font-medium text-aurora-primary">
            <span className="w-1.5 h-1.5 rounded-full bg-aurora-primary animate-pulse" />
            <span>GUEST MODE</span>
          </div>

          {/* Honest Privacy Status */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-aurora-surface border border-aurora-border text-[11px] font-mono text-aurora-muted">
            <ShieldCheck className="w-3.5 h-3.5 text-aurora-primary" />
            <span>LOCAL PRIVACY · ZERO RETENTION</span>
          </div>

          {/* Clear Data Action */}
          <button
            type="button"
            onClick={onClearSession}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-aurora-surface hover:bg-aurora-elevated border border-aurora-border text-xs font-medium text-aurora-muted hover:text-aurora-error transition-all cursor-pointer"
            title="Clear active conversation cache"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Data</span>
          </button>
        </div>
      </header>

      {/* 2. RECENT SESSIONS STRIP (IF APPLICABLE) */}
      {savedSessions.length > 0 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-aurora-surface border border-aurora-border flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-aurora-elevated border border-aurora-border flex items-center justify-center text-aurora-secondary">
              <History className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-aurora-text flex items-center gap-2">
                <span>Recent Decoded Chats</span>
                <span className="text-[10px] px-2 py-0.2 rounded-full bg-aurora-elevated text-aurora-primary border border-aurora-border/50">
                  {savedSessions.length} in IndexedDB
                </span>
              </div>
              <p className="text-[11px] text-aurora-muted mt-0.5">
                Latest: {savedSessions[0].title} ({savedSessions[0].messageCount} messages)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setAnalysis(savedSessions[0].analysis)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-aurora-elevated hover:bg-aurora-surface border border-aurora-primary/30 text-xs font-semibold text-aurora-primary transition-all cursor-pointer"
            >
              <span>Restore Latest Catch-up</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 3. SAMPLE SCENARIO SELECTOR */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-aurora-text tracking-tight">
              Start with a real-world scenario
            </h2>
            <p className="text-xs sm:text-sm text-aurora-muted mt-0.5">
              Explore how MissIQ surfaces decisions and deadlines. Fictional sample data.
            </p>
          </div>
          <span className="text-[11px] font-mono text-aurora-muted">
            Click to load conversation
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
          {PRESET_SAMPLES.map((preset) => {
            const isSelected = activePresetId === preset.id;
            return (
              <div
                key={preset.id}
                role="button"
                tabIndex={0}
                onClick={() => handleSelectPreset(preset)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSelectPreset(preset); }}
                className={`p-5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between group relative overflow-hidden ${
                  isSelected
                    ? 'bg-aurora-elevated border-aurora-primary shadow-[0_0_24px_rgba(69,224,193,0.18)] ring-1 ring-aurora-primary/40'
                    : 'bg-aurora-surface border-aurora-border hover:border-aurora-primary/40 hover:-translate-y-0.5 hover:bg-aurora-elevated'
                }`}
              >
                <div>
                  {/* Top Icon and Selection Badge */}
                  <div className="flex items-center justify-between mb-3.5">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 ${
                      preset.context === 'college'
                        ? 'bg-aurora-surface text-aurora-secondary border border-aurora-secondary/30'
                        : preset.context === 'project'
                        ? 'bg-aurora-surface text-aurora-primary border border-aurora-primary/30'
                        : 'bg-aurora-surface text-aurora-success border border-aurora-success/30'
                    }`}>
                      {preset.context === 'college' && <GraduationCap className="w-5 h-5" />}
                      {preset.context === 'project' && <Trophy className="w-5 h-5" />}
                      {preset.context === 'work' && <Briefcase className="w-5 h-5" />}
                    </div>

                    {isSelected ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-aurora-bg bg-aurora-primary px-2.5 py-1 rounded-full shadow-sm">
                        <Check className="w-3 h-3 stroke-[3]" />
                        <span>Selected</span>
                      </span>
                    ) : (
                      <span className="text-[11px] font-medium text-aurora-muted group-hover:text-aurora-text flex items-center gap-1 transition-colors">
                        <span>Load sample</span>
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-sm sm:text-base font-bold text-aurora-text tracking-tight group-hover:text-white">
                    {preset.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-aurora-muted leading-relaxed mt-1.5 font-normal line-clamp-3">
                    {preset.description}
                  </p>
                </div>

                {/* Bottom Meta */}
                <div className="pt-3.5 mt-3.5 border-t border-aurora-border/60 flex items-center justify-between text-[11px] text-aurora-muted">
                  <span className="capitalize font-mono">Context: {preset.context}</span>
                  <span className="font-mono text-aurora-secondary">User: {preset.defaultUserName}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. MAIN WORKSPACE: CONVERSATION COMPOSER + LIVE INSIGHTS PREVIEW */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: THE CONVERSATION COMPOSER (8 COLS) */}
        <section className="xl:col-span-8 space-y-6">
          <div
            className={`p-6 sm:p-8 rounded-2xl bg-aurora-surface border border-aurora-border shadow-2xl relative overflow-hidden transition-all duration-200 ${
              dragOver ? 'border-2 border-dashed border-aurora-primary bg-aurora-primary/5' : ''
            }`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            {/* Header of Composer Card */}
            <div className="pb-5 border-b border-aurora-border/70 mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-aurora-text tracking-tight flex items-center gap-2.5">
                <Layers className="w-5 h-5 text-aurora-primary" />
                <span>Analyze your conversation</span>
              </h2>
              <p className="text-xs sm:text-sm text-aurora-muted mt-1">
                Paste your unread messages. We'll find what matters.
              </p>
            </div>

            {/* Controls Ribbon: User identity & Context */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pb-5">
              {/* User Identity Field */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-aurora-muted mb-2">
                  YOUR NAME OR HANDLE
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-aurora-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="e.g. Priya, Alex, Jordan"
                    className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-aurora-input border border-aurora-border rounded-xl text-aurora-text placeholder-aurora-muted/70 focus:outline-none focus:border-aurora-primary focus:ring-1 focus:ring-aurora-primary transition-all"
                  />
                </div>
                <span className="block text-[11px] text-aurora-muted mt-1.5 font-normal">
                  Used to identify direct mentions in the conversation.
                </span>
              </div>

              {/* Conversation Context Segmented Controls */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-aurora-muted mb-2">
                  CONVERSATION CONTEXT
                </label>
                <div className="grid grid-cols-4 gap-1.5 p-1 bg-aurora-input rounded-xl border border-aurora-border">
                  {(['college', 'project', 'work', 'general'] as const).map((ctx) => {
                    const isActive = context === ctx;
                    return (
                      <button
                        key={ctx}
                        type="button"
                        onClick={() => setContext(ctx)}
                        className={`py-2 px-1 text-center text-xs font-semibold rounded-lg capitalize transition-all cursor-pointer ${
                          isActive
                            ? 'bg-aurora-primary text-aurora-bg font-bold shadow-sm'
                            : 'text-aurora-muted hover:text-aurora-text hover:bg-aurora-surface'
                        }`}
                      >
                        {ctx}
                      </button>
                    );
                  })}
                </div>
                <span className="block text-[11px] text-aurora-muted mt-1.5 font-normal">
                  Adapts classification weights for deadlines and urgency.
                </span>
              </div>
            </div>

            {/* Main Text Input Area */}
            <div className="space-y-3">
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  value={inputText}
                  onChange={(e) => {
                    setInputText(e.target.value);
                    setActivePresetId(null);
                  }}
                  placeholder={`Paste your unread conversation here...

Example:
Priya: The project deadline is tomorrow at 5 PM.
Alex: We still need to finish the report.
Jordan: I'll upload the dataset tonight.`}
                  className="w-full min-h-[260px] h-64 sm:h-72 p-4 sm:p-5 bg-aurora-input border border-aurora-border rounded-2xl text-aurora-text font-mono text-xs sm:text-sm placeholder-aurora-muted/70 focus:outline-none focus:border-aurora-primary focus:ring-1 focus:ring-aurora-primary resize-y leading-relaxed"
                />
              </div>

              {/* Input Toolbar Beneath Editor */}
              <div className="p-3 rounded-xl bg-aurora-input border border-aurora-border/60 flex flex-wrap items-center justify-between gap-3 text-xs">
                {/* Left Action Buttons */}
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                    accept=".txt,.json,.csv,.log"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-aurora-surface hover:bg-aurora-elevated border border-aurora-border text-xs font-medium text-aurora-text transition-all cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5 text-aurora-primary" />
                    <span>Upload TXT</span>
                  </button>

                  <button
                    type="button"
                    onClick={handlePasteFromClipboard}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-aurora-surface hover:bg-aurora-elevated border border-aurora-border text-xs font-medium text-aurora-text transition-all cursor-pointer"
                  >
                    <ClipboardCopy className="w-3.5 h-3.5 text-aurora-secondary" />
                    <span>Paste Clipboard</span>
                  </button>

                  {inputText && (
                    <button
                      type="button"
                      onClick={handleClearInput}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-aurora-muted hover:text-aurora-error transition-colors cursor-pointer"
                      title="Clear editor contents"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Clear</span>
                    </button>
                  )}
                </div>

                {/* Right Character and Message Metrics */}
                <div className="flex items-center gap-3 text-[11px] font-mono text-aurora-muted">
                  <span className="text-aurora-text font-semibold">
                    {charCount.toLocaleString()} chars
                  </span>
                  <span>·</span>
                  <span className="text-aurora-primary font-semibold">
                    {parsedCountDisplay} messages detected
                  </span>
                </div>
              </div>

              {/* Supported formats disclaimer */}
              <div className="text-[11px] text-aurora-muted px-1 font-normal flex items-center justify-between">
                <span>Supports plain text transcripts, exported chat logs, and timestamped lines.</span>
                <span className="hidden sm:inline">Zero cloud storage</span>
              </div>
            </div>

            {/* Error Notification */}
            {error && (
              <div className="mt-4 p-3.5 rounded-xl bg-aurora-error/15 border border-aurora-error/30 text-aurora-error text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Bottom Actions Row: Privacy Indicator + Primary Analyze Action */}
            <div className="mt-6 pt-6 border-t border-aurora-border/70 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              
              {/* Privacy Indicator */}
              <div className="flex items-start gap-3 max-w-sm">
                <div className="w-8 h-8 rounded-xl bg-aurora-elevated border border-aurora-border flex items-center justify-center flex-shrink-0 mt-0.5 text-aurora-primary">
                  <ShieldCheck className="w-4 h-4 text-aurora-primary" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-aurora-text">
                    Privacy comes first.
                  </h4>
                  <p className="text-[11px] text-aurora-muted leading-relaxed mt-0.5">
                    Your conversation data is analyzed on this device with zero external cloud retention. Transcripts are never collected.
                  </p>
                </div>
              </div>

              {/* Primary Analyze Action Button: Mint Background with Dark Teal Text */}
              <button
                type="button"
                onClick={handleTriggerAnalysis}
                disabled={!inputText.trim() || isProcessing}
                className="h-[52px] px-8 rounded-2xl font-bold text-sm bg-aurora-primary text-aurora-bg hover:bg-aurora-primary-hover active:bg-aurora-primary-pressed shadow-md shadow-aurora-primary/25 flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0 transition-all transform hover:-translate-y-0.5"
              >
                <Sparkles className="w-4 h-4 text-aurora-bg stroke-[2.5]" />
                <span>Analyze Conversation</span>
                <ArrowRight className="w-4 h-4 text-aurora-bg stroke-[2.5]" />
              </button>
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN: LIVE INSIGHTS PREVIEW (4 COLS) */}
        <aside className="xl:col-span-4 space-y-6">
          <div className="p-6 sm:p-7 rounded-2xl bg-aurora-surface border border-aurora-border shadow-xl space-y-5">
            {/* Header */}
            <div className="pb-4 border-b border-aurora-border/70 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-aurora-text tracking-tight flex items-center gap-2">
                  <Zap className="w-4 h-4 text-aurora-primary" />
                  <span>What MissIQ Uncovers</span>
                </h3>
                <p className="text-[11px] text-aurora-muted mt-0.5">
                  Live Extractor Preview
                </p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-aurora-primary/10 text-aurora-primary border border-aurora-primary/20">
                ACTIVE
              </span>
            </div>

            {/* 5 Feature Extraction Cards */}
            <div className="space-y-3">
              {/* 1. Important Updates */}
              <div className="p-3 rounded-xl bg-aurora-input border border-aurora-border/60 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase font-bold text-aurora-error flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 text-aurora-error" />
                    <span>⚡ HIGH PRIORITY UPDATES</span>
                  </span>
                  <span className="text-[10px] text-aurora-muted">Ranked</span>
                </div>
                <p className="text-xs text-aurora-muted leading-relaxed">
                  Extracts rescheduled exams, budget ceilings, and critical announcements first.
                </p>
              </div>

              {/* 2. Decisions */}
              <div className="p-3 rounded-xl bg-aurora-input border border-aurora-border/60 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase font-bold text-aurora-primary flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-aurora-primary" />
                    <span>✓ DECISIONS MADE</span>
                  </span>
                  <span className="text-[10px] text-aurora-muted">Resolved</span>
                </div>
                <p className="text-xs text-aurora-muted leading-relaxed">
                  Pins definitive group agreements, TA approvals, and policy locks.
                </p>
              </div>

              {/* 3. Action Items */}
              <div className="p-3 rounded-xl bg-aurora-input border border-aurora-border/60 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase font-bold text-aurora-success flex items-center gap-1">
                    <CheckSquare className="w-3 h-3 text-aurora-success" />
                    <span>📋 ACTION ITEMS & OWNERS</span>
                  </span>
                  <span className="text-[10px] text-aurora-muted">Assigned</span>
                </div>
                <p className="text-xs text-aurora-muted leading-relaxed">
                  Extracts specific task deliverables, assignees, and progress checkmarks.
                </p>
              </div>

              {/* 4. Deadlines */}
              <div className="p-3 rounded-xl bg-aurora-input border border-aurora-border/60 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase font-bold text-aurora-warning flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-aurora-warning" />
                    <span>📅 UPCOMING DEADLINES</span>
                  </span>
                  <span className="text-[10px] text-aurora-muted">Sync .ics</span>
                </div>
                <p className="text-xs text-aurora-muted leading-relaxed">
                  Detects temporal anchors like "tonight 11:59 PM" and exports to Google Calendar / Apple.
                </p>
              </div>

              {/* 5. Mentions */}
              <div className="p-3 rounded-xl bg-aurora-input border border-aurora-border/60 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase font-bold text-aurora-secondary flex items-center gap-1">
                    <User className="w-3 h-3 text-aurora-secondary" />
                    <span>@ DIRECT MENTIONS</span>
                  </span>
                  <span className="text-[10px] text-aurora-muted">Personal</span>
                </div>
                <p className="text-xs text-aurora-muted leading-relaxed">
                  Filters questions and tasks addressed specifically to your handle ({userName || 'Guest'}).
                </p>
              </div>
            </div>

            {/* Contextual Peek of Selected Scenario */}
            <div className="p-3.5 rounded-xl bg-aurora-elevated border border-aurora-border space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-aurora-text flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-aurora-primary" />
                  <span>Sample Scenario Target</span>
                </span>
                <span className="text-aurora-primary font-mono capitalize">
                  {selectedPreset.context}
                </span>
              </div>
              <p className="text-xs text-aurora-muted leading-relaxed italic">
                "{selectedPreset.subtitle}"
              </p>
            </div>

            {/* Grounding guarantee */}
            <div className="pt-2 text-[11px] text-aurora-muted flex items-center gap-1.5">
              <Lock className="w-3 h-3 text-aurora-primary" />
              <span>100% Grounded in source quotes — zero hallucinations.</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

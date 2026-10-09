import React, { useRef, useState } from 'react';
import { 
  Upload, 
  Sparkles, 
  User, 
  AlertCircle, 
  Layers, 
  ArrowRight,
  RotateCcw,
  GraduationCap,
  Trophy,
  Briefcase,
  FileText,
  Sliders,
  Check,
  ShieldCheck
} from 'lucide-react';
import { PRESET_SAMPLES, PresetSample } from '../data/samples';

interface WorkspaceProps {
  inputText: string;
  setInputText: (val: string) => void;
  userName: string;
  setUserName: (val: string) => void;
  context: 'general' | 'college' | 'work' | 'project';
  setContext: (val: 'general' | 'college' | 'work' | 'project') => void;
  summaryLength: 'short' | 'detailed';
  setSummaryLength: (val: 'short' | 'detailed') => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  error: string | null;
  onClear: () => void;
  backendOnline: boolean;
  preferBackend: boolean;
}

export const Workspace: React.FC<WorkspaceProps> = ({
  inputText,
  setInputText,
  userName,
  setUserName,
  context,
  setContext,
  summaryLength,
  setSummaryLength,
  onAnalyze,
  isAnalyzing,
  error,
  onClear,
  backendOnline,
  preferBackend,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [activePresetId, setActivePresetId] = useState<string | null>(null);

  const handleFileUpload = (file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        setInputText(content);
        setActivePresetId(null);
      }
    };
    reader.readAsText(file);
  };

  const handleSelectPreset = (preset: PresetSample) => {
    setInputText(preset.text);
    setUserName(preset.defaultUserName);
    setContext(preset.context);
    setActivePresetId(preset.id);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const lineCount = inputText ? inputText.split(/\r?\n/).filter(l => l.trim().length > 0).length : 0;
  const charCount = inputText ? inputText.length : 0;
  const wordCount = inputText ? inputText.trim().split(/\s+/).filter(Boolean).length : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Top Banner / Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-navy-800">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            Conversation Input Workspace
          </h2>
          <p className="text-xs text-slate-400">
            Paste raw text, import chat exports (.txt/.json), or select a pre-built demo scenario
          </p>
        </div>

        {/* Privacy Status */}
        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-navy-900 border border-navy-800 text-slate-300 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            <span>Mode: {backendOnline && preferBackend ? 'FastAPI Local Service' : 'On-Device Browser RAM'}</span>
          </span>
        </div>
      </div>

      {/* Preset Scenarios Selector */}
      <div className="p-4 rounded-2xl bg-navy-900/60 border border-navy-800">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" />
            <span>Demo Scenarios (1-Click Presets):</span>
          </span>
          <span className="text-[11px] text-slate-400">Select to auto-populate</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {PRESET_SAMPLES.map((preset) => {
            const isSelected = activePresetId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className={`flex flex-col text-left p-3 rounded-xl border text-xs transition-all ${
                  isSelected
                    ? 'bg-teal-500/15 border-teal-500/50 shadow-md shadow-teal-500/10'
                    : 'bg-navy-950/60 border-navy-800 hover:border-navy-700 hover:bg-navy-900/50'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <div className="font-semibold text-slate-200 flex items-center gap-1.5 truncate">
                    {preset.context === 'college' && <GraduationCap className="w-4 h-4 text-teal-400" />}
                    {preset.context === 'project' && <Trophy className="w-4 h-4 text-teal-400" />}
                    {preset.context === 'work' && <Briefcase className="w-4 h-4 text-teal-400" />}
                    <span className="truncate">{preset.title}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" />}
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {preset.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Configuration Controls Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-navy-900/60 border border-navy-800">
        {/* Context Selector */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Conversation Context
          </label>
          <select
            value={context}
            onChange={(e) => setContext(e.target.value as any)}
            className="w-full px-3 py-2 text-xs bg-navy-950 border border-navy-800 rounded-xl text-slate-200 focus:outline-none focus:border-teal-500 transition-colors"
          >
            <option value="college">🎓 College / Academic Announcements</option>
            <option value="project">🏆 Project / Hackathon Sprint</option>
            <option value="work">💼 Work / Team Roadmap</option>
            <option value="general">💬 General Conversation</option>
          </select>
        </div>

        {/* User Name for Mention Detection */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Your Name / Handle (For Mentions)
          </label>
          <div className="relative">
            <User className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="e.g. Priya, Alex, Jordan"
              className="w-full pl-8 pr-3 py-2 text-xs bg-navy-950 border border-navy-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
            />
          </div>
        </div>

        {/* Summary Length Selector */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Summary Granularity
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setSummaryLength('short')}
              className={`py-2 px-3 rounded-xl text-xs font-medium border text-center transition-all ${
                summaryLength === 'short'
                  ? 'bg-teal-500/20 text-teal-300 border-teal-500/40'
                  : 'bg-navy-950 text-slate-400 border-navy-800 hover:text-slate-200'
              }`}
            >
              Short (TL;DR)
            </button>
            <button
              type="button"
              onClick={() => setSummaryLength('detailed')}
              className={`py-2 px-3 rounded-xl text-xs font-medium border text-center transition-all ${
                summaryLength === 'detailed'
                  ? 'bg-teal-500/20 text-teal-300 border-teal-500/40'
                  : 'bg-navy-950 text-slate-400 border-navy-800 hover:text-slate-200'
              }`}
            >
              Detailed Brief
            </button>
          </div>
        </div>
      </div>

      {/* Main Textarea and Drag-and-Drop */}
      <div
        className={`p-4 rounded-2xl bg-navy-900/60 border border-navy-800 transition-all ${
          dragOver ? 'border-2 border-dashed border-teal-400 bg-teal-500/5' : ''
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-200">
            Paste Conversation Transcript:
          </span>
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
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-navy-800 hover:bg-navy-700 text-slate-300 border border-navy-700 transition-colors"
            >
              <Upload className="w-3.5 h-3.5 text-teal-400" />
              <span>Import .TXT File</span>
            </button>

            {inputText && (
              <button
                type="button"
                onClick={onClear}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-navy-800/80 hover:bg-navy-700 text-slate-400 hover:text-slate-200 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        <textarea
          value={inputText}
          onChange={(e) => {
            setInputText(e.target.value);
            setActivePresetId(null);
          }}
          onKeyDown={(e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
              e.preventDefault();
              onAnalyze();
            }
          }}
          placeholder={`Paste your chat messages here, or drop a text export...

Example:
[08:45 AM] Rohit: Professor Sharma rescheduled the CS302 exam to Wednesday at 10:00 AM.
[08:50 AM] Rohit: Urgent: Assignment 4 closes tonight at 11:59 PM.
[09:05 AM] Rohit: Decision: Question 5 is strictly mandatory for team projects.
[09:12 AM] Ananya: Vikram needs to commit the Docker Compose setup before 6:00 PM.`}
          rows={10}
          className="w-full p-4 bg-navy-950/80 border border-navy-800 rounded-xl text-slate-200 font-mono text-xs placeholder-slate-500 focus:outline-none focus:border-teal-500 resize-y leading-relaxed"
        />

        {/* Metrics Counter bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 mt-2 px-1 text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <span>Lines: <strong className="text-slate-200">{lineCount}</strong></span>
            <span>Words: <strong className="text-slate-200">{wordCount}</strong></span>
            <span>Characters: <strong className="text-slate-200">{charCount}</strong></span>
            <span className="hidden sm:inline">• Press <kbd className="px-1.5 py-0.5 rounded bg-navy-800 border border-navy-700 text-[10px] text-slate-300">Ctrl+Enter</kbd> to analyze</span>
          </div>

          <div className="text-teal-400/80">
            {lineCount > 0 ? '✓ Ready for triage' : 'Waiting for input'}
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mt-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Primary Analyze Action Button */}
        <div className="mt-4 pt-3 border-t border-navy-800 flex items-center justify-end">
          <button
            type="button"
            onClick={onAnalyze}
            disabled={isAnalyzing || !inputText.trim()}
            className={`flex items-center gap-2 px-7 py-3 rounded-xl font-semibold text-xs sm:text-sm shadow-lg transition-all ${
              isAnalyzing || !inputText.trim()
                ? 'bg-teal-500/40 text-navy-950/50 cursor-not-allowed'
                : 'text-navy-950 bg-gradient-to-r from-teal-400 to-cyan-400 hover:from-teal-300 hover:to-cyan-300 shadow-teal-500/25 cursor-pointer transform hover:-translate-y-0.5'
            }`}
          >
            {isAnalyzing ? (
              <>
                <div className="w-4 h-4 border-2 border-navy-950/30 border-t-navy-950 rounded-full animate-spin" />
                <span>Running Grounded Pipeline...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Analyze Conversation & Catch Up</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

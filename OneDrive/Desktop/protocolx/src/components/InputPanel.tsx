import React, { useRef, useState } from 'react';
import { 
  FileText, 
  Upload, 
  Sparkles, 
  User, 
  AlertCircle, 
  Layers, 
  ArrowRight,
  ClipboardCheck,
  RotateCcw
} from 'lucide-react';
import { PRESET_SAMPLES, PresetSample } from '../data/samples';

interface InputPanelProps {
  inputText: string;
  setInputText: (val: string) => void;
  userName: string;
  setUserName: (val: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  error: string | null;
  onClear: () => void;
}

export const InputPanel: React.FC<InputPanelProps> = ({
  inputText,
  setInputText,
  userName,
  setUserName,
  onAnalyze,
  isAnalyzing,
  error,
  onClear,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileUpload = (file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        setInputText(content);
        setSelectedPreset(null);
      }
    };
    reader.readAsText(file);
  };

  const handleSelectPreset = (preset: PresetSample) => {
    setInputText(preset.text);
    setUserName(preset.defaultUserName);
    setSelectedPreset(preset.id);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const lineCount = inputText ? inputText.split(/\r?\n/).filter(l => l.trim().length > 0).length : 0;
  const wordCount = inputText ? inputText.trim().split(/\s+/).filter(Boolean).length : 0;

  return (
    <div className="w-full bg-slate-900/60 rounded-2xl border border-slate-800 p-5 shadow-xl backdrop-blur-md">
      {/* Header section with Presets */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Layers className="w-4 h-4" />
            </span>
            <h2 className="text-sm font-semibold text-white tracking-wide uppercase">
              1. Choose Sample or Paste Chat Export
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Supports Slack, WhatsApp, Teams, Discord, plain text transcripts, or JSON exports.
          </p>
        </div>

        {/* User identifier input */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-500">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Your Name (e.g. Alex, Maya)"
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-950/80 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Preset Demo Chips */}
      <div className="pt-4 pb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            Quick 1-Click Test Scenarios:
          </span>
          <span className="text-[11px] text-indigo-400">Instant Hackathon Demos ⚡</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {PRESET_SAMPLES.map((preset) => {
            const isSelected = selectedPreset === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className={`flex flex-col items-start text-left p-2.5 rounded-xl border text-xs transition-all ${
                  isSelected
                    ? 'bg-indigo-600/15 border-indigo-500/50 shadow-md shadow-indigo-500/10'
                    : 'bg-slate-950/50 border-slate-800/80 hover:bg-slate-800/40 hover:border-slate-700'
                }`}
              >
                <div className="font-medium text-slate-200 flex items-center gap-1.5 w-full">
                  <span className="truncate">{preset.title}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {preset.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Text Area & Drag-Drop zone */}
      <div
        className={`relative mt-2 rounded-xl transition-all ${
          dragOver ? 'border-2 border-dashed border-indigo-500 bg-indigo-500/5' : ''
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <textarea
          value={inputText}
          onChange={(e) => {
            setInputText(e.target.value);
            setSelectedPreset(null);
          }}
          onKeyDown={(e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
              e.preventDefault();
              onAnalyze();
            }
          }}
          placeholder={`Paste your chat transcript here, or drag & drop a .txt/.json file...

Example:
[10:15 AM] Maya: Hackathon code freeze is at 3:00 PM today!
[10:20 AM] Alex: I'll test the local summarizer engine.
[10:25 AM] Maya: Alex, can you please record the demo video by 1:30 PM?
[10:30 AM] David: Decision: let's go with dark mode glassmorphism.`}
          rows={7}
          className="w-full p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl text-slate-200 font-mono text-xs placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-y leading-relaxed"
        />

        {/* Counter and Drag indicator */}
        <div className="flex flex-wrap items-center justify-between gap-2 mt-2 px-1 text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <span>Lines: <strong className="text-slate-300">{lineCount}</strong></span>
            <span>Words: <strong className="text-slate-300">{wordCount}</strong></span>
            <span className="hidden sm:inline text-slate-400">• Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px]">Ctrl+Enter</kbd> to analyze</span>
          </div>

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
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <Upload className="w-3 h-3" />
              <span>Import File</span>
            </button>
            {inputText && (
              <button
                type="button"
                onClick={onClear}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-400 hover:text-slate-200 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mt-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-end">
        <button
          type="button"
          onClick={onAnalyze}
          disabled={isAnalyzing || !inputText.trim()}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-lg transition-all ${
            isAnalyzing || !inputText.trim()
              ? 'bg-aurora-primary/40 text-aurora-bg/60 cursor-not-allowed opacity-60'
              : 'aurora-btn-primary shadow-md cursor-pointer transform hover:-translate-y-0.5'
          }`}
        >
          {isAnalyzing ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Processing Grounded Intel...</span>
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
  );
};

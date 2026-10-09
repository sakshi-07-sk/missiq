import React, { useEffect, useState } from 'react';
import { 
  ShieldCheck, 
  Database, 
  Trash2, 
  Server, 
  Cpu, 
  RotateCcw, 
  Check, 
  History, 
  Clock, 
  Calendar, 
  ArrowRight,
  Sliders
} from 'lucide-react';
import { getSavedSessions, deleteSessionFromDB, clearAllLocalSessions, SavedSession } from '../services/db';
import { CatchUpAnalysis } from '../types';

interface SettingsPageProps {
  preferBackend: boolean;
  setPreferBackend: (val: boolean) => void;
  summaryLength: 'short' | 'detailed';
  setSummaryLength: (val: 'short' | 'detailed') => void;
  backendOnline: boolean;
  onClearCurrentSession: () => void;
  onRestoreAnalysis: (analysis: CatchUpAnalysis) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  preferBackend,
  setPreferBackend,
  summaryLength,
  setSummaryLength,
  backendOnline,
  onClearCurrentSession,
  onRestoreAnalysis,
}) => {
  const [sessions, setSessions] = useState<SavedSession[]>([]);
  const [wipedMessage, setWipedMessage] = useState(false);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    const list = await getSavedSessions();
    setSessions(list);
  };

  const handleDeleteSession = async (id: string) => {
    await deleteSessionFromDB(id);
    await loadSessions();
  };

  const handleClearAllHistory = async () => {
    if (confirm('Are you sure you want to delete all saved local conversation history?')) {
      await clearAllLocalSessions();
      await loadSessions();
      setWipedMessage(true);
      setTimeout(() => setWipedMessage(false), 2500);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="pb-3 border-b border-navy-800">
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Sliders className="w-5 h-5 text-teal-400" />
          <span>Application Settings & Privacy Controls</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Configure processing engine, summary preferences, and private browser storage
        </p>
      </div>

      {/* 1. Processing Engine Selection */}
      <div className="p-5 rounded-2xl bg-navy-900/60 border border-navy-800 space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">AI Processing Mode</h3>
            <p className="text-xs text-slate-400">Choose between on-device browser intelligence or local FastAPI backend</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {/* Option A: 100% On-Device Browser */}
          <div
            onClick={() => setPreferBackend(false)}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              !preferBackend
                ? 'bg-teal-500/15 border-teal-500 text-teal-200'
                : 'bg-navy-950/70 border-navy-800 hover:border-navy-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-teal-400" />
                100% On-Device (Browser RAM)
              </span>
              {!preferBackend && <Check className="w-4 h-4 text-teal-400" />}
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Zero network calls. Parsing, priority scoring, decisions, and tasks run solely inside JavaScript memory.
            </p>
          </div>

          {/* Option B: FastAPI Local Service */}
          <div
            onClick={() => setPreferBackend(true)}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              preferBackend
                ? 'bg-teal-500/15 border-teal-500 text-teal-200'
                : 'bg-navy-950/70 border-navy-800 hover:border-navy-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Server className="w-4 h-4 text-cyan-400" />
                Python FastAPI Local Service
              </span>
              {preferBackend && <Check className="w-4 h-4 text-teal-400" />}
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Connects to FastAPI running on <code className="text-teal-300">http://localhost:8000</code>. Status: 
              <strong className={backendOnline ? 'text-teal-400 ml-1' : 'text-amber-400 ml-1'}>
                {backendOnline ? 'Connected' : 'Offline (Auto-falls back to browser)'}
              </strong>.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Default Summary Length Preference */}
      <div className="p-5 rounded-2xl bg-navy-900/60 border border-navy-800 space-y-3">
        <h3 className="text-sm font-bold text-white">Default Summary Format</h3>
        <p className="text-xs text-slate-400">Select default granularity when analyzing conversations</p>
        <div className="flex items-center gap-3 pt-1">
          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
            <input
              type="radio"
              name="summaryLength"
              checked={summaryLength === 'short'}
              onChange={() => setSummaryLength('short')}
              className="accent-teal-500"
            />
            <span>Short TL;DR (3-4 sentences focusing strictly on next actions)</span>
          </label>

          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
            <input
              type="radio"
              name="summaryLength"
              checked={summaryLength === 'detailed'}
              onChange={() => setSummaryLength('detailed')}
              className="accent-teal-500"
            />
            <span>Detailed Brief (Full context, announcements, and risk highlights)</span>
          </label>
        </div>
      </div>

      {/* 3. Browser IndexedDB Local History */}
      <div className="p-5 rounded-2xl bg-navy-900/60 border border-navy-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Saved Local History (IndexedDB)</h3>
              <p className="text-xs text-slate-400">Stored exclusively on this device's browser sandbox</p>
            </div>
          </div>

          {sessions.length > 0 && (
            <button
              onClick={handleClearAllHistory}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/10 text-rose-300 border border-rose-500/20 hover:bg-rose-500/20 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All History</span>
            </button>
          )}
        </div>

        {wipedMessage && (
          <div className="p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>Local IndexedDB database wiped cleanly.</span>
          </div>
        )}

        {sessions.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500 bg-navy-950/40 rounded-xl border border-navy-800">
            No saved conversations in local history yet. Any analysis you perform is saved locally here.
          </div>
        ) : (
          <div className="space-y-2.5">
            {sessions.map((s) => (
              <div
                key={s.id}
                className="p-3.5 rounded-xl bg-navy-950/70 border border-navy-800 flex items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-white">{s.title}</span>
                    <span className="text-[10px] uppercase font-semibold px-2 py-0.2 rounded-full bg-navy-800 text-slate-400 border border-navy-700">
                      {s.context}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {new Date(s.createdAt).toLocaleDateString()} {new Date(s.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span>• {s.messageCount} msgs</span>
                    <span>• {s.actionCount} actions</span>
                    <span>• {s.decisionCount} decisions</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onRestoreAnalysis(s.analysis)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-teal-500/15 text-teal-300 border border-teal-500/30 hover:bg-teal-500/25 transition-colors"
                  >
                    <span>Restore</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDeleteSession(s.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 transition-colors"
                    title="Delete item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Session Wipe Button */}
      <div className="p-5 rounded-2xl bg-rose-950/15 border border-rose-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-rose-300">Wipe Volatile Session State</h3>
          <p className="text-xs text-rose-200/80 mt-0.5">
            Instantly clears active chat text and reset all in-memory variables.
          </p>
        </div>
        <button
          onClick={onClearCurrentSession}
          className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 transition-colors cursor-pointer self-start sm:self-auto"
        >
          Wipe Active Session
        </button>
      </div>
    </div>
  );
};

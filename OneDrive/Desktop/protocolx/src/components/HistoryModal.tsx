import React, { useEffect, useState } from 'react';
import { X, History, Clock, ArrowRight, Trash2 } from 'lucide-react';
import { getSavedSessions, deleteSessionFromDB, SavedSession } from '../services/db';
import { CatchUpAnalysis } from '../types';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSession: (analysis: CatchUpAnalysis) => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  onSelectSession,
}) => {
  const [sessions, setSessions] = useState<SavedSession[]>([]);

  useEffect(() => {
    if (isOpen) {
      loadSessions();
    }
  }, [isOpen]);

  const loadSessions = async () => {
    const list = await getSavedSessions();
    setSessions(list);
  };

  const handleDelete = async (id: string) => {
    await deleteSessionFromDB(id);
    await loadSessions();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-xl bg-navy-900 border border-navy-800 rounded-3xl shadow-2xl p-6 relative flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-navy-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Local History (IndexedDB)</h3>
              <p className="text-xs text-slate-400">Past conversation catch-ups saved on this device</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-navy-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sessions list */}
        <div className="mt-4 flex-1 overflow-y-auto space-y-2.5 pr-1">
          {sessions.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No saved history found in browser IndexedDB.
            </div>
          ) : (
            sessions.map((s) => (
              <div
                key={s.id}
                className="p-3.5 rounded-xl bg-navy-950/70 border border-navy-800 flex items-center justify-between gap-3 hover:border-teal-500/30 transition-all"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-white truncate">{s.title}</span>
                    <span className="text-[10px] uppercase font-semibold px-2 py-0.2 rounded-full bg-navy-800 text-slate-400">
                      {s.context}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-2">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>{new Date(s.createdAt).toLocaleDateString()} {new Date(s.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <span>• {s.messageCount} msgs</span>
                    <span>• {s.actionCount} tasks</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onSelectSession(s.analysis);
                      onClose();
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-teal-500/15 text-teal-300 border border-teal-500/30 hover:bg-teal-500/25 transition-colors"
                  >
                    <span>Restore</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDelete(s.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 transition-colors"
                    title="Delete item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-navy-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-navy-800 hover:bg-navy-700 text-slate-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

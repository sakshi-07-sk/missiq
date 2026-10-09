import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  History, 
  Clock, 
  Trash2, 
  ArrowRight, 
  Database,
  CheckCircle2
} from 'lucide-react';
import { getSavedSessions, deleteSessionFromDB, clearAllLocalSessions, SavedSession } from '../services/db';
import { CatchUpAnalysis } from '../types';

interface SavedSummariesPageProps {
  onRestoreAnalysis: (analysis: CatchUpAnalysis) => void;
  onRefreshCount: () => void;
}

export const SavedSummariesPage: React.FC<SavedSummariesPageProps> = ({
  onRestoreAnalysis,
  onRefreshCount,
}) => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<SavedSession[]>([]);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    const list = await getSavedSessions();
    setSessions(list);
    onRefreshCount();
  };

  const handleRestore = (analysis: CatchUpAnalysis) => {
    onRestoreAnalysis(analysis);
    navigate('/app');
  };

  const handleDelete = async (id: string) => {
    await deleteSessionFromDB(id);
    await loadSessions();
  };

  const handleClearAll = async () => {
    if (confirm('Are you sure you want to delete all saved local conversation history?')) {
      await clearAllLocalSessions();
      await loadSessions();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
      <div className="pb-4 border-b border-aurora-border/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-aurora-text tracking-tight flex items-center gap-2">
            <History className="w-6 h-6 text-aurora-primary" />
            <span>Saved Catch-Up Summaries ({sessions.length})</span>
          </h1>
          <p className="text-xs text-aurora-muted mt-1">
            Origin-isolated local history persisted securely in browser IndexedDB
          </p>
        </div>

        {sessions.length > 0 && (
          <button
            onClick={handleClearAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-aurora-error bg-aurora-error/15 border border-aurora-error/30 hover:bg-aurora-error/25 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All History</span>
          </button>
        )}
      </div>

      {sessions.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-aurora-surface border border-aurora-border space-y-3">
          <Database className="w-10 h-10 text-aurora-muted mx-auto" />
          <h3 className="text-sm font-bold text-aurora-text">No Saved Summaries Yet</h3>
          <p className="text-xs text-aurora-muted max-w-sm mx-auto">
            Whenever you analyze a conversation in the workspace, a copy is archived in your private local IndexedDB.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((s) => (
            <div
              key={s.id}
              className="p-5 rounded-2xl bg-aurora-surface border border-aurora-border hover:border-aurora-primary/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-aurora-text truncate">{s.title}</h4>
                  <span className="text-[10px] uppercase font-mono font-semibold px-2 py-0.5 rounded-full bg-aurora-input text-aurora-primary border border-aurora-border">
                    {s.context}
                  </span>
                </div>
                <div className="text-xs text-aurora-muted flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-aurora-muted" />
                    <span>{new Date(s.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                  </span>
                  <span>·</span>
                  <span>{s.messageCount} messages</span>
                  <span>·</span>
                  <span>{s.actionCount} tasks</span>
                  <span>·</span>
                  <span>{s.decisionCount} decisions</span>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => handleRestore(s.analysis)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-aurora-elevated hover:bg-aurora-primary hover:text-aurora-bg text-xs font-semibold text-aurora-primary border border-aurora-primary/30 transition-all cursor-pointer"
                >
                  <span>Open Briefing</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(s.id)}
                  className="p-1.5 rounded-xl text-aurora-muted hover:text-aurora-error hover:bg-aurora-input transition-colors cursor-pointer"
                  title="Delete from local database"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

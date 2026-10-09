import React from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Calendar, 
  User, 
  ExternalLink, 
  Info,
  CheckCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ActionItem } from '../types';

interface ActionItemsListProps {
  actionItems: ActionItem[];
  onToggleComplete: (id: string) => void;
  onViewSource: (messageId: string, excerpt: string, sender: string) => void;
}

export const ActionItemsList: React.FC<ActionItemsListProps> = ({
  actionItems,
  onToggleComplete,
  onViewSource,
}) => {
  const handleToggle = (id: string, currentlyCompleted?: boolean) => {
    onToggleComplete(id);
    if (!currentlyCompleted) {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#6366f1', '#10b981', '#f59e0b']
      });
    }
  };

  if (actionItems.length === 0) {
    return (
      <div className="p-8 text-center rounded-xl bg-slate-900/40 border border-slate-800">
        <CheckCheck className="w-8 h-8 text-slate-500 mx-auto mb-2" />
        <p className="text-sm font-medium text-slate-300">No Action Items Extracted</p>
        <p className="text-xs text-slate-500 mt-1">
          No explicit tasks or actionable requests were found in the provided transcript.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {actionItems.map((item) => {
        const isDone = !!item.completed;
        const priorityColors = {
          High: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
          Medium: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
          Low: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30'
        }[item.priority];

        return (
          <div
            key={item.id}
            className={`p-3.5 rounded-xl border transition-all ${
              isDone
                ? 'bg-slate-950/40 border-slate-800/60 opacity-60'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 shadow-sm'
            }`}
          >
            <div className="flex items-start gap-3">
              {/* Interactive Checkbox */}
              <button
                type="button"
                onClick={() => handleToggle(item.id, isDone)}
                className="mt-0.5 text-slate-400 hover:text-emerald-400 transition-colors focus:outline-none"
                title={isDone ? 'Mark as incomplete' : 'Mark as complete'}
              >
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <Circle className="w-5 h-5" />
                )}
              </button>

              {/* Task Details */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${priorityColors}`}>
                      {item.priority}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <User className="w-3 h-3 text-slate-500" />
                      Owner: <strong className={item.owner === 'Not specified' ? 'text-slate-500 font-normal italic' : 'text-slate-200'}>{item.owner}</strong>
                    </span>
                  </div>

                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    Due: <strong className={item.dueDate === 'Not specified' ? 'text-slate-500 font-normal italic' : 'text-indigo-300'}>{item.dueDate}</strong>
                  </span>
                </div>

                {/* Task title */}
                <p className={`text-xs sm:text-sm font-medium ${isDone ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                  {item.task}
                </p>

                {/* Priority reasoning (FR-5) */}
                <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-400 bg-slate-950/40 px-2 py-1 rounded-md border border-slate-800/60">
                  <Info className="w-3 h-3 text-indigo-400 flex-shrink-0" />
                  <span className="truncate">
                    <strong>Why {item.priority}:</strong> {item.priorityReason}
                  </span>
                </div>

                {/* Grounding Source Link */}
                <div className="mt-2 flex items-center justify-between pt-1">
                  <span className="text-[10px] text-slate-500">
                    Source: <span className="text-slate-400">{item.sourceSender}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => onViewSource(item.sourceMessageId, item.sourceExcerpt, item.sourceSender)}
                    className="flex items-center gap-1 text-[11px] font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    <span>View Grounded Source</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

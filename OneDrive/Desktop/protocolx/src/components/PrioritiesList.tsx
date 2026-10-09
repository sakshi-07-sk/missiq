import React from 'react';
import { 
  AlertTriangle, 
  Clock, 
  CheckSquare, 
  Layers, 
  Info, 
  ExternalLink 
} from 'lucide-react';
import { PriorityItem } from '../types';

interface PrioritiesListProps {
  priorities: PriorityItem[];
  onViewSource: (messageId: string, excerpt: string, sender: string) => void;
}

export const PrioritiesList: React.FC<PrioritiesListProps> = ({
  priorities,
  onViewSource,
}) => {
  if (priorities.length === 0) {
    return (
      <div className="p-8 text-center rounded-xl bg-slate-900/40 border border-slate-800">
        <Layers className="w-8 h-8 text-slate-500 mx-auto mb-2" />
        <p className="text-sm font-medium text-slate-300">No Priority Items Logged</p>
        <p className="text-xs text-slate-500 mt-1">
          No critical alerts or prioritized highlights were discovered in this conversation.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {priorities.map((item) => {
        const priorityStyles = {
          High: {
            badge: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
            card: 'bg-rose-950/10 border-rose-500/25',
            icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
          },
          Medium: {
            badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
            card: 'bg-amber-950/10 border-amber-500/25',
            icon: <Clock className="w-3.5 h-3.5 text-amber-400" />
          },
          Low: {
            badge: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
            card: 'bg-slate-900/60 border-slate-800',
            icon: <CheckSquare className="w-3.5 h-3.5 text-indigo-400" />
          }
        }[item.priority];

        return (
          <div
            key={item.id}
            className={`p-3.5 rounded-xl border transition-all ${priorityStyles.card}`}
          >
            <div className="flex items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <span className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${priorityStyles.badge}`}>
                  {priorityStyles.icon}
                  <span>{item.priority} Priority</span>
                </span>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                  {item.category}
                </span>
                <span className="text-[11px] text-slate-400">
                  Sender: <strong className="text-slate-300">{item.sourceSender}</strong>
                </span>
              </div>

              <button
                type="button"
                onClick={() => onViewSource(item.sourceMessageId, item.sourceExcerpt, item.sourceSender)}
                className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                <span>Evidence</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm font-medium text-slate-100">
              {item.description}
            </p>

            {/* Justification / Reason (FR-5) */}
            <div className="mt-2.5 flex items-start gap-1.5 p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-300">
              <Info className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0 mt-0.5" />
              <span>
                <strong className="text-indigo-300">Priority Justification:</strong> {item.reason}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

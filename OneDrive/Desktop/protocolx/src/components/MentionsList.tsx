import React from 'react';
import { 
  AtSign, 
  Calendar, 
  AlertCircle, 
  Clock, 
  Download, 
  ExternalLink, 
  BellRing 
} from 'lucide-react';
import { MentionItem, DeadlineItem } from '../types';

interface MentionsListProps {
  mentions: MentionItem[];
  deadlines: DeadlineItem[];
  userName: string;
  onViewSource: (messageId: string, excerpt: string, sender: string) => void;
  onDownloadIcs: () => void;
}

export const MentionsList: React.FC<MentionsListProps> = ({
  mentions,
  deadlines,
  userName,
  onViewSource,
  onDownloadIcs,
}) => {
  return (
    <div className="space-y-6">
      {/* 1. Direct Mentions */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <AtSign className="w-3.5 h-3.5" />
            </span>
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              Direct Mentions for {userName ? `"${userName}"` : 'You'} ({mentions.length})
            </h3>
          </div>
        </div>

        {mentions.length === 0 ? (
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-center text-xs text-slate-400">
            {userName ? (
              <p>No messages explicitly mentioning <span className="text-slate-200 font-medium">"{userName}"</span> were found.</p>
            ) : (
              <p>Enter your name or identifier in the input panel to automatically highlight direct mentions.</p>
            )}
          </div>
        ) : (
          <div className="space-y-2.5">
            {mentions.map((m) => (
              <div
                key={m.id}
                className="p-3 rounded-xl bg-amber-950/15 border border-amber-500/25 hover:border-amber-500/40 transition-colors"
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      <BellRing className="w-3 h-3 text-amber-400" />
                      <span>{m.isActionable ? 'Action Required' : 'Direct Mention'}</span>
                    </span>
                    <span className="text-[11px] text-slate-300">
                      From: <strong className="text-white">{m.sourceSender}</strong>
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onViewSource(m.sourceMessageId, m.sourceExcerpt, m.sourceSender)}
                    className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300"
                  >
                    <span>View Context</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>

                <p className="text-xs text-slate-200 font-medium leading-relaxed">
                  "{m.sourceExcerpt}"
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. Deadlines & Key Dates */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Calendar className="w-3.5 h-3.5" />
            </span>
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              Detected Deadlines & Key Milestones ({deadlines.length})
            </h3>
          </div>

          {deadlines.length > 0 && (
            <button
              onClick={onDownloadIcs}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/25 transition-colors"
              title="Export deadlines to .ics calendar format"
            >
              <Download className="w-3 h-3" />
              <span>Export iCal (.ics)</span>
            </button>
          )}
        </div>

        {deadlines.length === 0 ? (
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-center text-xs text-slate-400">
            No specific deadlines or dates were detected in this conversation.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {deadlines.map((d) => {
              const urgencyBadge = {
                Overdue: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
                Today: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
                Upcoming: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
                Flexible: 'bg-slate-700/50 text-slate-300 border-slate-600'
              }[d.urgency];

              return (
                <div
                  key={d.id}
                  className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${urgencyBadge}`}>
                        {d.urgency}
                      </span>
                      <span className="text-[11px] font-mono text-indigo-300 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-indigo-400" />
                        {d.dueDate}
                      </span>
                    </div>

                    <p className="text-xs font-medium text-slate-200 line-clamp-2">
                      {d.title}
                    </p>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Assigned: <strong className="text-slate-300">{d.owner}</strong></span>
                    <button
                      type="button"
                      onClick={() => onViewSource(d.sourceMessageId, d.sourceExcerpt, d.sourceSender)}
                      className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 text-[10px]"
                    >
                      <span>Excerpt</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

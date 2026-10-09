import React from 'react';
import { Calendar, Clock, Download, ExternalLink, AlertTriangle } from 'lucide-react';
import { DeadlineItem } from '../types';
import { generateIcsCalendar, downloadTextFile } from '../services/exportService';

interface CalendarPageProps {
  deadlines: DeadlineItem[];
  onViewSource: (messageId: string, excerpt: string, sender: string) => void;
}

export const CalendarPage: React.FC<CalendarPageProps> = ({ deadlines, onViewSource }) => {
  const handleExportIcs = () => {
    const dummy: any = {
      actionItems: [],
      deadlines: deadlines,
      summary: { totalMessagesCount: 0 }
    };
    const ics = generateIcsCalendar(dummy);
    downloadTextFile('missiq-deadlines.ics', ics, 'text/calendar');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
      <div className="pb-4 border-b border-aurora-border/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-aurora-text tracking-tight flex items-center gap-2">
            <Calendar className="w-6 h-6 text-aurora-warning" />
            <span>Upcoming Deadlines & Scheduled Events ({deadlines.length})</span>
          </h1>
          <p className="text-xs text-aurora-muted mt-1">
            Timeline of explicit dates, assignment deadlines, exam times, and meetings
          </p>
        </div>

        {deadlines.length > 0 && (
          <button
            onClick={handleExportIcs}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-aurora-elevated text-aurora-warning border border-aurora-warning/30 hover:bg-aurora-surface transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Calendar (.ics)</span>
          </button>
        )}
      </div>

      {deadlines.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-aurora-surface border border-aurora-border space-y-3">
          <Calendar className="w-10 h-10 text-aurora-muted mx-auto" />
          <h3 className="text-sm font-bold text-aurora-text">No Deadlines Detected Yet</h3>
          <p className="text-xs text-aurora-muted max-w-sm mx-auto">
            Analyze a conversation containing dates or times in the workspace to populate this timeline.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {deadlines.map((dl) => {
            const isToday = dl.urgency === 'Today';
            const isOverdue = dl.urgency === 'Overdue';

            return (
              <div
                key={dl.id}
                className="p-5 rounded-2xl bg-aurora-surface border border-aurora-border hover:border-aurora-primary/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      isToday ? 'bg-aurora-error/20 text-aurora-error border-aurora-error/30' :
                      isOverdue ? 'bg-aurora-error/20 text-aurora-error border-aurora-error/30' :
                      'bg-aurora-warning/20 text-aurora-warning border-aurora-warning/30'
                    }`}>
                      {dl.urgency}
                    </span>

                    <span className="font-mono text-xs font-bold text-aurora-text flex items-center gap-1">
                      <Clock className="w-3 h-3 text-aurora-primary" />
                      {dl.dueDate}
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-aurora-text">
                    {dl.title}
                  </p>

                  <div className="text-xs text-aurora-muted">
                    Owner: <strong className={dl.owner === 'Not specified' ? 'text-aurora-muted italic font-normal' : 'text-aurora-text'}>{dl.owner}</strong>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onViewSource(dl.sourceMessageId, dl.sourceExcerpt, dl.sourceSender)}
                  className="text-xs text-aurora-primary hover:underline flex items-center gap-1 self-end sm:self-auto cursor-pointer"
                >
                  <span>View quote</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

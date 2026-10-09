import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckSquare, 
  CheckCircle2, 
  Circle, 
  User, 
  Calendar, 
  ExternalLink, 
  Info,
  ArrowUpDown,
  Filter
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ActionItem } from '../types';

interface ActionItemsPageProps {
  actionItems: ActionItem[];
  onToggleComplete: (id: string) => void;
  onViewSource: (messageId: string, excerpt: string, sender: string) => void;
}

export const ActionItemsPage: React.FC<ActionItemsPageProps> = ({
  actionItems,
  onToggleComplete,
  onViewSource,
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<'priority' | 'deadline'>('priority');

  const handleToggle = (id: string, currentlyCompleted?: boolean) => {
    onToggleComplete(id);
    if (!currentlyCompleted) {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#45E0C1', '#8AA8FF', '#45D6A0', '#F0FFFC']
      });
    }
  };

  const filteredTasks = actionItems.filter(item => {
    if (filter === 'pending') return !item.completed;
    if (filter === 'completed') return !!item.completed;
    return true;
  }).sort((a, b) => {
    if (sortBy === 'priority') {
      const order = { High: 1, Medium: 2, Low: 3 };
      return (order[a.priority] || 2) - (order[b.priority] || 2);
    } else {
      return a.dueDate.localeCompare(b.dueDate);
    }
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
      <div className="pb-4 border-b border-aurora-border/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-aurora-text tracking-tight flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-aurora-primary" />
            <span>Action Items ({actionItems.length})</span>
          </h1>
          <p className="text-xs text-aurora-muted mt-1">
            Grounded deliverables extracted from conversation transcripts
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-aurora-input p-1 rounded-xl border border-aurora-border text-xs">
            {(['all', 'pending', 'completed'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-lg capitalize transition-all cursor-pointer ${
                  filter === f ? 'bg-aurora-primary text-aurora-bg font-bold shadow-sm' : 'text-aurora-muted hover:text-aurora-text'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <button
            onClick={() => setSortBy(sortBy === 'priority' ? 'deadline' : 'priority')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-aurora-input border border-aurora-border text-xs text-aurora-muted hover:text-aurora-text cursor-pointer transition-colors"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-aurora-secondary" />
            <span>Sort</span>
          </button>
        </div>
      </div>

      {actionItems.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-aurora-surface border border-aurora-border space-y-3">
          <CheckSquare className="w-10 h-10 text-aurora-muted mx-auto" />
          <h3 className="text-sm font-bold text-aurora-text">No Action Items Found Yet</h3>
          <p className="text-xs text-aurora-muted max-w-sm mx-auto">
            Analyze a conversation transcript in the workspace to automatically extract tasks, owners, and due dates.
          </p>
          <div className="pt-2">
            <Link
              to="/app/analyze"
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-aurora-primary text-aurora-bg hover:bg-aurora-primary-hover shadow-md shadow-aurora-primary/20 inline-block transition-all"
            >
              Go to Workspace
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => {
            const isDone = !!task.completed;
            return (
              <div
                key={task.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isDone 
                    ? 'bg-aurora-input/40 border-aurora-border/40 opacity-60' 
                    : 'bg-aurora-surface border-aurora-border hover:border-aurora-primary/40'
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    type="button"
                    onClick={() => handleToggle(task.id, isDone)}
                    className="mt-0.5 text-aurora-muted hover:text-aurora-primary transition-colors focus:outline-none cursor-pointer"
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-aurora-primary" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5 text-xs">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          task.priority === 'High' ? 'bg-aurora-error/20 text-aurora-error border-aurora-error/30' :
                          task.priority === 'Medium' ? 'bg-aurora-warning/20 text-aurora-warning border-aurora-warning/30' :
                          'bg-aurora-elevated text-aurora-muted border-aurora-border'
                        }`}>
                          {task.priority}
                        </span>
                        <span className="text-aurora-muted">
                          Owner: <strong className={task.owner === 'Not specified' ? 'text-aurora-muted italic font-normal' : 'text-aurora-text'}>{task.owner}</strong>
                        </span>
                      </div>

                      <span className="text-xs text-aurora-muted">
                        Due: <strong className={task.dueDate === 'Not specified' ? 'text-aurora-muted italic font-normal' : 'text-aurora-secondary'}>{task.dueDate}</strong>
                      </span>
                    </div>

                    <p className={`text-sm font-semibold ${isDone ? 'line-through text-aurora-muted' : 'text-aurora-text'}`}>
                      {task.task}
                    </p>

                    <div className="mt-2.5 pt-2 border-t border-aurora-border/50 flex items-center justify-between text-xs text-aurora-muted">
                      <span>Source: {task.sourceSender}</span>
                      <button
                        type="button"
                        onClick={() => onViewSource(task.sourceMessageId, task.sourceExcerpt, task.sourceSender)}
                        className="text-aurora-primary hover:underline flex items-center gap-1 font-medium cursor-pointer"
                      >
                        <span>View source</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

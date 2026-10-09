import React from 'react';
import { 
  Clock, 
  MessageSquare, 
  AlertTriangle, 
  CheckSquare, 
  Scale, 
  AtSign,
  TrendingUp
} from 'lucide-react';
import { CatchUpAnalysis } from '../types';

interface MetricsBarProps {
  analysis: CatchUpAnalysis;
}

export const MetricsBar: React.FC<MetricsBarProps> = ({ analysis }) => {
  const { summary, priorities, actionItems, decisions, mentions } = analysis;
  const highPriorityCount = priorities.filter(p => p.priority === 'High').length;
  const completedActions = actionItems.filter(a => a.completed).length;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {/* Time Saved Metric */}
      <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/20 backdrop-blur-sm relative overflow-hidden group">
        <div className="flex items-center justify-between text-indigo-400 mb-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider">Time Saved</span>
          <Clock className="w-4 h-4 text-indigo-400 group-hover:rotate-12 transition-transform" />
        </div>
        <div className="text-xl font-bold text-white flex items-baseline gap-1">
          <span>~{summary.readingTimeSavedMinutes}</span>
          <span className="text-xs text-indigo-300 font-normal">min</span>
        </div>
        <div className="text-[10px] text-indigo-400/80 mt-0.5 flex items-center gap-1">
          <TrendingUp className="w-3 h-3" />
          <span>vs full read</span>
        </div>
      </div>

      {/* Messages Processed */}
      <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm group">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider">Analyzed</span>
          <MessageSquare className="w-4 h-4 text-slate-400 group-hover:scale-110 transition-transform" />
        </div>
        <div className="text-xl font-bold text-slate-100 flex items-baseline gap-1">
          <span>{summary.totalMessagesCount}</span>
          <span className="text-xs text-slate-400 font-normal">msgs</span>
        </div>
        <div className="text-[10px] text-slate-400 mt-0.5 truncate">
          {summary.participantCount} participants
        </div>
      </div>

      {/* Critical Items */}
      <div className={`p-3.5 rounded-xl border backdrop-blur-sm group ${
        highPriorityCount > 0 
          ? 'bg-rose-950/20 border-rose-500/30 text-rose-300' 
          : 'bg-slate-900/60 border-slate-800 text-slate-400'
      }`}>
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider">High Urgency</span>
          <AlertTriangle className={`w-4 h-4 ${highPriorityCount > 0 ? 'text-rose-400 group-hover:scale-110' : 'text-slate-400'} transition-transform`} />
        </div>
        <div className="text-xl font-bold text-slate-100 flex items-baseline gap-1">
          <span className={highPriorityCount > 0 ? 'text-rose-400' : 'text-slate-300'}>
            {highPriorityCount}
          </span>
          <span className="text-xs text-slate-400 font-normal">items</span>
        </div>
        <div className="text-[10px] text-slate-400 mt-0.5">
          {highPriorityCount > 0 ? 'Requires attention' : 'No blockers'}
        </div>
      </div>

      {/* Action Items */}
      <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm group">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider">Tasks</span>
          <CheckSquare className="w-4 h-4 text-slate-400 group-hover:scale-110 transition-transform" />
        </div>
        <div className="text-xl font-bold text-slate-100 flex items-baseline gap-1">
          <span>{actionItems.length}</span>
          {completedActions > 0 && (
            <span className="text-xs text-emerald-400 font-medium">({completedActions} done)</span>
          )}
        </div>
        <div className="text-[10px] text-slate-400 mt-0.5 truncate">
          {actionItems.filter(a => a.owner !== 'Not specified').length} assigned
        </div>
      </div>

      {/* Decisions Made */}
      <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm group">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider">Decisions</span>
          <Scale className="w-4 h-4 text-slate-400 group-hover:scale-110 transition-transform" />
        </div>
        <div className="text-xl font-bold text-slate-100 flex items-baseline gap-1">
          <span>{decisions.length}</span>
          <span className="text-xs text-slate-400 font-normal">logged</span>
        </div>
        <div className="text-[10px] text-slate-400 mt-0.5">
          {decisions.filter(d => d.status === 'Confirmed').length} confirmed
        </div>
      </div>

      {/* Direct Mentions */}
      <div className={`p-3.5 rounded-xl border backdrop-blur-sm group ${
        mentions.length > 0 
          ? 'bg-amber-950/20 border-amber-500/30 text-amber-300' 
          : 'bg-slate-900/60 border-slate-800 text-slate-400'
      }`}>
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider">Mentions</span>
          <AtSign className={`w-4 h-4 ${mentions.length > 0 ? 'text-amber-400 group-hover:scale-110' : 'text-slate-400'} transition-transform`} />
        </div>
        <div className="text-xl font-bold text-slate-100 flex items-baseline gap-1">
          <span className={mentions.length > 0 ? 'text-amber-400' : 'text-slate-300'}>
            {mentions.length}
          </span>
          <span className="text-xs text-slate-400 font-normal">pings</span>
        </div>
        <div className="text-[10px] text-slate-400 mt-0.5">
          {mentions.filter(m => m.isActionable).length > 0 ? 'Direct requests' : 'Status pings'}
        </div>
      </div>
    </div>
  );
};

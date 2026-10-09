import React from 'react';
import { 
  CheckCircle, 
  HelpCircle, 
  Scale, 
  ExternalLink, 
  UserCheck 
} from 'lucide-react';
import { DecisionItem } from '../types';

interface DecisionsListProps {
  decisions: DecisionItem[];
  onViewSource: (messageId: string, excerpt: string, sender: string) => void;
}

export const DecisionsList: React.FC<DecisionsListProps> = ({
  decisions,
  onViewSource,
}) => {
  if (decisions.length === 0) {
    return (
      <div className="p-8 text-center rounded-xl bg-slate-900/40 border border-slate-800">
        <Scale className="w-8 h-8 text-slate-500 mx-auto mb-2" />
        <p className="text-sm font-medium text-slate-300">No Explicit Decisions Detected</p>
        <p className="text-xs text-slate-500 mt-1">
          No finalized agreements or consensus statements were identified in the conversation.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {decisions.map((dec) => {
        const isConfirmed = dec.status === 'Confirmed';

        return (
          <div
            key={dec.id}
            className={`p-3.5 rounded-xl border transition-all ${
              isConfirmed 
                ? 'bg-emerald-950/10 border-emerald-500/20 hover:border-emerald-500/35' 
                : 'bg-amber-950/10 border-amber-500/20 hover:border-amber-500/35'
            }`}
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <span
                  className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                    isConfirmed
                      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                      : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                  }`}
                >
                  {isConfirmed ? (
                    <>
                      <CheckCircle className="w-3 h-3 text-emerald-400" />
                      <span>Confirmed Decision</span>
                    </>
                  ) : (
                    <>
                      <HelpCircle className="w-3 h-3 text-amber-400" />
                      <span>Under Discussion</span>
                    </>
                  )}
                </span>

                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <UserCheck className="w-3 h-3 text-slate-500" />
                  <span>Stated by: <strong className="text-slate-200">{dec.sourceSender}</strong></span>
                </span>
              </div>

              <button
                type="button"
                onClick={() => onViewSource(dec.sourceMessageId, dec.sourceExcerpt, dec.sourceSender)}
                className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                <span>Source</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            {/* Decision Text */}
            <p className="text-xs sm:text-sm font-semibold text-slate-100">
              {dec.decision}
            </p>

            {/* Supporting quote */}
            <div className="mt-2.5 p-2 rounded-lg bg-slate-950/50 border border-slate-800/80 text-[11px] text-slate-300 italic font-mono">
              "{dec.sourceExcerpt}"
            </div>
          </div>
        );
      })}
    </div>
  );
};

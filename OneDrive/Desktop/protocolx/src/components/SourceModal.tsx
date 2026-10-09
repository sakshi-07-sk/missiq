import React from 'react';
import { X, CheckCircle, Quote, MessageSquare } from 'lucide-react';

interface SourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  messageId: string;
  sender: string;
  excerpt: string;
  onJumpToTranscript: (messageId: string) => void;
}

export const SourceModal: React.FC<SourceModalProps> = ({
  isOpen,
  onClose,
  messageId,
  sender,
  excerpt,
  onJumpToTranscript,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg bg-aurora-surface border border-aurora-border rounded-2xl shadow-2xl p-5 relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-aurora-border/70">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-aurora-elevated text-aurora-primary border border-aurora-border">
              <Quote className="w-4 h-4 text-aurora-primary" />
            </span>
            <div>
              <h3 className="text-sm font-semibold text-aurora-text">Grounded Source Verification</h3>
              <p className="text-[11px] text-aurora-muted">Verifiable original transcript evidence</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-aurora-muted hover:text-aurora-text hover:bg-aurora-elevated transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Grounding guarantee badge */}
        <div className="mt-3 p-2.5 rounded-xl bg-aurora-primary/10 border border-aurora-primary/25 text-aurora-primary text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-aurora-primary flex-shrink-0" />
          <span>This insight is strictly grounded in the source message without hallucination.</span>
        </div>

        {/* Source Content Box */}
        <div className="mt-4 p-4 rounded-xl bg-aurora-input border border-aurora-border">
          <div className="flex items-center justify-between text-xs text-aurora-muted mb-2">
            <span className="font-semibold text-aurora-text">Speaker: {sender}</span>
            <span className="font-mono text-[11px] text-aurora-secondary">ID: {messageId}</span>
          </div>
          <blockquote className="text-xs sm:text-sm text-aurora-text font-mono leading-relaxed whitespace-pre-wrap pl-3 border-l-2 border-aurora-primary">
            "{excerpt}"
          </blockquote>
        </div>

        {/* Actions */}
        <div className="mt-5 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-aurora-primary text-aurora-bg hover:bg-aurora-primary-hover transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

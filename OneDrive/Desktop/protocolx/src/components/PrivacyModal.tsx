import React from 'react';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  Database, 
  EyeOff, 
  CheckCircle,
  Cpu
} from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-xl bg-aurora-surface border border-aurora-border rounded-2xl shadow-2xl p-6 relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-aurora-border/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-aurora-elevated text-aurora-primary border border-aurora-border">
              <ShieldCheck className="w-5 h-5 text-aurora-primary" />
            </div>
            <div>
              <h3 className="text-base font-bold text-aurora-text">Privacy-First Architecture</h3>
              <p className="text-xs text-aurora-muted">Verified local processing & zero-leak policy</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-aurora-muted hover:text-aurora-text hover:bg-aurora-elevated transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Status Callout */}
        <div className="mt-4 p-3 rounded-xl bg-aurora-input border border-aurora-primary/30 flex items-start gap-2.5">
          <Lock className="w-4 h-4 text-aurora-primary flex-shrink-0 mt-0.5" />
          <div className="text-xs text-aurora-text leading-relaxed">
            <strong className="text-aurora-primary">Zero Remote Retention Guarantee:</strong> All conversation text, summaries, decisions, and deadlines remain strictly within your local device runtime unless explicit BYOK cloud sync is configured.
          </div>
        </div>

        {/* Feature pillars */}
        <div className="mt-4 space-y-3">
          <div className="p-3 rounded-xl bg-aurora-input border border-aurora-border/60 flex items-start gap-3">
            <Cpu className="w-4 h-4 text-aurora-secondary flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-semibold text-aurora-text">Local Execution</h4>
              <p className="text-[11px] text-aurora-muted mt-0.5 leading-relaxed">
                The extraction logic, regex entity recognizers, and summarizers run on your device's CPU/RAM via client JavaScript or a local FastAPI daemon.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-aurora-input border border-aurora-border/60 flex items-start gap-3">
            <Database className="w-4 h-4 text-aurora-primary flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-semibold text-aurora-text">Zero Persistent Tracking</h4>
              <p className="text-[11px] text-aurora-muted mt-0.5 leading-relaxed">
                No external analytics, ad tracking pixels, or third-party telemetry scripts are installed. Verify network activity in DevTools Network tab.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-aurora-input border border-aurora-border/60 flex items-start gap-3">
            <EyeOff className="w-4 h-4 text-aurora-warning flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-semibold text-aurora-text">Volatile Session Memory</h4>
              <p className="text-[11px] text-aurora-muted mt-0.5 leading-relaxed">
                Clicking the <strong>"Clear Data"</strong> button flushes volatile memory buffers and resets state.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-aurora-border/70 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-aurora-primary">
            <CheckCircle className="w-4 h-4" />
            <span>Audit Verified (Local Host)</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-aurora-primary text-aurora-bg hover:bg-aurora-primary-hover shadow-sm transition-all cursor-pointer"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};

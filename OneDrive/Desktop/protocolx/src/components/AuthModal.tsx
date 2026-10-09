import React from 'react';
import { X, User, Check, Shield, Sparkles } from 'lucide-react';
import { UserProfile } from '../types';
import { GUEST_USER, DEMO_REGISTERED_USER } from '../services/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onSelectUser: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSelectUser,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md bg-aurora-surface border border-aurora-border rounded-3xl shadow-2xl p-6 relative">
        <div className="flex items-center justify-between pb-3 border-b border-aurora-border">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-aurora-primary/15 text-aurora-primary">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-aurora-text">Account & Identity</h3>
              <p className="text-xs text-aurora-muted">Choose your session profile</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-aurora-muted hover:text-aurora-text hover:bg-aurora-elevated transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {/* Option A: Guest Mode */}
          <div
            onClick={() => {
              onSelectUser(GUEST_USER);
              onClose();
            }}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              currentUser.isGuest
                ? 'bg-aurora-primary/15 border-aurora-primary/60 shadow-sm'
                : 'bg-aurora-input border-aurora-border/60 hover:border-aurora-primary/40'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-aurora-text flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-aurora-primary" />
                Guest User (Default)
              </span>
              {currentUser.isGuest && <Check className="w-4 h-4 text-aurora-primary" />}
            </div>
            <p className="text-[11px] text-aurora-muted leading-relaxed">
              No account required. All processing and summaries are kept strictly in local browser memory and IndexedDB.
            </p>
          </div>

          {/* Option B: Registered Profile */}
          <div
            onClick={() => {
              onSelectUser(DEMO_REGISTERED_USER);
              onClose();
            }}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              !currentUser.isGuest
                ? 'bg-aurora-secondary/15 border-aurora-secondary/60 shadow-sm'
                : 'bg-aurora-input border-aurora-border/60 hover:border-aurora-secondary/40'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-aurora-text flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-aurora-secondary" />
                Alex Chen (Registered User)
              </span>
              {!currentUser.isGuest && <Check className="w-4 h-4 text-aurora-secondary" />}
            </div>
            <p className="text-[11px] text-aurora-muted leading-relaxed">
              Persistent cloud-sync enabled, custom alert rules, and saved summaries organized by workspaces.
            </p>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-aurora-border flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-aurora-elevated text-aurora-text hover:bg-aurora-border/40 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

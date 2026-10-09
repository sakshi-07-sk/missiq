import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { ShieldAlert, Server, Activity, ArrowLeft, Lock } from 'lucide-react';

export const AdminLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-aurora-bg text-aurora-text flex flex-col font-sans selection:bg-aurora-primary selection:text-aurora-bg">
      {/* Top Admin Header */}
      <header className="h-16 border-b border-aurora-border/70 bg-aurora-surface/90 backdrop-blur-xl px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-aurora-elevated text-aurora-primary border border-aurora-border">
            <ShieldAlert className="w-5 h-5 text-aurora-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-aurora-text tracking-tight">MissIQ Operations Console</span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-aurora-elevated text-aurora-primary border border-aurora-primary/30">
                ADMIN RESTRICTED
              </span>
            </div>
            <p className="text-[11px] text-aurora-muted">System telemetry, error diagnostics & provider management</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-aurora-input border border-aurora-border text-xs font-mono text-aurora-muted">
            <Lock className="w-3.5 h-3.5 text-aurora-primary" />
            <span>Zero Content Leak Verified</span>
          </div>

          <Link
            to="/app"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-aurora-elevated hover:bg-aurora-surface text-aurora-text transition-colors border border-aurora-border"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to App</span>
          </Link>
        </div>
      </header>

      {/* Main Admin Dashboard */}
      <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full">
        <Outlet />
      </main>
    </div>
  );
};

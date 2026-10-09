import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Shield } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Isolated client-side error catch - NO PII or chat content logged
    console.error('MissIQ Application Error Boundary caught an exception:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  private handleClearStorageAndReset = () => {
    try {
      sessionStorage.clear();
      // Keep theme but clear corrupt session state
      const theme = localStorage.getItem('missiq_theme');
      localStorage.clear();
      if (theme) localStorage.setItem('missiq_theme', theme);
    } catch {
      // Ignore
    }
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-aurora-bg text-aurora-text flex items-center justify-center p-4 font-sans">
          <div className="max-w-md w-full p-8 rounded-3xl bg-aurora-surface border border-aurora-border shadow-2xl space-y-6 text-center animate-fade-in">
            <div className="w-14 h-14 rounded-2xl bg-aurora-error/15 border border-aurora-error/30 mx-auto flex items-center justify-center text-aurora-error">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-extrabold text-aurora-text tracking-tight">
                Temporary Render Glitch
              </h2>
              <p className="text-xs text-aurora-muted leading-relaxed">
                MissIQ’s local-first engine intercepted a runtime rendering exception. Your chat messages and session memory remain isolated and safe.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 rounded-xl bg-aurora-input border border-aurora-border text-left">
                <span className="text-[10px] font-mono text-aurora-muted uppercase block mb-1">Diagnostic:</span>
                <p className="text-xs font-mono text-aurora-error break-words">
                  {this.state.error.message || 'Unknown runtime error'}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={this.handleReset}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold aurora-btn-primary shadow-md cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reload View</span>
              </button>

              <button
                onClick={this.handleClearStorageAndReset}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-aurora-elevated border border-aurora-border text-aurora-text hover:bg-aurora-border/40 transition-colors cursor-pointer"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Reset to Home</span>
              </button>
            </div>

            <div className="pt-2 border-t border-aurora-border flex items-center justify-center gap-1.5 text-[11px] font-mono text-aurora-primary">
              <Shield className="w-3.5 h-3.5" />
              <span>Zero Leakage Protected Sandbox</span>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

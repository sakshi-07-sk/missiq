import React from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  Trash2, 
  History, 
  Settings, 
  LayoutDashboard, 
  PenTool, 
  Home, 
  Server,
  Lock
} from 'lucide-react';

interface NavbarProps {
  activeScreen: 'landing' | 'workspace' | 'dashboard' | 'settings';
  setActiveScreen: (screen: 'landing' | 'workspace' | 'dashboard' | 'settings') => void;
  hasAnalysis: boolean;
  backendOnline: boolean;
  preferBackend: boolean;
  onClearSession: () => void;
  onOpenPrivacy: () => void;
  onOpenHistory: () => void;
  historyCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeScreen,
  setActiveScreen,
  hasAnalysis,
  backendOnline,
  preferBackend,
  onClearSession,
  onOpenPrivacy,
  onOpenHistory,
  historyCount,
}) => {
  return (
    <header className="sticky top-0 z-30 border-b border-navy-800/80 bg-[#070D19]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div 
          onClick={() => setActiveScreen('landing')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 via-teal-500 to-cyan-500 shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-navy-950" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-400"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-white flex items-center">
                Miss<span className="text-teal-400">IQ</span>
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/20">
                v1.0
              </span>
            </div>
            <p className="text-[11px] text-teal-400/80 font-medium hidden sm:block">
              Never Miss What Matters
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-navy-900/80 p-1 rounded-xl border border-navy-800">
          <button
            onClick={() => setActiveScreen('landing')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeScreen === 'landing'
                ? 'bg-teal-600/20 text-teal-300 border border-teal-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>

          <button
            onClick={() => setActiveScreen('workspace')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeScreen === 'workspace'
                ? 'bg-teal-600/20 text-teal-300 border border-teal-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>Workspace</span>
          </button>

          {hasAnalysis && (
            <button
              onClick={() => setActiveScreen('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeScreen === 'dashboard'
                  ? 'bg-teal-600/20 text-teal-300 border border-teal-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>
          )}

          <button
            onClick={() => setActiveScreen('settings')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeScreen === 'settings'
                ? 'bg-teal-600/20 text-teal-300 border border-teal-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Settings</span>
          </button>
        </nav>

        {/* Right Action Icons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Engine Status Badge */}
          <div
            className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium border ${
              backendOnline && preferBackend
                ? 'bg-teal-500/10 text-teal-300 border-teal-500/25'
                : 'bg-cyan-500/10 text-cyan-300 border-cyan-500/25'
            }`}
            title={backendOnline && preferBackend ? 'FastAPI Backend Connected' : '100% On-Device Client Engine'}
          >
            {backendOnline && preferBackend ? (
              <>
                <Server className="w-3 h-3 text-teal-400" />
                <span>FastAPI Active</span>
              </>
            ) : (
              <>
                <Lock className="w-3 h-3 text-cyan-400" />
                <span>On-Device Engine</span>
              </>
            )}
          </div>

          {/* Privacy badge */}
          <button
            onClick={onOpenPrivacy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-teal-500/10 text-teal-300 border border-teal-500/25 hover:bg-teal-500/20 transition-all cursor-pointer"
            title="Privacy status & disclosure"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            <span className="hidden sm:inline">Local-First</span>
          </button>

          {/* Local History Drawer */}
          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-navy-900 border border-navy-800 text-slate-300 hover:text-teal-300 hover:border-teal-500/30 transition-colors"
            title="View saved history from browser IndexedDB"
          >
            <History className="w-3.5 h-3.5 text-teal-400" />
            <span className="hidden sm:inline">History</span>
            {historyCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-teal-500/20 text-teal-300 font-mono">
                {historyCount}
              </span>
            )}
          </button>

          {/* Clear Session Data */}
          {hasAnalysis && (
            <button
              onClick={onClearSession}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-medium bg-rose-500/10 text-rose-300 border border-rose-500/20 hover:bg-rose-500/20 transition-colors"
              title="Wipe current conversation from memory"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden md:inline ml-1">Wipe Session</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

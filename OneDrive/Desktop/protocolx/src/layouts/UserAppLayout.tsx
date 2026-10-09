import React from 'react';
import { NavLink, Link, Outlet, useLocation } from 'react-router-dom';
import { 
  Sparkles, 
  LayoutDashboard, 
  PenTool, 
  CheckSquare, 
  History, 
  Settings, 
  ShieldCheck, 
  Trash2, 
  User, 
  ArrowLeft,
  Lock,
  Server,
  Calendar,
  LogOut,
  Sun,
  Moon
} from 'lucide-react';
import { UserProfile } from '../types';
import { useTheme } from '../context/ThemeContext';

interface UserAppLayoutProps {
  currentUser: UserProfile;
  hasAnalysis: boolean;
  backendOnline: boolean;
  onClearSession: () => void;
  onOpenPrivacy: () => void;
  onOpenAuth: () => void;
  onSignOut: () => void;
  historyCount: number;
}

export const UserAppLayout: React.FC<UserAppLayoutProps> = ({
  currentUser,
  hasAnalysis,
  backendOnline,
  onClearSession,
  onOpenPrivacy,
  onOpenAuth,
  onSignOut,
  historyCount,
}) => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { to: '/app', label: 'Overview', icon: LayoutDashboard, exact: true },
    { to: '/app/analyze', label: 'New Analysis', icon: PenTool },
    { to: '/app/tasks', label: 'Action Items', icon: CheckSquare },
    { to: '/app/history', label: 'Saved Summaries', icon: History, badge: historyCount },
    { to: '/app/calendar', label: 'Deadlines', icon: Calendar },
    { to: '/app/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-aurora-bg text-aurora-text flex font-sans selection:bg-aurora-primary selection:text-aurora-bg">
      {/* 1. DEEP TEAL SIDEBAR WITH RESTRAINED MINT INDICATOR */}
      <aside className="hidden md:flex flex-col w-64 border-r border-aurora-border/70 bg-aurora-surface h-screen sticky top-0 z-30 p-4 justify-between">
        <div className="space-y-6">
          {/* Top Brand Mark */}
          <div className="flex items-center justify-between px-2 pt-1">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-xl bg-aurora-primary text-aurora-bg flex items-center justify-center shadow-md shadow-aurora-primary/25 group-hover:scale-105 transition-transform font-bold">
                <Sparkles className="w-4 h-4 text-aurora-bg" />
              </div>
              <span className="text-base font-bold tracking-tight text-aurora-text">
                Miss<span className="text-aurora-primary">IQ</span>
              </span>
            </Link>

            <Link
              to="/"
              className="p-1 rounded-lg text-aurora-muted hover:text-aurora-text transition-colors text-xs flex items-center gap-1"
              title="Return to Landing Page"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.exact}
                  className={({ isActive }) => `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-aurora-primary/15 text-aurora-primary border border-aurora-primary/30 font-bold shadow-sm'
                      : 'text-aurora-muted hover:text-aurora-text hover:bg-aurora-elevated'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-aurora-elevated text-aurora-primary border border-aurora-border">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom User Profile & Privacy Status */}
        <div className="space-y-3 pt-4 border-t border-aurora-border/70">
          {/* User Profile Tile */}
          <div className="p-2.5 rounded-xl bg-aurora-elevated border border-aurora-border flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-aurora-primary text-aurora-bg flex items-center justify-center font-bold text-xs">
                {currentUser.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-aurora-text truncate">{currentUser.name}</div>
                <div className="text-[10px] text-aurora-muted truncate">
                  {currentUser.isGuest ? 'Guest Session' : 'Registered Profile'}
                </div>
              </div>
            </div>

            {!currentUser.isGuest ? (
              <button
                onClick={onSignOut}
                className="p-1 rounded-lg text-aurora-muted hover:text-aurora-error transition-colors cursor-pointer"
                title="Sign out of account"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="p-1 rounded-lg text-aurora-muted hover:text-aurora-text cursor-pointer"
                title="Sign in or register"
              >
                <User className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Privacy Status Indicator */}
          <button
            onClick={onOpenPrivacy}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-[11px] font-medium bg-aurora-input border border-aurora-border text-aurora-muted hover:text-aurora-primary transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-aurora-primary" />
              <span>Local Privacy Active</span>
            </span>
            <Lock className="w-3 h-3 text-aurora-muted" />
          </button>
        </div>
      </aside>

      {/* 2. MAIN APPLICATION CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Command Bar */}
        <header className="h-14 border-b border-aurora-border/70 bg-aurora-surface/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <Link to="/" className="md:hidden flex items-center gap-1 text-xs font-bold text-aurora-text">
              <Sparkles className="w-4 h-4 text-aurora-primary" />
              <span>MissIQ</span>
            </Link>

            <span className="text-xs text-aurora-muted font-mono hidden sm:inline">
              WORKSPACE · {currentUser.isGuest ? 'GUEST ENVIRONMENT' : 'REGISTERED ACCOUNT'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono border bg-aurora-input border-aurora-border text-aurora-muted">
              {backendOnline ? (
                <>
                  <Server className="w-3 h-3 text-aurora-success" />
                  <span className="text-aurora-success">FastAPI Online</span>
                </>
              ) : (
                <>
                  <Lock className="w-3 h-3 text-aurora-primary" />
                  <span className="text-aurora-primary">Local Engine Active</span>
                </>
              )}
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-lg text-aurora-muted hover:text-aurora-text bg-aurora-input border border-aurora-border hover:border-aurora-primary/40 transition-colors cursor-pointer"
              title={theme === 'dark' ? 'Switch to Light Background' : 'Switch to Dark Arctic Aurora'}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-aurora-warning" />
              ) : (
                <Moon className="w-4 h-4 text-aurora-primary" />
              )}
            </button>

            {hasAnalysis && (
              <button
                onClick={onClearSession}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-aurora-error bg-aurora-error/10 border border-aurora-error/20 hover:bg-aurora-error/20 transition-colors cursor-pointer"
                title="Wipe volatile session state"
              >
                <Trash2 className="w-3 h-3" />
                <span className="hidden sm:inline">Clear Session</span>
              </button>
            )}
          </div>
        </header>

        {/* Dynamic Route Content */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-20 md:pb-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

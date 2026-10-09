import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, User, Sun, Moon } from 'lucide-react';
import { UserProfile } from '../types';
import { useTheme } from '../context/ThemeContext';

interface PublicLayoutProps {
  currentUser: UserProfile;
  onOpenAuth: () => void;
  onOpenPrivacy: () => void;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({
  currentUser,
  onOpenAuth,
  onOpenPrivacy,
}) => {
  const { theme, toggleTheme } = useTheme();
  return (
    <div className="min-h-screen bg-aurora-bg text-aurora-text flex flex-col font-sans selection:bg-aurora-primary selection:text-aurora-bg">
      {/* Sticky Translucent Arctic Aurora Navigation */}
      <header className="sticky top-0 z-40 border-b border-aurora-border/70 bg-aurora-bg/85 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Wordmark */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-aurora-primary to-aurora-secondary flex items-center justify-center shadow-lg shadow-aurora-primary/25 group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4 text-aurora-bg" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold tracking-tight text-aurora-text">
                Miss<span className="text-aurora-primary">IQ</span>
              </span>
              <span className="hidden sm:inline text-[11px] font-medium text-aurora-muted">
                Never Miss What Matters
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-aurora-muted">
            <a href="#features" className="hover:text-aurora-text transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-aurora-text transition-colors">How It Works</a>
            <button onClick={onOpenPrivacy} className="hover:text-aurora-text transition-colors cursor-pointer">
              Privacy
            </button>
            <Link to="/demo" className="hover:text-aurora-primary transition-colors">
              Try Demo
            </Link>
            <Link to="/admin" className="hover:text-aurora-secondary transition-colors">
              Admin Console
            </Link>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Switcher Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-aurora-muted hover:text-aurora-text bg-aurora-surface border border-aurora-border hover:border-aurora-primary/40 transition-colors cursor-pointer"
              title={theme === 'dark' ? 'Switch to Light Background' : 'Switch to Dark Arctic Aurora'}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-aurora-warning" />
              ) : (
                <Moon className="w-4 h-4 text-aurora-primary" />
              )}
            </button>

            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-aurora-muted hover:text-aurora-text bg-aurora-surface border border-aurora-border transition-colors cursor-pointer"
            >
              <User className="w-3.5 h-3.5" />
              <span>{currentUser.isGuest ? 'Sign In' : currentUser.name}</span>
            </button>

            <Link
              to="/demo"
              className="hidden sm:inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-medium text-aurora-text bg-aurora-surface border border-aurora-border hover:border-aurora-primary/50 transition-colors"
            >
              <span>Explore Demo</span>
            </Link>

            <Link
              to="/app"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-aurora-primary text-aurora-bg hover:bg-aurora-primary-hover shadow-md shadow-aurora-primary/20 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Start Catching Up</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-aurora-border/70 bg-aurora-surface/60 py-10 text-xs text-aurora-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="font-bold text-aurora-text">MissIQ</span>
            <span>—</span>
            <span>AI-Powered Conversation Intelligence. Never Miss What Matters.</span>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={onOpenPrivacy} className="hover:text-aurora-text transition-colors cursor-pointer">
              Privacy Architecture
            </button>
            <Link to="/demo" className="hover:text-aurora-primary transition-colors">
              Guest Sandbox
            </Link>
            <Link to="/app" className="hover:text-aurora-text transition-colors">
              Open Workspace
            </Link>
            <Link to="/admin" className="hover:text-aurora-secondary transition-colors">
              Admin Portal
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

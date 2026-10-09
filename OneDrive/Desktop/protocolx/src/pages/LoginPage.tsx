import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, Eye, EyeOff, ShieldCheck, ArrowRight, AlertCircle, KeyRound, UserCheck } from 'lucide-react';
import { loginApi } from '../services/authApi';
import { UserProfile } from '../types';

interface LoginPageProps {
  onAuthSuccess: (user: UserProfile) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onAuthSuccess }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/app';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await loginApi(email, password);
      onAuthSuccess(result.user);
      if (result.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(from, { replace: true });
      }
    } catch (err: any) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoUser = async (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setIsLoading(true);
    try {
      const result = await loginApi(demoEmail, demoPass);
      onAuthSuccess(result.user);
      if (result.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(from, { replace: true });
      }
    } catch (err: any) {
      setError(err.message || 'Quick login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-aurora-bg flex font-sans selection:bg-aurora-primary selection:text-aurora-bg">
      {/* LEFT COLUMN: Arctic Aurora Branding & Evaluator Shortcuts */}
      <div className="hidden lg:flex lg:w-1/2 bg-aurora-surface border-r border-aurora-border/70 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-aurora-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div>
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-aurora-primary text-aurora-bg flex items-center justify-center font-bold shadow-md shadow-aurora-primary/25">
              <Sparkles className="w-4 h-4 text-aurora-bg" />
            </div>
            <span className="text-xl font-bold tracking-tight text-aurora-text">
              Miss<span className="text-aurora-primary">IQ</span>
            </span>
          </Link>
        </div>

        <div className="max-w-md space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-aurora-elevated border border-aurora-border text-aurora-primary text-xs font-semibold">
            <UserCheck className="w-3.5 h-3.5 text-aurora-primary" />
            <span>AUTHENTICATED WORKSPACE</span>
          </div>

          <h2 className="text-4xl font-extrabold text-aurora-text leading-tight">
            Welcome back.<br />
            <span className="aurora-gradient-text">Let's catch you up.</span>
          </h2>

          <p className="text-sm text-aurora-muted leading-relaxed">
            Your summaries, decisions, and next steps are waiting. Sign in to access your persistent archive.
          </p>

          <div className="p-4 rounded-2xl bg-aurora-input border border-aurora-border space-y-2">
            <span className="text-[10px] font-mono tracking-wider text-aurora-muted uppercase font-bold">1-Click Evaluation Credentials</span>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleQuickDemoUser('alex@innovate.io', 'Password123!')}
                className="p-2.5 rounded-xl bg-aurora-surface hover:bg-aurora-elevated border border-aurora-border text-left text-xs text-aurora-text transition-colors cursor-pointer"
              >
                <div className="font-bold text-aurora-primary">Alex Chen</div>
                <div className="text-[10px] text-aurora-muted">Registered User</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoUser('admin@missiq.ai', 'Admin@MissIQ2026!')}
                className="p-2.5 rounded-xl bg-aurora-surface hover:bg-aurora-elevated border border-aurora-border text-left text-xs text-aurora-text transition-colors cursor-pointer"
              >
                <div className="font-bold text-aurora-secondary">Admin Console</div>
                <div className="text-[10px] text-aurora-muted">Platform Admin</div>
              </button>
            </div>
          </div>
        </div>

        <div className="text-xs text-aurora-muted">
          © 2026 MissIQ. Never Miss What Matters.
        </div>
      </div>

      {/* RIGHT COLUMN: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="w-full max-w-md space-y-7">
          {/* Mobile brand header */}
          <div className="lg:hidden">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-7 h-7 rounded-lg bg-aurora-primary flex items-center justify-center font-bold">
                <Sparkles className="w-3.5 h-3.5 text-aurora-bg" />
              </div>
              <span className="text-lg font-bold text-aurora-text">MissIQ</span>
            </Link>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-aurora-text tracking-tight">
              Sign in to MissIQ
            </h1>
            <p className="text-xs text-aurora-muted mt-1">
              Enter your credentials to access your saved summaries.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-2xl bg-aurora-error/15 border border-aurora-error/30 text-aurora-error text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-aurora-text mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@innovate.io"
                className="w-full px-4 py-2.5 text-xs bg-aurora-input border border-aurora-border rounded-xl text-aurora-text placeholder-aurora-muted/70 focus:outline-none focus:border-aurora-primary transition-colors"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-aurora-text">
                  Password
                </label>
                <Link to="/forgot-password" className="text-[11px] text-aurora-primary hover:underline">
                  Forgot password?
                </Link>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-4 py-2.5 pr-10 text-xs bg-aurora-input border border-aurora-border rounded-xl text-aurora-text placeholder-aurora-muted/70 focus:outline-none focus:border-aurora-primary transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-aurora-muted hover:text-aurora-text cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl font-bold text-xs bg-aurora-primary text-aurora-bg hover:bg-aurora-primary-hover shadow-md shadow-aurora-primary/25 transition-all transform hover:-translate-y-0.5 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span>Verifying credentials...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Pre-fill for mobile viewports */}
          <div className="lg:hidden p-3.5 rounded-xl bg-aurora-surface border border-aurora-border space-y-2">
            <span className="text-[10px] font-mono text-aurora-muted uppercase font-bold">1-Click Test Access:</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoUser('alex@innovate.io', 'Password123!')}
                className="flex-1 py-1.5 rounded-lg bg-aurora-elevated text-xs font-semibold text-aurora-primary border border-aurora-border"
              >
                Alex Chen
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoUser('admin@missiq.ai', 'Admin@MissIQ2026!')}
                className="flex-1 py-1.5 rounded-lg bg-aurora-elevated text-xs font-semibold text-aurora-secondary border border-aurora-border"
              >
                Admin
              </button>
            </div>
          </div>

          <div className="text-center text-xs text-aurora-muted">
            Don't have an account?{' '}
            <Link to="/signup" className="text-aurora-primary hover:underline font-semibold">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

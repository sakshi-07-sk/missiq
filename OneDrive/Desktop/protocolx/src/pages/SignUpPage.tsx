import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Eye, EyeOff, ShieldCheck, ArrowRight, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { registerApi } from '../services/authApi';
import { UserProfile } from '../types';

interface SignUpPageProps {
  onAuthSuccess: (user: UserProfile) => void;
}

export const SignUpPage: React.FC<SignUpPageProps> = ({ onAuthSuccess }) => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) {
      setError('Please provide your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!termsAccepted) {
      setError('Please accept the Terms of Service & Privacy Policy.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await registerApi(fullName, email, password);
      onAuthSuccess(result.user);
      navigate('/app');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please check your information.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-aurora-bg flex font-sans selection:bg-aurora-primary selection:text-aurora-bg">
      {/* LEFT COLUMN: Arctic Aurora Branding & Pitch */}
      <div className="hidden lg:flex lg:w-1/2 bg-aurora-surface border-r border-aurora-border/70 p-12 flex-col justify-between relative overflow-hidden">
        {/* Ambient mint radial glow */}
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
            <ShieldCheck className="w-3.5 h-3.5 text-aurora-primary" />
            <span>ARCTIC AURORA PRIVACY</span>
          </div>

          <h2 className="text-4xl font-extrabold text-aurora-text leading-tight">
            Your conversations.<br />
            <span className="aurora-gradient-text">Finally under control.</span>
          </h2>

          <p className="text-sm text-aurora-muted leading-relaxed">
            Create your MissIQ account to save summaries, organize action items, and revisit important updates across sessions.
          </p>

          <div className="space-y-3 pt-2 text-xs text-aurora-text">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-aurora-primary" />
              <span>Prioritized action items and strict deadline extraction</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-aurora-primary" />
              <span>Verified quotes linked directly to every decision</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-aurora-primary" />
              <span>Zero third-party tracking or model training on private messages</span>
            </div>
          </div>
        </div>

        <div className="text-xs text-aurora-muted">
          © 2026 MissIQ. Never Miss What Matters.
        </div>
      </div>

      {/* RIGHT COLUMN: Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="w-full max-w-md space-y-7">
          {/* Mobile brand header */}
          <div className="lg:hidden">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-7 h-7 rounded-lg bg-aurora-primary flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-aurora-bg" />
              </div>
              <span className="text-lg font-bold text-aurora-text">MissIQ</span>
            </Link>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-aurora-text tracking-tight">
              Create your account
            </h1>
            <p className="text-xs text-aurora-muted mt-1">
              Start catching up in seconds. Or{' '}
              <Link to="/demo" className="text-aurora-primary hover:underline font-semibold">
                try the guest sandbox
              </Link>{' '}
              without an account.
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
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Alex Chen"
                className="w-full px-4 py-2.5 text-xs bg-aurora-input border border-aurora-border rounded-xl text-aurora-text placeholder-aurora-muted/70 focus:outline-none focus:border-aurora-primary transition-colors"
                required
              />
            </div>

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
              <label className="block text-xs font-semibold text-aurora-text mb-1.5">
                Password (min. 8 characters)
              </label>
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

            <div>
              <label className="block text-xs font-semibold text-aurora-text mb-1.5">
                Confirm Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-2.5 text-xs bg-aurora-input border border-aurora-border rounded-xl text-aurora-text placeholder-aurora-muted/70 focus:outline-none focus:border-aurora-primary transition-colors"
                required
              />
            </div>

            <div className="pt-1">
              <label className="flex items-start gap-2.5 text-xs text-aurora-muted cursor-pointer">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 accent-[#45E0C1] rounded"
                />
                <span>
                  I agree to the Terms of Service and acknowledge the zero-leak Privacy Architecture.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl font-bold text-xs bg-aurora-primary text-aurora-bg hover:bg-aurora-primary-hover shadow-md shadow-aurora-primary/25 transition-all transform hover:-translate-y-0.5 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span>Creating Account...</span>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center text-xs text-aurora-muted">
            Already have an account?{' '}
            <Link to="/login" className="text-aurora-primary hover:underline font-semibold">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

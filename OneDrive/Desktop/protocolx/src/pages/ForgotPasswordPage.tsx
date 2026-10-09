import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowLeft, KeyRound, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { forgotPasswordApi, resetPasswordApi } from '../services/authApi';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isResetDone, setIsResetDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRequestToken = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const token = await forgotPasswordApi(email);
      setResetToken(token);
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to process request.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await resetPasswordApi(resetToken, newPassword);
      setIsResetDone(true);
    } catch (err: any) {
      setError(err.message || 'Password reset failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-aurora-bg flex items-center justify-center p-6 font-sans selection:bg-aurora-primary selection:text-aurora-bg relative">
      <div className="w-full max-w-md p-8 rounded-3xl bg-aurora-surface border border-aurora-border shadow-glow-mint space-y-6">
        <div>
          <Link to="/login" className="inline-flex items-center gap-1.5 text-xs text-aurora-muted hover:text-aurora-text mb-4">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Sign In</span>
          </Link>

          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-xl bg-aurora-elevated text-aurora-primary flex items-center justify-center">
              <KeyRound className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-aurora-text">Reset Password</h1>
          </div>

          <p className="text-xs text-aurora-muted leading-relaxed">
            Enter your account email to generate a secure recovery token.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-2xl bg-aurora-error/15 border border-aurora-error/30 text-aurora-error text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {isResetDone ? (
          <div className="p-6 rounded-2xl bg-aurora-primary/10 border border-aurora-primary/30 text-center space-y-3">
            <CheckCircle2 className="w-8 h-8 text-aurora-primary mx-auto" />
            <h3 className="text-sm font-bold text-aurora-text">Password Updated Successfully</h3>
            <p className="text-xs text-aurora-muted">
              Your password has been changed securely. You may now sign in with your new credentials.
            </p>
            <div className="pt-2">
              <Link
                to="/login"
                className="px-6 py-2.5 rounded-xl font-bold text-xs bg-aurora-primary text-aurora-bg hover:bg-aurora-primary-hover inline-block transition-colors"
              >
                Sign In Now →
              </Link>
            </div>
          </div>
        ) : !submitted ? (
          <form onSubmit={handleRequestToken} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-aurora-text mb-1.5">
                Account Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@innovate.io"
                className="w-full px-4 py-2.5 text-xs bg-aurora-input border border-aurora-border rounded-xl text-aurora-text placeholder-aurora-muted/70 focus:outline-none focus:border-aurora-primary"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl font-bold text-xs bg-aurora-primary text-aurora-bg hover:bg-aurora-primary-hover shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoading ? 'Generating token...' : 'Send Recovery Token'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="p-3 rounded-xl bg-aurora-input border border-aurora-border text-xs text-aurora-primary font-mono">
              Recovery token: {resetToken}
            </div>

            <div>
              <label className="block text-xs font-semibold text-aurora-text mb-1.5">
                New Password (min. 8 chars)
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-2.5 text-xs bg-aurora-input border border-aurora-border rounded-xl text-aurora-text placeholder-aurora-muted/70 focus:outline-none focus:border-aurora-primary"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl font-bold text-xs bg-aurora-primary text-aurora-bg hover:bg-aurora-primary-hover shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoading ? 'Updating...' : 'Set New Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

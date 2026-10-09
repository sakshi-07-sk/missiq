import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, Lock, ArrowRight, AlertCircle, ArrowLeft } from 'lucide-react';
import { loginApi } from '../services/authApi';
import { setAdminToken } from '../services/auth';
import { UserProfile } from '../types';

interface AdminLoginPageProps {
  onAdminAuthSuccess: (user: UserProfile) => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onAdminAuthSuccess }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@missiq.ai');
  const [password, setPassword] = useState('Admin@MissIQ2026!');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await loginApi(email, password);
      if (result.user.role !== 'admin') {
        setError('Forbidden: This account does not possess administrator privileges.');
        setIsLoading(false);
        return;
      }
      setAdminToken(result.token);
      onAdminAuthSuccess(result.user);
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Invalid administrator credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-aurora-bg flex items-center justify-center p-6 font-sans selection:bg-aurora-primary selection:text-aurora-bg">
      <div className="w-full max-w-md p-8 rounded-3xl bg-aurora-surface border border-aurora-border shadow-2xl space-y-6">
        <div>
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-aurora-muted hover:text-aurora-text mb-4">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Public Site</span>
          </Link>

          <div className="flex items-center gap-2.5 mb-2">
            <div className="p-2 rounded-xl bg-aurora-elevated text-aurora-primary border border-aurora-border">
              <ShieldAlert className="w-5 h-5 text-aurora-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-aurora-text">Operations Console Login</h1>
              <span className="text-[10px] font-mono font-bold text-aurora-primary uppercase">
                ADMIN RESTRICTED
              </span>
            </div>
          </div>

          <p className="text-xs text-aurora-muted leading-relaxed mt-2">
            Restricted access for platform administrators and system telemetry operators.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-2xl bg-aurora-error/15 border border-aurora-error/30 text-aurora-error text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-aurora-text mb-1.5">
              Admin Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 text-xs bg-aurora-input border border-aurora-border rounded-xl text-aurora-text placeholder-aurora-muted/70 focus:outline-none focus:border-aurora-primary"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-aurora-text mb-1.5">
              Admin Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 text-xs bg-aurora-input border border-aurora-border rounded-xl text-aurora-text placeholder-aurora-muted/70 focus:outline-none focus:border-aurora-primary"
              required
            />
          </div>

          <div className="p-3 rounded-xl bg-aurora-input border border-aurora-border text-[11px] text-aurora-muted">
            <div className="font-bold text-aurora-text mb-0.5">Demo Admin Credentials:</div>
            <div>Email: <code className="text-aurora-primary">admin@missiq.ai</code></div>
            <div>Password: <code className="text-aurora-primary">Admin@MissIQ2026!</code></div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl font-bold text-xs bg-aurora-primary text-aurora-bg hover:bg-aurora-primary-hover shadow-md shadow-aurora-primary/25 transition-all transform hover:-translate-y-0.5 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Access Operations Console</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

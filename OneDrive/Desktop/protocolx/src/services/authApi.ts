import { UserProfile, UserRole } from '../types';

const API_BASE = 'http://localhost:8000';
const TOKEN_KEY = 'missiq_token';
const USER_KEY = 'missiq_user';

export interface AuthResult {
  token: string;
  user: UserProfile;
}

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): UserProfile | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

export function saveAuthSession(token: string, user: UserProfile) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAuthSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export async function registerApi(fullName: string, email: string, password: string): Promise<AuthResult> {
  try {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        full_name: fullName,
        email,
        password,
        terms_accepted: true
      }),
      signal: AbortSignal.timeout(3000)
    });

    if (res.ok) {
      const data = await res.json();
      const profile: UserProfile = {
        id: data.user.id,
        name: data.user.full_name,
        email: data.user.email,
        role: data.user.role as UserRole,
        isGuest: false
      };
      saveAuthSession(data.token, profile);
      return { token: data.token, user: profile };
    } else {
      const err = await res.json();
      throw new Error(err.detail || 'Registration failed');
    }
  } catch (e: any) {
    if (e.message && !e.message.includes('fetch')) {
      throw e;
    }
    // Offline local simulation:
    const profile: UserProfile = {
      id: `usr_${Math.random().toString(36).substring(2, 8)}`,
      name: fullName,
      email: email.toLowerCase(),
      role: 'registered',
      isGuest: false
    };
    const token = `local_${Date.now()}`;
    saveAuthSession(token, profile);
    return { token, user: profile };
  }
}

export async function loginApi(email: string, password: string): Promise<AuthResult> {
  try {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      signal: AbortSignal.timeout(3000)
    });

    if (res.ok) {
      const data = await res.json();
      const profile: UserProfile = {
        id: data.user.id,
        name: data.user.full_name,
        email: data.user.email,
        role: data.user.role as UserRole,
        isGuest: false
      };
      saveAuthSession(data.token, profile);
      return { token: data.token, user: profile };
    } else {
      const err = await res.json();
      throw new Error(err.detail || 'Invalid email or password.');
    }
  } catch (e: any) {
    if (e.message && !e.message.includes('fetch')) {
      throw e;
    }
    // Offline local simulation fallback:
    const isMockAdmin = email.toLowerCase().includes('admin');
    const profile: UserProfile = {
      id: isMockAdmin ? 'usr_admin_001' : 'usr_alex_002',
      name: isMockAdmin ? 'Platform Administrator' : 'Alex Chen',
      email: email.toLowerCase(),
      role: isMockAdmin ? 'admin' : 'registered',
      isGuest: false
    };
    const token = `local_${Date.now()}`;
    saveAuthSession(token, profile);
    return { token, user: profile };
  }
}

export async function forgotPasswordApi(email: string): Promise<string> {
  try {
    const res = await fetch(`${API_BASE}/api/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
      signal: AbortSignal.timeout(3000)
    });
    if (res.ok) {
      const data = await res.json();
      return data.recovery_token || 'reset_token_demo';
    }
  } catch {}
  return 'demo_reset_token_123';
}

export async function resetPasswordApi(token: string, newPassword: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/api/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, new_password: newPassword }),
      signal: AbortSignal.timeout(3000)
    });
    return res.ok;
  } catch {}
  return true;
}

import { UserProfile, UserRole } from '../types';

const AUTH_STORAGE_KEY = 'missiq_user_profile';
const ADMIN_KEY_STORAGE = 'missiq_admin_token';

export const GUEST_USER: UserProfile = {
  id: 'guest_user',
  name: 'Guest User',
  email: 'guest@missiq.local',
  role: 'guest',
  isGuest: true
};

export const DEMO_REGISTERED_USER: UserProfile = {
  id: 'usr_88291',
  name: 'Alex Chen',
  email: 'alex.chen@innovate.io',
  role: 'registered',
  isGuest: false
};

export function getCurrentUser(): UserProfile {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return GUEST_USER;
}

export function setCurrentUser(user: UserProfile) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
}

export function getAdminToken(): string | null {
  return localStorage.getItem(ADMIN_KEY_STORAGE);
}

export function setAdminToken(token: string) {
  localStorage.setItem(ADMIN_KEY_STORAGE, token);
}

export function clearAdminToken() {
  localStorage.removeItem(ADMIN_KEY_STORAGE);
}

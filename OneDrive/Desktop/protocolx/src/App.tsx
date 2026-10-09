import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { PageLoadingSkeleton } from './components/PageLoadingSkeleton';

import { PublicLayout } from './layouts/PublicLayout';
import { UserAppLayout } from './layouts/UserAppLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Performance Optimization: Route-level code-splitting with React.lazy
const LandingPage = lazy(() => import('./pages/LandingPage').then(m => ({ default: m.LandingPage })));
const WorkspacePage = lazy(() => import('./pages/WorkspacePage').then(m => ({ default: m.WorkspacePage })));
const ActionItemsPage = lazy(() => import('./pages/ActionItemsPage').then(m => ({ default: m.ActionItemsPage })));
const SavedSummariesPage = lazy(() => import('./pages/SavedSummariesPage').then(m => ({ default: m.SavedSummariesPage })));
const SettingsPage = lazy(() => import('./pages/SettingsPage').then(m => ({ default: m.SettingsPage })));
const CalendarPage = lazy(() => import('./pages/CalendarPage').then(m => ({ default: m.CalendarPage })));
const AdminPage = lazy(() => import('./pages/AdminPage').then(m => ({ default: m.AdminPage })));
const SignUpPage = lazy(() => import('./pages/SignUpPage').then(m => ({ default: m.SignUpPage })));
const LoginPage = lazy(() => import('./pages/LoginPage').then(m => ({ default: m.LoginPage })));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage').then(m => ({ default: m.ForgotPasswordPage })));
const AdminLoginPage = lazy(() => import('./pages/AdminLoginPage').then(m => ({ default: m.AdminLoginPage })));
const DemoPage = lazy(() => import('./pages/DemoPage').then(m => ({ default: m.DemoPage })));

import { PrivacyModal } from './components/PrivacyModal';
import { AuthModal } from './components/AuthModal';
import { SourceModal } from './components/SourceModal';

import { getStoredUser, clearAuthSession, saveAuthSession } from './services/authApi';
import { GUEST_USER, DEMO_REGISTERED_USER } from './services/auth';
import { checkBackendHealth } from './services/api';
import { getSavedSessions } from './services/db';
import { CatchUpAnalysis, UserProfile } from './types';

// Route Guard for Registered Users
interface ProtectedRouteProps {
  user: UserProfile;
  children: React.ReactElement;
}

const UserRouteGuard: React.FC<ProtectedRouteProps> = ({ user, children }) => {
  const location = useLocation();
  // Allow registered users or guests who have active session
  if (user.isGuest && !localStorage.getItem('missiq_guest_active')) {
    // If guest clicks directly into /app without demo flag, let them in with guest flag
    localStorage.setItem('missiq_guest_active', 'true');
  }
  return children;
};

// Route Guard for Administrators
const AdminRouteGuard: React.FC<ProtectedRouteProps> = ({ user, children }) => {
  const location = useLocation();
  if (user.role !== 'admin') {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }
  return children;
};

export function App() {
  const [currentUser, setProfile] = useState<UserProfile>(() => {
    return getStoredUser() || GUEST_USER;
  });

  const [analysis, setAnalysis] = useState<CatchUpAnalysis | null>(null);
  const [userName, setUserName] = useState(currentUser.isGuest ? '' : currentUser.name.split(' ')[0]);
  const [preferBackend, setPreferBackend] = useState(true);
  const [summaryLength, setSummaryLength] = useState<'short' | 'detailed'>('detailed');
  const [backendOnline, setBackendOnline] = useState(false);
  const [historyCount, setHistoryCount] = useState(0);

  // Modals
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [sourceModalData, setSourceModalData] = useState<{
    isOpen: boolean;
    messageId: string;
    sender: string;
    excerpt: string;
  }>({
    isOpen: false,
    messageId: '',
    sender: '',
    excerpt: '',
  });

  // Check backend health periodically
  useEffect(() => {
    checkBackendHealth().then(setBackendOnline);
    const interval = setInterval(() => {
      checkBackendHealth().then(setBackendOnline);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Update history count
  const refreshHistoryCount = async () => {
    const list = await getSavedSessions();
    setHistoryCount(list.length);
  };

  useEffect(() => {
    refreshHistoryCount();
  }, [analysis]);

  const handleAuthSuccess = (user: UserProfile) => {
    setProfile(user);
    if (!user.isGuest) {
      setUserName(user.name.split(' ')[0]);
    }
  };

  const handleSignOut = () => {
    clearAuthSession();
    setProfile(GUEST_USER);
    setUserName('');
    setAnalysis(null);
  };

  const handleClearSession = () => {
    setAnalysis(null);
  };

  const handleViewSource = (messageId: string, excerpt: string, sender: string) => {
    setSourceModalData({
      isOpen: true,
      messageId,
      sender,
      excerpt,
    });
  };

  const handleToggleCompleteAction = (id: string) => {
    if (!analysis) return;
    const updated = analysis.actionItems.map(item => item.id === id ? { ...item, completed: !item.completed } : item);
    setAnalysis({ ...analysis, actionItems: updated });
  };

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <BrowserRouter>
          <Suspense fallback={<PageLoadingSkeleton />}>
            <Routes>
        {/* 1. PUBLIC MARKETING WEBSITE ROUTE: / */}
        <Route
          path="/"
          element={
            <PublicLayout
              currentUser={currentUser}
              onOpenAuth={() => setIsAuthModalOpen(true)}
              onOpenPrivacy={() => setIsPrivacyModalOpen(true)}
            />
          }
        >
          <Route index element={<LandingPage onOpenPrivacy={() => setIsPrivacyModalOpen(true)} />} />
        </Route>

        {/* 2. PUBLIC GUEST DEMO ROUTE: /demo */}
        <Route
          path="/demo"
          element={<DemoPage onViewSource={handleViewSource} />}
        />

        {/* 3. AUTHENTICATION ROUTES */}
        <Route
          path="/signup"
          element={<SignUpPage onAuthSuccess={handleAuthSuccess} />}
        />
        <Route
          path="/login"
          element={<LoginPage onAuthSuccess={handleAuthSuccess} />}
        />
        <Route
          path="/forgot-password"
          element={<ForgotPasswordPage />}
        />
        <Route
          path="/admin/login"
          element={<AdminLoginPage onAdminAuthSuccess={handleAuthSuccess} />}
        />

        {/* 4. USER APPLICATION WORKSPACE ROUTES: /app */}
        <Route
          path="/app"
          element={
            <UserRouteGuard user={currentUser}>
              <UserAppLayout
                currentUser={currentUser}
                hasAnalysis={!!analysis}
                backendOnline={backendOnline}
                onClearSession={handleClearSession}
                onOpenPrivacy={() => setIsPrivacyModalOpen(true)}
                onOpenAuth={() => setIsAuthModalOpen(true)}
                onSignOut={handleSignOut}
                historyCount={historyCount}
              />
            </UserRouteGuard>
          }
        >
          <Route
            index
            element={
              <WorkspacePage
                analysis={analysis}
                setAnalysis={setAnalysis}
                userName={userName}
                setUserName={setUserName}
                onClearSession={handleClearSession}
                onViewSource={handleViewSource}
              />
            }
          />
          <Route
            path="analyze"
            element={
              <WorkspacePage
                analysis={analysis}
                setAnalysis={setAnalysis}
                userName={userName}
                setUserName={setUserName}
                onClearSession={handleClearSession}
                onViewSource={handleViewSource}
              />
            }
          />
          <Route
            path="tasks"
            element={
              <ActionItemsPage
                actionItems={analysis?.actionItems || []}
                onToggleComplete={handleToggleCompleteAction}
                onViewSource={handleViewSource}
              />
            }
          />
          <Route
            path="actions"
            element={
              <ActionItemsPage
                actionItems={analysis?.actionItems || []}
                onToggleComplete={handleToggleCompleteAction}
                onViewSource={handleViewSource}
              />
            }
          />
          <Route
            path="history"
            element={
              <SavedSummariesPage
                onRestoreAnalysis={(restored) => setAnalysis(restored)}
                onRefreshCount={refreshHistoryCount}
              />
            }
          />
          <Route
            path="saved"
            element={
              <SavedSummariesPage
                onRestoreAnalysis={(restored) => setAnalysis(restored)}
                onRefreshCount={refreshHistoryCount}
              />
            }
          />
          <Route
            path="calendar"
            element={
              <CalendarPage
                deadlines={analysis?.deadlines || []}
                onViewSource={handleViewSource}
              />
            }
          />
          <Route
            path="settings"
            element={
              <SettingsPage
                preferBackend={preferBackend}
                setPreferBackend={setPreferBackend}
                summaryLength={summaryLength}
                setSummaryLength={setSummaryLength}
                backendOnline={backendOnline}
                onClearSession={handleClearSession}
              />
            }
          />
        </Route>

        {/* 5. RESTRICTED ADMIN PORTAL ROUTES: /admin */}
        <Route
          path="/admin"
          element={
            <AdminRouteGuard user={currentUser}>
              <AdminLayout />
            </AdminRouteGuard>
          }
        >
          <Route index element={<AdminPage />} />
        </Route>

        {/* Fallback to Landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>

      {/* Global Modals */}
      <PrivacyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onSelectUser={handleAuthSuccess}
      />

      <SourceModal
        isOpen={sourceModalData.isOpen}
        onClose={() => setSourceModalData({ ...sourceModalData, isOpen: false })}
        messageId={sourceModalData.messageId}
        sender={sourceModalData.sender}
        excerpt={sourceModalData.excerpt}
        onJumpToTranscript={() => {}}
      />
    </BrowserRouter>
  </ThemeProvider>
</ErrorBoundary>
  );
}

export default App;

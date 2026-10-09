import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  Play, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar, 
  AtSign, 
  Lock, 
  FileText,
  Check,
  Zap,
  CheckSquare,
  HelpCircle,
  ChevronDown,
  Volume2,
  Database,
  Eye,
  Mail,
  Send,
  Clock,
  MessageSquareOff,
  Search
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface LandingPageProps {
  onOpenPrivacy: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenPrivacy }) => {
  const { theme } = useTheme();

  // Interactive FAQ State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Email Waitlist State
  const [email, setEmail] = useState('');
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);
  const [waitlistError, setWaitlistError] = useState('');

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@') || !email.includes('.')) {
      setWaitlistError('Please enter a valid email address.');
      return;
    }
    setWaitlistError('');
    setWaitlistSubmitted(true);
    // Store in localStorage for prototype demonstration
    try {
      const existing = JSON.parse(localStorage.getItem('missiq_waitlist') || '[]');
      existing.push({ email, timestamp: new Date().toISOString() });
      localStorage.setItem('missiq_waitlist', JSON.stringify(existing));
    } catch {
      // Fallback
    }
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="space-y-24 sm:space-y-32 pb-24 font-sans text-aurora-text selection:bg-aurora-primary selection:text-aurora-bg">
      {/* =========================================================================
          1. HERO SECTION
          ========================================================================= */}
      <section className="relative pt-12 sm:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto hero-glow-radial">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-aurora-surface border border-aurora-border text-aurora-primary text-[11px] font-semibold tracking-wider uppercase shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-aurora-primary" />
            <span>LOCAL-FIRST CONVERSATION INTELLIGENCE</span>
          </div>

          {/* Primary Benefit Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-aurora-text leading-[1.12]">
            Stop reading 300 unread messages.<br />
            <span className="aurora-gradient-text">
              Know what needs your attention in 30 seconds.
            </span>
          </h1>

          {/* Benefit-Driven Subheadline */}
          <p className="text-base sm:text-lg text-aurora-muted max-w-2xl mx-auto leading-relaxed">
            MissIQ turns noisy group chats and work channels into clear summaries, agreed decisions, assigned tasks, and deadline alerts — right inside your browser without your data ever leaving your device.
          </p>

          {/* Primary CTA (Instance 1) & Secondary Live Demo */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link
              to="/app"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl font-bold text-sm aurora-btn-primary shadow-lg shadow-aurora-primary/20 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Catch Up Free — No Account Needed</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </Link>

            <Link
              to="/demo"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-medium text-sm text-aurora-text bg-aurora-surface border border-aurora-border hover:border-aurora-primary/50 hover:bg-aurora-elevated transition-colors"
            >
              <Play className="w-4 h-4 text-aurora-primary fill-aurora-primary" />
              <span>Explore 30s Live Demo</span>
            </Link>
          </div>

          {/* Micro Trust Indicators */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-aurora-muted">
            <div className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-aurora-primary" />
              <span>100% In-Browser Processing</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-aurora-primary" />
              <span>Zero Remote Data Transmission</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-aurora-primary" />
              <span>No Sign-Up or Credit Card</span>
            </div>
          </div>
        </div>

        {/* Hero Interactive UI Preview */}
        <div className="mt-14 max-w-5xl mx-auto relative">
          <div className="rounded-3xl bg-aurora-surface border border-aurora-border shadow-2xl p-4 sm:p-7 backdrop-blur-xl relative overflow-hidden">
            {/* Top Scanning Status Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-aurora-border mb-5">
              <div className="flex items-center gap-3">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-aurora-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-aurora-primary"></span>
                </span>
                <span className="text-xs font-mono text-aurora-muted uppercase tracking-widest">
                  LIVE CONVERSATION TRIAGE STREAM
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-mono text-aurora-primary bg-aurora-elevated px-2.5 py-0.5 rounded-full border border-aurora-border">
                <Sparkles className="w-3 h-3 text-aurora-primary" />
                <span>248 MESSAGES ANALYZED IN 142MS</span>
              </div>
            </div>

            {/* Metrics Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
              <div className="p-3.5 rounded-2xl bg-aurora-input border border-aurora-border">
                <span className="text-[10px] font-mono uppercase tracking-wider text-aurora-muted">Analyzed</span>
                <div className="text-xl font-bold text-aurora-text mt-0.5">248 msgs</div>
                <span className="text-[10px] text-aurora-secondary">Across 8 speakers</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-aurora-input border border-aurora-border">
                <span className="text-[10px] font-mono uppercase tracking-wider text-aurora-muted">Decisions</span>
                <div className="text-xl font-bold text-aurora-primary mt-0.5">4 agreed</div>
                <span className="text-[10px] text-aurora-muted">Zero consensus missed</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-aurora-input border border-aurora-border">
                <span className="text-[10px] font-mono uppercase tracking-wider text-aurora-muted">Action Items</span>
                <div className="text-xl font-bold text-aurora-primary mt-0.5">3 tasks</div>
                <span className="text-[10px] text-aurora-success">Owners detected</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-aurora-input border border-aurora-border">
                <span className="text-[10px] font-mono uppercase tracking-wider text-aurora-muted">Deadlines</span>
                <div className="text-xl font-bold text-aurora-warning mt-0.5">2 alerts</div>
                <span className="text-[10px] text-aurora-muted">Tonight & Wednesday</span>
              </div>
            </div>

            {/* Overlapping Intel Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-7 space-y-4">
                {/* Critical Alert */}
                <div className="p-4 rounded-2xl bg-aurora-elevated border border-aurora-error/40 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-aurora-error/15 text-aurora-error border border-aurora-error/30">
                      <AlertTriangle className="w-3 h-3" />
                      HIGH PRIORITY ALERT
                    </span>
                    <span className="text-[11px] font-mono text-aurora-muted">Due: 11:59 PM Tonight</span>
                  </div>
                  <h4 className="text-sm font-bold text-aurora-text">
                    Assignment 4 portal closes strictly tonight at 11:59 PM
                  </h4>
                  <p className="text-xs text-aurora-muted mt-1 leading-relaxed">
                    Late submissions will incur a 20% penalty. TA confirmed Question 5 is mandatory for team project submissions.
                  </p>
                </div>

                {/* AI Executive Summary */}
                <div className="p-4 rounded-2xl bg-aurora-input border border-aurora-border space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-aurora-primary flex items-center gap-1.5 uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5 text-aurora-primary" />
                      Executive Catch-Up Brief
                    </span>
                    <span className="text-[10px] text-aurora-secondary font-mono">~18 mins saved</span>
                  </div>
                  <p className="text-xs text-aurora-text leading-relaxed">
                    Class Rep Rohit notified the team that the CS302 Midterm is rescheduled to next Wednesday at 10:00 AM. 
                    TA confirmed Question 5 is mandatory. Vikram will complete Docker Compose setup by 5:30 PM today.
                  </p>
                </div>
              </div>

              {/* Right Column: Action Checklist */}
              <div className="lg:col-span-5 p-4 rounded-2xl bg-aurora-input border border-aurora-border space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-aurora-border">
                  <span className="text-xs font-bold text-aurora-text flex items-center gap-1.5">
                    <CheckSquare className="w-3.5 h-3.5 text-aurora-primary" />
                    Assigned Action Items (3)
                  </span>
                  <span className="text-[10px] font-mono text-aurora-muted">Auto-Extracted</span>
                </div>

                <div className="space-y-2">
                  <div className="p-2.5 rounded-xl bg-aurora-surface border border-aurora-border flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-aurora-primary shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-aurora-text truncate">Submit Project Zip to Portal</p>
                      <span className="text-[10px] text-aurora-error font-mono">Due Tonight · Owner: Alex</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-aurora-surface border border-aurora-border flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-aurora-muted shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-aurora-text truncate">Verify Docker Compose file</p>
                      <span className="text-[10px] text-aurora-muted font-mono">Due 5:30 PM · Owner: Vikram</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-aurora-surface border border-aurora-border flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-aurora-muted shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-aurora-text truncate">Review Question 5 solution</p>
                      <span className="text-[10px] text-aurora-secondary font-mono">Due Tomorrow · Owner: Sarah</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. THE PROBLEM SECTION
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-aurora-primary font-semibold">
            THE CONVERSATION OVERLOAD DILEMMA
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-aurora-text tracking-tight">
            Group chats were built for conversation.<br className="hidden sm:inline" />
            Not for managing your responsibilities.
          </h2>
          <p className="text-sm sm:text-base text-aurora-muted leading-relaxed">
            When work, college, and project teams communicate in lengthy messaging streams, important details drown in a sea of reactions, banter, and tangential debates.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Problem 1 */}
          <div className="p-7 rounded-3xl bg-aurora-surface border border-aurora-border space-y-4 surface-card-hover">
            <div className="w-11 h-11 rounded-2xl bg-aurora-error/15 border border-aurora-error/30 flex items-center justify-center text-aurora-error">
              <MessageSquareOff className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-aurora-text">Buried Decisions</h3>
            <p className="text-xs sm:text-sm text-aurora-muted leading-relaxed">
              You step away for three hours and return to 400 unread messages. The consensus on budget, deliverables, or meeting schedules happened on message 112 and is already buried.
            </p>
          </div>

          {/* Problem 2 */}
          <div className="p-7 rounded-3xl bg-aurora-surface border border-aurora-border space-y-4 surface-card-hover">
            <div className="w-11 h-11 rounded-2xl bg-aurora-warning/15 border border-aurora-warning/30 flex items-center justify-center text-aurora-warning">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-aurora-text">Missed Deadlines</h3>
            <p className="text-xs sm:text-sm text-aurora-muted leading-relaxed">
              Submission cutoffs, client deliverables, and reschedule notices get lost in the feed until somebody asks why your part hasn’t been finished yet.
            </p>
          </div>

          {/* Problem 3 */}
          <div className="p-7 rounded-3xl bg-aurora-surface border border-aurora-border space-y-4 surface-card-hover">
            <div className="w-11 h-11 rounded-2xl bg-aurora-primary/15 border border-aurora-primary/30 flex items-center justify-center text-aurora-primary">
              <Eye className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-aurora-text">Context Debt & Fatigue</h3>
            <p className="text-xs sm:text-sm text-aurora-muted leading-relaxed">
              Reading back through days of chatter wastes 45 minutes of valuable focus every morning just to answer one simple question: “What do I actually need to do next?”
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. HOW IT WORKS (3 SIMPLE STEPS)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-aurora-primary font-semibold">
            THREE STEPS TO CLARITY
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-aurora-text tracking-tight">
            How MissIQ turns chaos into clarity
          </h2>
          <p className="text-sm sm:text-base text-aurora-muted leading-relaxed">
            No complicated integrations or bot installations. Just instant, transparent signal extraction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Step 1 */}
          <div className="p-7 rounded-3xl bg-aurora-surface border border-aurora-border relative flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-aurora-primary text-aurora-bg font-extrabold text-sm flex items-center justify-center shadow-md">
                01
              </div>
              <h3 className="text-lg font-bold text-aurora-text">Drop or Paste Your Chat</h3>
              <p className="text-xs sm:text-sm text-aurora-muted leading-relaxed">
                Export text logs or copy and paste raw chat messages from WhatsApp, Slack, Discord, Microsoft Teams, or text files up to [CONFIRM: 10MB].
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-aurora-border text-[11px] font-mono text-aurora-primary">
              ✓ No bot installation required
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-7 rounded-3xl bg-aurora-surface border border-aurora-border relative flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-aurora-primary text-aurora-bg font-extrabold text-sm flex items-center justify-center shadow-md">
                02
              </div>
              <h3 className="text-lg font-bold text-aurora-text">On-Device Engine Extracts Signal</h3>
              <p className="text-xs sm:text-sm text-aurora-muted leading-relaxed">
                Client-side heuristic parsers and pattern models analyze conversations in milliseconds, isolating decisions, task assignees, and time triggers directly in RAM.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-aurora-border text-[11px] font-mono text-aurora-primary">
              ✓ Operates in volatile browser memory
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-7 rounded-3xl bg-aurora-surface border border-aurora-border relative flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-aurora-primary text-aurora-bg font-extrabold text-sm flex items-center justify-center shadow-md">
                03
              </div>
              <h3 className="text-lg font-bold text-aurora-text">Review, Check Off, & Sync</h3>
              <p className="text-xs sm:text-sm text-aurora-muted leading-relaxed">
                Review your synthesized briefing, listen via audio TTS, export tasks to Markdown, and sync upcoming deadlines straight to Google, Apple, or Outlook (.ics).
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-aurora-border text-[11px] font-mono text-aurora-primary">
              ✓ 1-click calendar sync & export
            </div>
          </div>
        </div>

        {/* Mid-Page Primary CTA (Instance 2) */}
        <div className="mt-12 text-center">
          <Link
            to="/app"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl font-bold text-sm aurora-btn-primary shadow-lg shadow-aurora-primary/20 transition-all transform hover:-translate-y-0.5"
          >
            <span>Catch Up Free — No Account Needed</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </Link>
        </div>
      </section>

      {/* =========================================================================
          4. FEATURES SECTION
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-aurora-primary font-semibold">
            BUILT FOR SIGNAL OVER NOISE
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-aurora-text tracking-tight">
            Everything you need to reclaim your time
          </h2>
          <p className="text-sm sm:text-base text-aurora-muted leading-relaxed">
            Six focused intelligence capabilities designed specifically for busy professionals, founders, and students in active groups.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="p-6 rounded-3xl bg-aurora-surface border border-aurora-border space-y-3 surface-card-hover">
            <div className="w-10 h-10 rounded-2xl bg-aurora-primary/15 border border-aurora-primary/30 flex items-center justify-center text-aurora-primary">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-aurora-text">Priority Urgency Triage</h3>
            <p className="text-xs text-aurora-muted leading-relaxed">
              Separates critical blockers and emergency alerts from casual chit-chat using semantic urgency detection (High, Medium, Low).
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-6 rounded-3xl bg-aurora-surface border border-aurora-border space-y-3 surface-card-hover">
            <div className="w-10 h-10 rounded-2xl bg-aurora-primary/15 border border-aurora-primary/30 flex items-center justify-center text-aurora-primary">
              <CheckSquare className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-aurora-text">Task & Owner Assignment</h3>
            <p className="text-xs text-aurora-muted leading-relaxed">
              Extracts actionable to-dos with automatically detected assignees and provides an interactive checklist with confetti completion feedback.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-6 rounded-3xl bg-aurora-surface border border-aurora-border space-y-3 surface-card-hover">
            <div className="w-10 h-10 rounded-2xl bg-aurora-primary/15 border border-aurora-primary/30 flex items-center justify-center text-aurora-primary">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-aurora-text">Deadline Radar & .ICS Sync</h3>
            <p className="text-xs text-aurora-muted leading-relaxed">
              Identifies explicit dates, submission times, and relative deadlines (“tonight by 11:59 PM”) and exports them directly into your calendar.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="p-6 rounded-3xl bg-aurora-surface border border-aurora-border space-y-3 surface-card-hover">
            <div className="w-10 h-10 rounded-2xl bg-aurora-primary/15 border border-aurora-primary/30 flex items-center justify-center text-aurora-primary">
              <AtSign className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-aurora-text">Direct Mention Radar</h3>
            <p className="text-xs text-aurora-muted leading-relaxed">
              Enter your name or handle to instantly spotlight every place someone requested your input, assigned you work, or mentioned you.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="p-6 rounded-3xl bg-aurora-surface border border-aurora-border space-y-3 surface-card-hover">
            <div className="w-10 h-10 rounded-2xl bg-aurora-primary/15 border border-aurora-primary/30 flex items-center justify-center text-aurora-primary">
              <Volume2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-aurora-text">Audio Briefing Readout</h3>
            <p className="text-xs text-aurora-muted leading-relaxed">
              Hands-free Web Speech audio synthesis lets you listen to your synthesized briefing while commuting, walking, or between calls.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="p-6 rounded-3xl bg-aurora-surface border border-aurora-border space-y-3 surface-card-hover">
            <div className="w-10 h-10 rounded-2xl bg-aurora-primary/15 border border-aurora-primary/30 flex items-center justify-center text-aurora-primary">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-aurora-text">1-Click Source Traceability</h3>
            <p className="text-xs text-aurora-muted leading-relaxed">
              Click any extracted decision or deadline to inspect the original raw transcript message and verify grounding with zero hallucinations.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. PRIVACY & LOCAL-FIRST EXPLANATION (TRUST PILLAR)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-aurora-surface border border-aurora-border relative overflow-hidden shadow-xl">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-aurora-primary/15 border border-aurora-primary/30 text-aurora-primary text-[11px] font-semibold tracking-wider uppercase">
              <Lock className="w-3.5 h-3.5 text-aurora-primary" />
              <span>TRANSPARENT PRIVACY ARCHITECTURE</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-aurora-text tracking-tight">
              Exactly how local-first privacy works.<br />
              No unprovable claims.
            </h2>

            <p className="text-sm sm:text-base text-aurora-muted leading-relaxed">
              We believe privacy statements should describe concrete software architecture, not generic marketing assurances. Here is exactly what happens when you use MissIQ:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
            {/* Architecture Point 1 */}
            <div className="p-6 rounded-2xl bg-aurora-input border border-aurora-border space-y-2.5">
              <div className="flex items-center gap-2 text-sm font-bold text-aurora-text">
                <CheckCircle2 className="w-4 h-4 text-aurora-primary shrink-0" />
                <span>Volatile Browser RAM Isolation</span>
              </div>
              <p className="text-xs text-aurora-muted leading-relaxed">
                When you paste conversations in Guest Mode, parsing runs in client-side JavaScript memory. Chat messages are never uploaded to any remote server or third-party cloud.
              </p>
            </div>

            {/* Architecture Point 2 */}
            <div className="p-6 rounded-2xl bg-aurora-input border border-aurora-border space-y-2.5">
              <div className="flex items-center gap-2 text-sm font-bold text-aurora-text">
                <CheckCircle2 className="w-4 h-4 text-aurora-primary shrink-0" />
                <span>Private Local IndexedDB Storage</span>
              </div>
              <p className="text-xs text-aurora-muted leading-relaxed">
                Saved summaries and completed tasks are written exclusively to your local browser’s IndexedDB sandbox on your device. Clearing your browser data immediately purges everything.
              </p>
            </div>

            {/* Architecture Point 3 */}
            <div className="p-6 rounded-2xl bg-aurora-input border border-aurora-border space-y-2.5">
              <div className="flex items-center gap-2 text-sm font-bold text-aurora-text">
                <CheckCircle2 className="w-4 h-4 text-aurora-primary shrink-0" />
                <span>Zero Message Text Telemetry</span>
              </div>
              <p className="text-xs text-aurora-muted leading-relaxed">
                Our optional backend tracks aggregate anonymous runtimes only (e.g. average processing speed). Private transcripts are never stored, logged, or used to train AI models. [CONFIRM: Third-party security verification scheduled for Q3 2026].
              </p>
            </div>

            {/* Architecture Point 4 */}
            <div className="p-6 rounded-2xl bg-aurora-input border border-aurora-border space-y-2.5">
              <div className="flex items-center gap-2 text-sm font-bold text-aurora-text">
                <CheckCircle2 className="w-4 h-4 text-aurora-primary shrink-0" />
                <span>Fully Offline Capable</span>
              </div>
              <p className="text-xs text-aurora-muted leading-relaxed">
                Once loaded, you can disconnect your Wi-Fi, paste conversations, and MissIQ will analyze threads completely offline using client-side heuristics. [CONFIRM: Bundle size ~460KB gzipped].
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-aurora-border flex flex-wrap items-center justify-between gap-4">
            <span className="text-xs text-aurora-muted font-mono">
              STATUS: LOCAL SANDBOX CERTIFIED · ZERO EXTERNAL TRACKING SCRIPTS
            </span>
            <button
              onClick={onOpenPrivacy}
              className="text-xs font-bold text-aurora-primary hover:underline cursor-pointer"
            >
              Inspect Privacy Specifications →
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. FREQUENTLY ASKED QUESTIONS (FAQ)
          ========================================================================= */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-aurora-primary font-semibold">
            ANSWERS TO COMMON QUESTIONS
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-aurora-text tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-aurora-muted">
            Everything you need to know about MissIQ's features, privacy model, and usage.
          </p>
        </div>

        <div className="space-y-3">
          {[
            {
              q: "Do my chat messages ever leave my device or train an AI?",
              a: "No. In default Guest Mode, all parsing and entity extraction happens directly inside your web browser’s JavaScript memory. Your messages are never sent to external AI providers or stored on our servers."
            },
            {
              q: "What messaging platforms and file formats are supported?",
              a: "MissIQ supports exported chat logs and text snippets from WhatsApp, Slack, Discord, Microsoft Teams, Telegram, and standard .txt or .log files. You do not need to clean up formatting before pasting."
            },
            {
              q: "How is MissIQ different from pasting chats into ChatGPT or Claude?",
              a: "ChatGPT requires sending your raw team and private messages to external cloud servers, which violates workplace and personal privacy policies. MissIQ runs locally on your device, extracts structured action items with assignees, and generates ready-to-import .ics calendar deadlines."
            },
            {
              q: "Do I need to create an account or provide a payment card?",
              a: "No. The core MissIQ application is completely free to use as a guest. You do not need to sign up, provide an email, or enter credit card information."
            },
            {
              q: "Can MissIQ run completely offline without an internet connection?",
              a: "Yes. Once the web application is loaded in your browser, the built-in local NLP engine can process conversations with your Wi-Fi or cellular connection turned completely off."
            },
            {
              q: "How accurate is deadline extraction and task assignment?",
              a: "MissIQ uses contextual date parsing and natural language heuristics to recognize dates, times, relative terms (e.g. 'tonight by 11:59 PM', 'due Friday'), and speaker attribution. Every extracted item includes a 1-click link to verify the original message."
            }
          ].map((item, idx) => (
            <div 
              key={idx}
              className="rounded-2xl bg-aurora-surface border border-aurora-border overflow-hidden transition-all"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-aurora-text hover:text-aurora-primary transition-colors cursor-pointer"
              >
                <span>{item.q}</span>
                <ChevronDown className={`w-4 h-4 text-aurora-muted transition-transform duration-200 shrink-0 ${openFaq === idx ? 'rotate-180 text-aurora-primary' : ''}`} />
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 text-xs sm:text-sm text-aurora-muted leading-relaxed border-t border-aurora-border/50 pt-3">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          7. CONVERSION: EMAIL WAITLIST & FINAL CTA (INSTANCE 3)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-aurora-surface border border-aurora-border p-8 sm:p-14 text-center relative overflow-hidden shadow-2xl space-y-8">
          <div className="max-w-2xl mx-auto space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-aurora-primary font-semibold">
              START CATCHING UP IN SECONDS
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-aurora-text tracking-tight leading-tight">
              Never miss what matters in your chats again.
            </h2>
            <p className="text-sm sm:text-base text-aurora-muted leading-relaxed">
              Join busy professionals, students, and community leads who cut 40 minutes of daily chat fatigue with on-device conversation intelligence.
            </p>
          </div>

          {/* Primary CTA (Instance 3) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/app"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-9 py-4 rounded-2xl font-bold text-sm sm:text-base aurora-btn-primary shadow-xl shadow-aurora-primary/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Catch Up Free — No Account Needed</span>
              <ArrowRight className="w-5 h-5 stroke-[2.5]" />
            </Link>

            <Link
              to="/demo"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-semibold text-sm text-aurora-text bg-aurora-input border border-aurora-border hover:border-aurora-primary/50 hover:bg-aurora-elevated transition-colors"
            >
              <span>Try Interactive Demo</span>
            </Link>
          </div>

          {/* Email Waitlist for Upcoming Extensions */}
          <div className="pt-8 max-w-md mx-auto border-t border-aurora-border/70 space-y-3">
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-aurora-text">
              <Mail className="w-4 h-4 text-aurora-primary" />
              <span>Join Waitlist for WhatsApp & Slack Auto-Sync</span>
            </div>
            <p className="text-[11px] text-aurora-muted">
              Be the first to get our upcoming Chrome and desktop background listeners.
            </p>

            {waitlistSubmitted ? (
              <div className="p-3.5 rounded-2xl bg-aurora-primary/15 border border-aurora-primary/40 text-aurora-primary text-xs font-semibold flex items-center justify-center gap-2 animate-fade-in">
                <Check className="w-4 h-4 text-aurora-primary" />
                <span>You’re on the waitlist! We’ll notify you when auto-sync launches.</span>
              </div>
            ) : (
              <form onSubmit={handleWaitlistSubmit} className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="flex-1 px-4 py-2.5 rounded-xl text-xs bg-aurora-input border border-aurora-border text-aurora-text placeholder-aurora-muted focus:outline-none focus:border-aurora-primary transition-colors"
                    aria-label="Email address for waitlist"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl text-xs font-bold bg-aurora-elevated border border-aurora-border text-aurora-text hover:border-aurora-primary/50 hover:bg-aurora-primary hover:text-aurora-bg transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Notify Me</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
                {waitlistError && (
                  <p className="text-[11px] text-aurora-error text-left">{waitlistError}</p>
                )}
                <p className="text-[10px] text-aurora-muted text-center">
                  Zero spam. Strictly release notifications. Unsubscribe anytime.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

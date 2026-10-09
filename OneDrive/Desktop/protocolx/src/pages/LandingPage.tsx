import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  Play, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Scale, 
  Calendar, 
  AtSign, 
  Layers, 
  Clock, 
  Lock, 
  Cpu, 
  FileText,
  UserCheck,
  Check,
  Zap,
  CheckSquare
} from 'lucide-react';

interface LandingPageProps {
  onOpenPrivacy: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenPrivacy }) => {
  return (
    <div className="space-y-28 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative pt-16 sm:pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto hero-glow-radial">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-aurora-surface border border-aurora-primary/30 text-aurora-primary text-[11px] font-semibold tracking-wider uppercase shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-aurora-primary" />
            <span>AI-POWERED CONVERSATION INTELLIGENCE</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-aurora-text leading-[1.08]">
            Thousands of messages.<br />
            <span className="aurora-gradient-text">
              Only a few things matter.
            </span>
          </h1>

          {/* Supporting Copy */}
          <p className="text-base sm:text-lg text-aurora-muted max-w-2xl mx-auto leading-relaxed">
            Turn overwhelming conversations into clear summaries, important decisions, urgent tasks, and deadlines you cannot afford to miss.
          </p>

          {/* Call to Actions */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link
              to="/app"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl font-bold text-sm bg-aurora-primary text-aurora-bg hover:bg-aurora-primary-hover shadow-lg shadow-aurora-primary/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Start Catching Up</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </Link>

            <Link
              to="/demo"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-medium text-sm text-aurora-text bg-aurora-surface border border-aurora-border hover:border-aurora-primary/50 hover:bg-aurora-elevated transition-colors"
            >
              <Play className="w-4 h-4 text-aurora-secondary fill-aurora-secondary" />
              <span>Explore Live Demo</span>
            </Link>
          </div>

          {/* Three Concise Trust Indicators */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-aurora-muted">
            <div className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-aurora-primary" />
              <span>No account required for demo</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-aurora-primary" />
              <span>Privacy-conscious processing</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-aurora-secondary" />
              <span>Clear, actionable insights</span>
            </div>
          </div>
        </div>

        {/* 2. HERO ILLUSTRATION: REAL UI PREVIEW COMPOSED OF INTERFACE COMPONENTS */}
        <div className="mt-14 max-w-5xl mx-auto relative">
          {/* Subtle radial mint glow behind visual */}
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-aurora-primary/10 to-transparent blur-3xl -z-10 rounded-3xl" />

          {/* Main Dashboard Frame in Arctic Aurora Deep Teal */}
          <div className="rounded-3xl bg-aurora-surface/95 border border-aurora-border shadow-2xl p-4 sm:p-7 backdrop-blur-xl relative overflow-hidden">
            {/* Top scanning stream indicator */}
            <div className="flex items-center justify-between pb-4 border-b border-aurora-border/60 mb-5">
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
                <Sparkles className="w-3 h-3 animate-spin text-aurora-primary" />
                <span>248 MESSAGES ANALYZED</span>
              </div>
            </div>

            {/* Metrics Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
              <div className="p-3.5 rounded-2xl bg-aurora-input border border-aurora-border/60">
                <span className="text-[10px] font-mono uppercase tracking-wider text-aurora-muted">Analyzed</span>
                <div className="text-xl font-bold text-aurora-text mt-0.5">248 msgs</div>
                <span className="text-[10px] text-aurora-secondary">Across 8 speakers</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-aurora-input border border-aurora-border/60">
                <span className="text-[10px] font-mono uppercase tracking-wider text-aurora-muted">Important</span>
                <div className="text-xl font-bold text-aurora-primary mt-0.5">6 updates</div>
                <span className="text-[10px] text-aurora-muted">Surfaced in seconds</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-aurora-input border border-aurora-border/60">
                <span className="text-[10px] font-mono uppercase tracking-wider text-aurora-muted">Actions</span>
                <div className="text-xl font-bold text-aurora-primary mt-0.5">3 tasks</div>
                <span className="text-[10px] text-aurora-success">Assigned & tracked</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-aurora-input border border-aurora-border/60">
                <span className="text-[10px] font-mono uppercase tracking-wider text-aurora-muted">Deadlines</span>
                <div className="text-xl font-bold text-aurora-warning mt-0.5">2 upcoming</div>
                <span className="text-[10px] text-aurora-muted">Tonight & Wednesday</span>
              </div>
            </div>

            {/* Floating Overlapping Panels Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Left Column: Prominent Announcement & Summary */}
              <div className="lg:col-span-7 space-y-4">
                {/* Prominent High-Priority Announcement */}
                <div className="p-4 rounded-2xl bg-aurora-elevated border border-aurora-error/40 shadow-lg relative overflow-hidden">
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
                    Late submissions will incur a 20% penalty. TA confirmed Question 5 is mandatory for teams.
                  </p>
                </div>

                {/* Compact AI-Generated Summary */}
                <div className="p-4 rounded-2xl bg-aurora-input border border-aurora-border space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-aurora-primary flex items-center gap-1.5 uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5 text-aurora-primary" />
                      Synthesized Catch-Up Brief
                    </span>
                    <span className="text-[10px] text-aurora-secondary font-mono">~12 mins saved</span>
                  </div>
                  <p className="text-xs text-aurora-text leading-relaxed">
                    Class Rep Rohit notified the group that the CS302 Midterm exam is rescheduled to next Wednesday at 10:00 AM. 
                    TA confirmed Question 5 is mandatory for team projects. Vikram is handling Docker Compose integration by 5:30 PM.
                  </p>
                </div>
              </div>

              {/* Right Column: Action Checklist & Timeline */}
              <div className="lg:col-span-5 space-y-3">
                <div className="p-4 rounded-2xl bg-aurora-input border border-aurora-border">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-aurora-text flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-aurora-primary" />
                      Action Checklist
                    </span>
                    <span className="text-[10px] font-mono text-aurora-muted">1/3 Done</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-aurora-surface border border-aurora-border/60 flex items-start gap-2.5">
                      <input type="checkbox" checked readOnly className="mt-0.5 accent-[#45E0C1] rounded" />
                      <div>
                        <div className="font-semibold text-aurora-text line-through opacity-75">Re-share public dataset link</div>
                        <div className="text-[10px] text-aurora-muted">Owner: Priya · Due 1:00 PM</div>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-aurora-surface border border-aurora-border/60 flex items-start gap-2.5">
                      <input type="checkbox" readOnly className="mt-0.5 accent-[#45E0C1] rounded" />
                      <div>
                        <div className="font-semibold text-aurora-text">Commit Docker Compose setup</div>
                        <div className="text-[10px] text-aurora-muted">Owner: Vikram · Due 6:00 PM</div>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-aurora-surface border border-aurora-border/60 flex items-start gap-2.5">
                      <input type="checkbox" readOnly className="mt-0.5 accent-[#45E0C1] rounded" />
                      <div>
                        <div className="font-semibold text-aurora-text">Fill out lab elective form</div>
                        <div className="text-[10px] text-aurora-muted">Owner: Not specified · Due Tomorrow</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PROBLEM AND SOLUTION SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-aurora-surface border border-aurora-border grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-aurora-secondary">
              THE CONVERSATION OVERLOAD CRISIS
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-aurora-text tracking-tight">
              Group chats are great for chatting, but terrible for tracking work.
            </h2>
            <p className="text-xs sm:text-sm text-aurora-muted leading-relaxed">
              Important announcements, project deadlines, decisions, and mentions get buried under hundreds of memes and side discussions.
              Scrolling through 400 messages to find one deadline is stressful and inefficient.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-aurora-input border border-aurora-border space-y-4">
            <div className="flex items-center gap-2.5 text-aurora-primary font-bold text-sm">
              <Zap className="w-4 h-4 text-aurora-primary" />
              <span>How MissIQ Solves It:</span>
            </div>
            <ul className="space-y-3 text-xs text-aurora-text">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-aurora-primary flex-shrink-0 mt-0.5" />
                <span>Filters conversational filler to isolate genuine commitments.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-aurora-primary flex-shrink-0 mt-0.5" />
                <span>Grounds every extracted task in verified source quotes.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-aurora-primary flex-shrink-0 mt-0.5" />
                <span>Respects your privacy by default with private on-device execution.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 3. FEATURE SHOWCASE */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-aurora-primary">
            CORE PLATFORM CAPABILITIES
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-aurora-text tracking-tight">
            Designed for signal. Built to eliminate noise.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1: Smart Summaries */}
          <div className="p-6 rounded-3xl bg-aurora-surface border border-aurora-border hover:border-aurora-primary/50 transition-all space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-aurora-elevated text-aurora-primary flex items-center justify-center border border-aurora-border">
              <Sparkles className="w-5 h-5 text-aurora-primary" />
            </div>
            <h3 className="text-base font-bold text-aurora-text">Smart Conversation Summaries</h3>
            <p className="text-xs text-aurora-muted leading-relaxed">
              Instantly converts 500+ messages into an executive brief. Distinguishes announcements, discussion points, and pending questions without hallucination.
            </p>
          </div>

          {/* Feature 2: Priority Intelligence */}
          <div className="p-6 rounded-3xl bg-aurora-surface border border-aurora-border hover:border-aurora-primary/50 transition-all space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-aurora-elevated text-aurora-error flex items-center justify-center border border-aurora-border">
              <AlertTriangle className="w-5 h-5 text-aurora-error" />
            </div>
            <h3 className="text-base font-bold text-aurora-text">Priority Intelligence</h3>
            <p className="text-xs text-aurora-muted leading-relaxed">
              Triages messages into HIGH, MEDIUM, and LOW with explicit justification rationale. Highlights critical blockers without alarmist over-classification.
            </p>
          </div>

          {/* Feature 3: Action Item Extraction */}
          <div className="p-6 rounded-3xl bg-aurora-surface border border-aurora-border hover:border-aurora-primary/50 transition-all space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-aurora-elevated text-aurora-primary flex items-center justify-center border border-aurora-border">
              <CheckSquare className="w-5 h-5 text-aurora-primary" />
            </div>
            <h3 className="text-base font-bold text-aurora-text">Action Item Extraction</h3>
            <p className="text-xs text-aurora-muted leading-relaxed">
              Isolates deliverables, owners, and strict deadlines. Marks unassigned details as "Not specified" strictly instead of guessing.
            </p>
          </div>

          {/* Feature 4: Decisions */}
          <div className="p-6 rounded-3xl bg-aurora-surface border border-aurora-border hover:border-aurora-primary/50 transition-all space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-aurora-elevated text-aurora-secondary flex items-center justify-center border border-aurora-border">
              <Scale className="w-5 h-5 text-aurora-secondary" />
            </div>
            <h3 className="text-base font-bold text-aurora-text">Decision Agreement Locks</h3>
            <p className="text-xs text-aurora-muted leading-relaxed">
              Separates resolved consensus from open proposals under discussion. Displays supporting excerpts so you can verify each decision against raw quotes.
            </p>
          </div>

          {/* Feature 5: Deadline Detection */}
          <div className="p-6 rounded-3xl bg-aurora-surface border border-aurora-border hover:border-aurora-primary/50 transition-all space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-aurora-elevated text-aurora-warning flex items-center justify-center border border-aurora-border">
              <Calendar className="w-5 h-5 text-aurora-warning" />
            </div>
            <h3 className="text-base font-bold text-aurora-text">Deadline Detection & .ICS</h3>
            <p className="text-xs text-aurora-muted leading-relaxed">
              Detects assignment dates, exam slots, and meetings. Provides a one-click .ics calendar export to sync directly into Google or Apple Calendar.
            </p>
          </div>

          {/* Feature 6: Personal Mentions */}
          <div className="p-6 rounded-3xl bg-aurora-surface border border-aurora-border hover:border-aurora-primary/50 transition-all space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-aurora-elevated text-aurora-secondary flex items-center justify-center border border-aurora-border">
              <AtSign className="w-5 h-5 text-aurora-secondary" />
            </div>
            <h3 className="text-base font-bold text-aurora-text">Personal Mention Isolator</h3>
            <p className="text-xs text-aurora-muted leading-relaxed">
              Provide your name or handle to instantly filter questions and tasks addressed directly to you, cutting through hundreds of group messages.
            </p>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section id="how-it-works" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-aurora-surface border border-aurora-border space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-aurora-secondary">
              THREE STEPS TO CLARITY
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-aurora-text">
              How MissIQ works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="p-4 rounded-2xl bg-aurora-input border border-aurora-border space-y-2">
              <div className="text-xs font-mono font-bold text-aurora-secondary">01 · INPUT</div>
              <h4 className="text-sm font-bold text-aurora-text">Paste or Import</h4>
              <p className="text-xs text-aurora-muted leading-relaxed">
                Paste chat text or upload a .txt export from group discussions, project channels, or meetings.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-aurora-input border border-aurora-border space-y-2">
              <div className="text-xs font-mono font-bold text-aurora-primary">02 · TRIAGE</div>
              <h4 className="text-sm font-bold text-aurora-text">Conversation Intelligence</h4>
              <p className="text-xs text-aurora-muted leading-relaxed">
                Our grounded pipeline parses senders, timestamps, priorities, tasks, and decisions locally.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-aurora-input border border-aurora-border space-y-2">
              <div className="text-xs font-mono font-bold text-aurora-success">03 · ACT</div>
              <h4 className="text-sm font-bold text-aurora-text">Execute & Catch Up</h4>
              <p className="text-xs text-aurora-muted leading-relaxed">
                Review priorities, check off tasks, sync calendar deadlines, or export a formatted brief.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PRIVACY PILLAR */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-4">
        <div className="inline-flex p-3 rounded-2xl bg-aurora-surface text-aurora-primary border border-aurora-border mb-2 shadow-sm">
          <ShieldCheck className="w-8 h-8 text-aurora-primary" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-aurora-text">
          Privacy-Conscious by Architecture
        </h2>
        <p className="text-xs sm:text-sm text-aurora-muted max-w-xl mx-auto leading-relaxed">
          Your private conversation content is processed with local-first priority. Private transcripts are never stored on external clouds or collected without explicit consent.
        </p>
        <div className="pt-2">
          <button
            onClick={onOpenPrivacy}
            className="text-xs font-semibold text-aurora-primary hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            <span>Read our complete Privacy Architecture & Audit</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* 6. FINAL BOTTOM CTA BANNER */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-aurora-surface via-aurora-elevated to-aurora-surface border border-aurora-border text-center space-y-5 shadow-glow-mint">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-aurora-text">
            Ready to decode your unread conversations?
          </h3>
          <p className="text-xs sm:text-sm text-aurora-muted max-w-lg mx-auto leading-relaxed">
            Experience the future of conversation intelligence. No account required for the demo, no friction, no noise.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/app"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl font-bold text-sm bg-aurora-primary text-aurora-bg hover:bg-aurora-primary-hover shadow-lg shadow-aurora-primary/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Launch MissIQ Workspace →</span>
            </Link>
            <Link
              to="/demo"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl font-medium text-sm text-aurora-text bg-aurora-surface border border-aurora-border hover:border-aurora-primary/50 transition-colors"
            >
              <span>Try Guest Sandbox</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

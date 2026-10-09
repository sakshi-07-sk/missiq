export interface PresetSample {
  id: string;
  title: string;
  subtitle: string;
  context: 'college' | 'work' | 'project' | 'general';
  defaultUserName: string;
  description: string;
  icon: string;
  text: string;
}

export const PRESET_SAMPLES: PresetSample[] = [
  {
    id: 'college-announcements',
    title: 'College & Exams',
    subtitle: 'CS302 Midterm reschedule, Assignment 4 deadline, fee dates',
    context: 'college',
    defaultUserName: 'Priya',
    description: 'Assignment deadlines, exam announcements, faculty instructions, and missed updates.',
    icon: 'GraduationCap',
    text: `[08:45 AM] Class Rep Rohit: Good morning everyone. Please note that Professor Sharma rescheduled the CS302 Distributed Systems midterm exam to next Wednesday at 10:00 AM in Audi-2.
[08:48 AM] Priya: Thanks Rohit! Is the submission portal for Assignment 4 still closing tonight?
[08:50 AM] Rohit: Urgent: Assignment 4 portal closes strictly tonight at 11:59 PM. Late submissions will receive an automatic 20% penalty.
[08:52 AM] Ananya: @Priya can you share the benchmark test dataset link? The Google Drive link on Moodle is showing Permission Denied.
[08:55 AM] Priya: Yes Ananya, I will re-share the public dataset link on the class forum before 1:00 PM today.
[09:02 AM] Vikram: Does anyone know if Question 5 on Raft Consensus is mandatory or optional?
[09:05 AM] Rohit: Decision: The TA confirmed Question 5 is strictly mandatory for team projects, but optional for individual submissions.
[09:12 AM] Ananya: Action item: Vikram needs to commit the Docker Compose setup to GitHub before 6:00 PM so we can run integration tests.
[09:15 AM] Vikram: Understood, I'm working on the compose file now. Will push by 5:30 PM.
[09:20 AM] Rohit: Also, college fee payment deadline for Semester 6 is this Friday, October 16th. Don't miss it or hall tickets won't be issued.
[09:25 AM] Class Rep Rohit: Please fill out the lab elective preference form by tomorrow 5:00 PM. Forms submitted after that will not be accepted.`
  },
  {
    id: 'hackathon-crunch',
    title: 'Hackathon Team',
    subtitle: '4-hour sprint countdown, demo video, slide deck, Alex tasks',
    context: 'project',
    defaultUserName: 'Alex',
    description: 'Team decisions, submission deadlines, assigned tasks, and last-minute changes.',
    icon: 'Trophy',
    text: `[11:00 AM] Maya (Team Lead): Team, hackathon code freeze is strictly at 4:00 PM today! We have exactly 5 hours left before judging begins.
[11:02 AM] Alex: I finished wiring up the local IndexedDB history and client-side NLP engine. Everything is running 100% on-device with zero server latency.
[11:05 AM] David: The responsive dashboard and charts look awesome. I am polishing mobile tablet views now.
[11:08 AM] Maya: Alex, can you record the 2-minute demo video and voiceover by 2:00 PM? We must upload to YouTube before the portal slows down.
[11:10 AM] Alex: Absolutely Maya, I will record the screen walk-through and voiceover by 1:30 PM.
[11:15 AM] David: Decision: Let's make the deep navy theme with teal accents the default appearance. The contrast is much sharper for judges on stage projectors.
[11:18 AM] Maya: Agreed! Confirmed decision: Navy & Teal theme is locked in.
[11:22 AM] Sarah: I am drafting the Devpost project description and problem statement. Who is handling the slide deck?
[11:25 AM] Maya: Sarah, please finalize the 5-slide pitch deck by 2:30 PM. I will review it right after.
[11:30 AM] Sarah: On it! I will have the Google Slides link ready by 2:00 PM.
[11:35 AM] Maya: Critical reminder for everyone: check your commits and ensure zero private API keys or personal tokens are included. Strict zero-leak policy.
[11:40 AM] Alex: Verified. Everything is safely kept in .env.example with no raw credentials committed.
[11:45 AM] Maya: Alex, please verify that both TXT file upload and Markdown export work cleanly across Chrome and Safari before 3:00 PM.
[11:48 AM] Alex: Running the cross-browser file tests right now.`
  },
  {
    id: 'work-strategy',
    title: 'Work & Projects',
    subtitle: 'Budget freeze decision, FinCorp briefing, tonight\'s DB maintenance',
    context: 'work',
    defaultUserName: 'Elena',
    description: 'Meeting notes, action items, project decisions, and upcoming milestones.',
    icon: 'Briefcase',
    text: `[09:15 AM] Jordan (VP Eng): Morning team. Let's align on the Q3 release schedule and the AWS migration timeline.
[09:18 AM] Elena: Cloud infrastructure costs climbed 22% last month. We need to implement an auto-scaling cooldown policy.
[09:20 AM] Jordan: Agreed. Decision: We are freezing non-critical EC2 instances starting this Thursday and setting our monthly budget ceiling at $40,000.
[09:25 AM] Marcus: What about the new customer auth microservice? The staging penetration test reported two rate-limiting warnings.
[09:28 AM] Jordan: Marcus, please patch the token bucket rate limiter and re-deploy to staging by 3:00 PM today.
[09:30 AM] Marcus: I will handle the rate-limiter fix and run the security regression suite before 2:30 PM.
[09:35 AM] Elena: We have the customer executive briefing with FinCorp on Friday at 11:00 AM EST.
[09:38 AM] Jordan: Elena, can you prepare the architecture compliance report for FinCorp before Thursday 5:00 PM?
[09:40 AM] Elena: Yes, I will draft the SOC2 architecture report and send it to you for review tomorrow.
[09:45 AM] Marcus: Reminder: Production database index maintenance is scheduled for tonight at 10:00 PM. Expect 5 minutes of read-only mode.
[09:50 AM] Jordan: Action item: Jordan needs to notify customer support team about tonight's 10:00 PM maintenance window before 1:00 PM.`
  }
];

export type PriorityLevel = 'High' | 'Medium' | 'Low';
export type UserRole = 'guest' | 'registered' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isGuest: boolean;
}

export interface ChatMessage {
  id: string;
  sender: string;
  timestamp?: string;
  rawTime?: string;
  content: string;
  originalIndex: number;
}

export interface ActionItem {
  id: string;
  task: string;
  owner: string; // "Not specified" if missing
  dueDate: string; // "Not specified" if missing
  priority: PriorityLevel;
  priorityReason: string;
  sourceMessageId: string;
  sourceSender: string;
  sourceTimestamp?: string;
  sourceExcerpt: string;
  completed?: boolean;
}

export interface DecisionItem {
  id: string;
  decision: string;
  context: string;
  status: 'Confirmed' | 'Under Discussion' | 'Proposed';
  stakeholders: string[];
  sourceMessageId: string;
  sourceSender: string;
  sourceTimestamp?: string;
  sourceExcerpt: string;
}

export interface PriorityItem {
  id: string;
  title: string;
  description: string;
  priority: PriorityLevel;
  reason: string;
  category: 'Blocker' | 'Deadline' | 'Decision' | 'Action' | 'Update';
  sourceMessageId: string;
  sourceSender: string;
  sourceExcerpt: string;
}

export interface MentionItem {
  id: string;
  mentionedUser: string;
  context: string;
  isActionable: boolean;
  priority: PriorityLevel;
  sourceMessageId: string;
  sourceSender: string;
  sourceTimestamp?: string;
  sourceExcerpt: string;
}

export interface DeadlineItem {
  id: string;
  title: string;
  dueDate: string;
  owner: string;
  urgency: 'Overdue' | 'Today' | 'Upcoming' | 'Flexible';
  sourceMessageId: string;
  sourceSender: string;
  sourceExcerpt: string;
}

export interface CatchUpSummary {
  executiveOverview: string;
  keyThemes: string[];
  immediateAttentionItems: string[];
  openQuestionsOrRisks: string[];
  readingTimeSavedMinutes: number;
  totalMessagesCount: number;
  participantCount: number;
  participants: string[];
}

export interface CatchUpAnalysis {
  summary: CatchUpSummary;
  priorities: PriorityItem[];
  decisions: DecisionItem[];
  actionItems: ActionItem[];
  mentions: MentionItem[];
  deadlines: DeadlineItem[];
  allMessages: ChatMessage[];
  analyzedAt: string;
  processingEngine: string;
}

export interface AnalysisConfig {
  userName?: string;
  strictGrounding?: boolean;
  useCloudAi?: boolean;
  apiKey?: string;
  apiProvider?: 'openai' | 'gemini' | 'anthropic';
}

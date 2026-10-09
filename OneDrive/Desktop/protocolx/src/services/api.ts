import { CatchUpAnalysis, ChatMessage } from '../types';
import { parseConversation } from './parser';
import { analyzeConversationLocally } from './localAnalyzer';

const BACKEND_URL = 'http://localhost:8000';

export interface AnalyzeRequestOptions {
  text: string;
  userName?: string;
  context?: 'general' | 'college' | 'work' | 'project';
  summaryLength?: 'short' | 'detailed';
  useCloudAi?: boolean;
  preferBackend?: boolean;
}

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/health`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(1500)
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function analyzeConversationService(options: AnalyzeRequestOptions): Promise<CatchUpAnalysis> {
  const { text, userName, context = 'general', summaryLength = 'detailed', useCloudAi = false, preferBackend = true } = options;

  if (!text || !text.trim()) {
    throw new Error('Please enter or paste a conversation to analyze.');
  }

  // If user prefers backend and backend is reachable, try FastAPI
  if (preferBackend) {
    try {
      const response = await fetch(`${BACKEND_URL}/api/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          text,
          user_name: userName || null,
          context,
          summary_length: summaryLength,
          use_cloud_ai: useCloudAi
        }),
        signal: AbortSignal.timeout(6000)
      });

      if (response.ok) {
        const data = await response.json();
        // Transform backend response into CatchUpAnalysis format
        return {
          summary: {
            executiveOverview: data.summary.overall_summary,
            keyThemes: data.summary.decisions_made.length > 0 
              ? [`Key decisions: ${data.summary.decisions_made.join(', ')}`, ...data.summary.main_discussion_points]
              : data.summary.main_discussion_points,
            immediateAttentionItems: data.summary.items_requiring_attention || [],
            openQuestionsOrRisks: data.summary.pending_questions || [],
            readingTimeSavedMinutes: data.summary.reading_time_saved_minutes,
            totalMessagesCount: data.summary.total_messages_count,
            participantCount: data.summary.participant_count,
            participants: data.summary.participants || []
          },
          priorities: (data.important_messages || []).map((m: any) => ({
            id: m.id,
            title: m.message.length > 60 ? m.message.substring(0, 57) + '...' : m.message,
            description: m.message,
            priority: m.priority === 'HIGH' ? 'High' : m.priority === 'MEDIUM' ? 'Medium' : 'Low',
            reason: m.reason,
            category: m.category,
            sourceMessageId: m.source_id,
            sourceSender: m.source_sender,
            sourceExcerpt: m.message
          })),
          decisions: (data.decisions || []).map((d: any) => ({
            id: d.id,
            decision: d.decision,
            context: d.context,
            status: d.status,
            stakeholders: d.stakeholders || [],
            sourceMessageId: d.source_id,
            sourceSender: d.source_sender,
            sourceTimestamp: undefined,
            sourceExcerpt: d.source_excerpt
          })),
          actionItems: (data.action_items || []).map((a: any) => ({
            id: a.id,
            task: a.task,
            owner: a.owner || 'Not specified',
            dueDate: a.deadline || 'Not specified',
            priority: a.priority === 'HIGH' ? 'High' : a.priority === 'MEDIUM' ? 'Medium' : 'Low',
            priorityReason: a.priority_reason,
            sourceMessageId: a.source_id,
            sourceSender: a.source_sender,
            sourceTimestamp: undefined,
            sourceExcerpt: a.source_excerpt,
            completed: a.completed || false
          })),
          mentions: (data.mentions || []).map((m: any) => ({
            id: m.id,
            mentionedUser: m.mentioned_user,
            context: m.message,
            isActionable: m.is_actionable,
            priority: m.priority === 'HIGH' ? 'High' : 'Medium',
            sourceMessageId: m.source_id,
            sourceSender: m.sender,
            sourceTimestamp: m.timestamp,
            sourceExcerpt: m.message
          })),
          deadlines: (data.deadlines || []).map((dl: any) => ({
            id: dl.id,
            title: dl.title,
            dueDate: dl.due_date,
            owner: dl.owner || 'Not specified',
            urgency: dl.urgency,
            sourceMessageId: dl.source_id,
            sourceSender: dl.source_sender,
            sourceExcerpt: dl.source_excerpt
          })),
          allMessages: (data.all_messages || []).map((msg: any) => ({
            id: msg.id,
            sender: msg.sender,
            timestamp: msg.timestamp,
            content: msg.content,
            originalIndex: msg.original_index
          })),
          analyzedAt: data.analyzed_at || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          processingEngine: data.processing_engine || 'MissIQ FastAPI Service'
        };
      }
    } catch {
      // Backend unavailable or timed out; fall through seamlessly to local client analyzer
    }
  }

  // 100% Client-Side Local Engine Fallback
  const parsedMessages: ChatMessage[] = parseConversation(text);
  if (parsedMessages.length === 0) {
    throw new Error('No valid messages detected in conversation.');
  }

  const localResult = analyzeConversationLocally(parsedMessages, {
    userName,
    strictGrounding: true
  });
  localResult.processingEngine = 'MissIQ On-Device Client Engine';
  return localResult;
}

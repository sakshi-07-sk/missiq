import {
  ChatMessage,
  CatchUpAnalysis,
  ActionItem,
  DecisionItem,
  PriorityItem,
  MentionItem,
  DeadlineItem,
  PriorityLevel,
  AnalysisConfig
} from '../types';

// Helper to calculate reading time saved based on average reading speed (225 words per min)
function calculateReadingTimeSaved(messages: ChatMessage[]): number {
  const totalWords = messages.reduce((acc, msg) => acc + msg.content.split(/\s+/).length, 0);
  const minutes = Math.ceil(totalWords / 200);
  return Math.max(1, minutes);
}

// Deadlines & Date matcher regex patterns
const DATE_PATTERNS = [
  /\b(?:by|before|until|due|deadline)\s+([A-Za-z]+(?:\s+\d{1,2}(?:st|nd|rd|th)?)?(?:\s+at\s+\d{1,2}(?::\d{2})?\s*(?:am|pm|est|pst|utc|gmt)?)?)/i,
  /\b(?:today|tonight|tomorrow|eod|cob|asap|friday|monday|tuesday|wednesday|thursday|saturday|sunday)(?:\s+at\s+\d{1,2}(?::\d{2})?\s*(?:am|pm)?)?/i,
  /\b\d{1,2}\/\d{1,2}(?:\/\d{2,4})?(?:\s+at\s+\d{1,2}(?::\d{2})?\s*(?:am|pm)?)?/i,
  /\b(?:by\s+)?(\d{1,2}(?::\d{2})?\s*(?:am|pm|est|pst|utc|gmt))\b/i
];

// High urgency indicators
const HIGH_PRIORITY_KEYWORDS = [
  'urgent', 'asap', 'blocker', 'blocking', 'p0', 'p1', 'critical', 'down', 'outage',
  'emergency', 'deadline today', 'immediate', 'must fix', 'broken', 'breach', 'failing'
];

// Medium priority indicators
const MED_PRIORITY_KEYWORDS = [
  'deadline', 'needed', 'please review', 'action item', 'decided', 'approved',
  'deploy', 'eod', 'tomorrow', 'meeting', 'release', 'update', 'status'
];

// Decision indicator verbs and phrases
const DECISION_PATTERNS = [
  /(?:we(?:'ve| have)? decided to|decision is to|agreed on|agreed that|final call is|let's go with|going with|approved|consensus is|we will proceed with)\s+([^.!?\n]+)/i,
  /(?:we decided|decided:)\s*([^.!?\n]+)/i,
  /(?:the plan is to|moving forward with)\s+([^.!?\n]+)/i,
];

// Open discussion / uncertain phrases
const UNCERTAIN_PATTERNS = [
  /(?:should we|what if|maybe we can|thinking of|proposing|proposal:|could we|open question|any thoughts on)\s+([^.!?\n]+)/i,
  /\b(?:tentative|tbd|to be decided|not final|unconfirmed|pending approval)\b/i
];

// Action item patterns (imperatives, assignments)
const ACTION_PATTERNS = [
  /(?:can you|could you|please|pls)\s+([^.!?\n]+)/i,
  /(?:i will|i'll|i am going to|i'll take care of)\s+([^.!?\n]+)/i,
  /(?:action item|todo|to-do|task):\s*([^.!?\n]+)/i,
  /(?:need to|needs to|have to|we must|make sure to|don't forget to)\s+([^.!?\n]+)/i,
  /(?:assigned to\s+([A-Za-z0-9_]+)):\s*([^.!?\n]+)/i,
  /([A-Za-z0-9_]+)\s+(?:will|should|to)\s+(?:handle|fix|implement|create|send|verify|review|update)\s+([^.!?\n]+)/i
];

export function analyzeConversationLocally(
  messages: ChatMessage[],
  config: AnalysisConfig = { strictGrounding: true }
): CatchUpAnalysis {
  if (!messages || messages.length === 0) {
    throw new Error('No messages provided to analyze.');
  }

  const participantsSet = new Set<string>();
  messages.forEach(m => {
    if (m.sender && m.sender !== 'Message') {
      participantsSet.add(m.sender);
    }
  });
  const participants = Array.from(participantsSet);

  const priorities: PriorityItem[] = [];
  const decisions: DecisionItem[] = [];
  const actionItems: ActionItem[] = [];
  const mentions: MentionItem[] = [];
  const deadlines: DeadlineItem[] = [];

  const userIdentifier = config.userName ? config.userName.trim().toLowerCase() : '';

  // Process each message
  messages.forEach((msg, idx) => {
    const text = msg.content;
    const lowerText = text.toLowerCase();

    // 1. Check for Mentions
    if (userIdentifier) {
      const isMentioned = lowerText.includes(userIdentifier) || 
        (userIdentifier.startsWith('@') ? lowerText.includes(userIdentifier.slice(1)) : lowerText.includes(`@${userIdentifier}`));

      if (isMentioned && msg.sender.toLowerCase() !== userIdentifier) {
        // Determine if actionable
        const isActionable = ACTION_PATTERNS.some(p => p.test(text)) || 
          lowerText.includes('can you') || lowerText.includes('need you to') || lowerText.includes('?');

        const priority: PriorityLevel = isActionable ? 'High' : 'Medium';

        mentions.push({
          id: `mention-${mentions.length + 1}`,
          mentionedUser: config.userName || 'You',
          context: text.length > 180 ? text.substring(0, 180) + '...' : text,
          isActionable,
          priority,
          sourceMessageId: msg.id,
          sourceSender: msg.sender,
          sourceTimestamp: msg.timestamp,
          sourceExcerpt: text
        });
      }
    }

    // 2. Check for Decisions
    let decisionFound = false;
    for (const pattern of DECISION_PATTERNS) {
      const match = text.match(pattern);
      if (match) {
        const decisionText = match[1]?.trim() || text;
        const isUncertain = UNCERTAIN_PATTERNS.some(p => p.test(text));
        
        decisions.push({
          id: `decision-${decisions.length + 1}`,
          decision: decisionText.charAt(0).toUpperCase() + decisionText.slice(1),
          context: text,
          status: isUncertain ? 'Under Discussion' : 'Confirmed',
          stakeholders: [msg.sender],
          sourceMessageId: msg.id,
          sourceSender: msg.sender,
          sourceTimestamp: msg.timestamp,
          sourceExcerpt: text
        });
        decisionFound = true;
        break;
      }
    }

    // 3. Check for Action Items
    let actionFound = false;
    for (const pattern of ACTION_PATTERNS) {
      const match = text.match(pattern);
      if (match) {
        let task = (match[2] || match[1] || text).trim();
        // Clean task
        task = task.replace(/^(can you|please|pls|i will|i'll|todo:|to-do:)\s+/i, '');
        if (task.length > 5) {
          // Identify Owner strictly:
          let owner = 'Not specified';
          if (lowerText.startsWith("i'll") || lowerText.startsWith("i will") || lowerText.includes("i'm on it")) {
            owner = msg.sender;
          } else if (match[1] && participants.includes(match[1])) {
            owner = match[1];
          } else {
            // Check if directed at a participant name
            for (const p of participants) {
              if (lowerText.includes(p.toLowerCase()) && p !== msg.sender) {
                owner = p;
                break;
              }
            }
          }

          // Identify Due Date strictly:
          let dueDate = 'Not specified';
          for (const datePat of DATE_PATTERNS) {
            const dateMatch = text.match(datePat);
            if (dateMatch) {
              dueDate = (dateMatch[1] || dateMatch[0]).trim();
              break;
            }
          }

          // Prioritization
          let priority: PriorityLevel = 'Medium';
          let priorityReason = 'Standard team follow-up action';
          if (HIGH_PRIORITY_KEYWORDS.some(k => lowerText.includes(k)) || dueDate.toLowerCase().includes('today') || dueDate.toLowerCase().includes('asap')) {
            priority = 'High';
            priorityReason = 'Urgent timeframe or blocker indicator present in conversation';
          } else if (text.length < 30 && !dueDate) {
            priority = 'Low';
            priorityReason = 'Routine minor task with no strict deadline';
          }

          actionItems.push({
            id: `action-${actionItems.length + 1}`,
            task: task.charAt(0).toUpperCase() + task.slice(1),
            owner,
            dueDate,
            priority,
            priorityReason,
            sourceMessageId: msg.id,
            sourceSender: msg.sender,
            sourceTimestamp: msg.timestamp,
            sourceExcerpt: text,
            completed: false
          });
          actionFound = true;
          break;
        }
      }
    }

    // 4. Check for Deadlines & Key Dates
    for (const datePat of DATE_PATTERNS) {
      const match = text.match(datePat);
      if (match && !text.includes('?')) {
        const detectedDate = (match[1] || match[0]).trim();
        let urgency: 'Overdue' | 'Today' | 'Upcoming' | 'Flexible' = 'Upcoming';
        const dLower = detectedDate.toLowerCase();
        if (dLower.includes('today') || dLower.includes('tonight') || dLower.includes('asap') || dLower.includes('cob') || dLower.includes('eod')) {
          urgency = 'Today';
        } else if (dLower.includes('yesterday') || dLower.includes('missed') || dLower.includes('overdue')) {
          urgency = 'Overdue';
        }

        // Avoid duplicate dates for same message
        if (!deadlines.some(d => d.sourceMessageId === msg.id)) {
          deadlines.push({
            id: `deadline-${deadlines.length + 1}`,
            title: text.length > 70 ? text.substring(0, 67) + '...' : text,
            dueDate: detectedDate,
            owner: msg.sender,
            urgency,
            sourceMessageId: msg.id,
            sourceSender: msg.sender,
            sourceExcerpt: text
          });
        }
        break;
      }
    }

    // 5. Priorities Feed (Categorizing important messages)
    const isHigh = HIGH_PRIORITY_KEYWORDS.some(k => lowerText.includes(k));
    const isMed = MED_PRIORITY_KEYWORDS.some(k => lowerText.includes(k)) || decisionFound || actionFound;

    if (isHigh) {
      priorities.push({
        id: `prio-${priorities.length + 1}`,
        title: text.length > 60 ? text.substring(0, 57) + '...' : text,
        description: text,
        priority: 'High',
        reason: 'Flagged with critical priority keyword (outage, urgent, blocker, or immediate deadline)',
        category: lowerText.includes('block') ? 'Blocker' : lowerText.includes('deadline') ? 'Deadline' : 'Update',
        sourceMessageId: msg.id,
        sourceSender: msg.sender,
        sourceExcerpt: text
      });
    } else if (isMed && priorities.length < 8) {
      priorities.push({
        id: `prio-${priorities.length + 1}`,
        title: text.length > 60 ? text.substring(0, 57) + '...' : text,
        description: text,
        priority: 'Medium',
        reason: decisionFound ? 'Confirmed strategic team decision' : actionFound ? 'Actionable deliverable requiring tracking' : 'Key project update or milestone',
        category: decisionFound ? 'Decision' : actionFound ? 'Action' : 'Update',
        sourceMessageId: msg.id,
        sourceSender: msg.sender,
        sourceExcerpt: text
      });
    }
  });

  // Generate Executive Catch-Up Summary Grounded in Extracted Items
  const immediateAttentionItems: string[] = [];
  priorities.filter(p => p.priority === 'High').slice(0, 3).forEach(p => {
    immediateAttentionItems.push(`[${p.sourceSender}] ${p.title}`);
  });
  if (mentions.length > 0) {
    immediateAttentionItems.push(`${mentions.length} direct mention(s) waiting for your response`);
  }
  if (deadlines.some(d => d.urgency === 'Today' || d.urgency === 'Overdue')) {
    const urgentD = deadlines.filter(d => d.urgency === 'Today' || d.urgency === 'Overdue');
    immediateAttentionItems.push(`${urgentD.length} deliverable(s) due today or flagged as overdue`);
  }

  // Derive Key Themes from participants, decisions, actions
  const keyThemes: string[] = [];
  if (decisions.length > 0) {
    keyThemes.push(`Finalized ${decisions.length} decision(s) including: "${decisions[0].decision}"`);
  }
  if (actionItems.length > 0) {
    keyThemes.push(`Identified ${actionItems.length} next step(s) with ${actionItems.filter(a => a.owner !== 'Not specified').length} assigned`);
  }
  if (deadlines.length > 0) {
    keyThemes.push(`${deadlines.length} key milestone(s) or deadline(s) established`);
  }
  if (keyThemes.length === 0) {
    keyThemes.push(`General team collaboration across ${messages.length} messages`);
  }

  // Build Executive Overview Paragraph
  const participantList = participants.slice(0, 4).join(', ') + (participants.length > 4 ? ` and ${participants.length - 4} others` : '');
  const blockerCount = priorities.filter(p => p.category === 'Blocker').length;
  
  let executiveOverview = `Thread between ${participantList || 'participants'} covering ${messages.length} messages. `;
  if (blockerCount > 0) {
    executiveOverview += `⚠️ ${blockerCount} critical blocker(s) require active intervention. `;
  }
  if (decisions.length > 0) {
    executiveOverview += `The team reached consensus on ${decisions.length} key point(s). `;
  }
  if (actionItems.length > 0) {
    executiveOverview += `${actionItems.length} action item(s) are outlined below for execution.`;
  } else {
    executiveOverview += `Conversation contains updates and status discussions without pending tasks.`;
  }

  const openQuestionsOrRisks: string[] = [];
  decisions.filter(d => d.status === 'Under Discussion').forEach(d => {
    openQuestionsOrRisks.push(`Unresolved discussion: ${d.decision}`);
  });
  actionItems.filter(a => a.owner === 'Not specified').slice(0, 2).forEach(a => {
    openQuestionsOrRisks.push(`Unassigned action: "${a.task}" (no owner specified)`);
  });

  return {
    summary: {
      executiveOverview,
      keyThemes,
      immediateAttentionItems,
      openQuestionsOrRisks,
      readingTimeSavedMinutes: calculateReadingTimeSaved(messages),
      totalMessagesCount: messages.length,
      participantCount: participants.length,
      participants
    },
    priorities,
    decisions,
    actionItems,
    mentions,
    deadlines,
    allMessages: messages,
    analyzedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    processingEngine: 'Local-First Heuristic Engine'
  };
}

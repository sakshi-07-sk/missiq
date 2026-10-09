import { ChatMessage } from '../types';
import { validateInputPayload, sanitizeText } from './sanitizer';

const MAX_LINE_LENGTH = 10_000;
const MAX_PARSED_MESSAGES = 2_500;

export function parseConversation(rawText: string): ChatMessage[] {
  const { isValid, sanitized } = validateInputPayload(rawText);
  if (!isValid || !sanitized) {
    return [];
  }

  const trimmed = sanitized;

  // 1. Check if input is valid JSON
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const messages: ChatMessage[] = [];
        parsed.slice(0, MAX_PARSED_MESSAGES).forEach((item, idx) => {
          const sender = sanitizeText(String(item.sender || item.author || item.user || item.name || `User ${idx + 1}`));
          const content = sanitizeText(String(item.text || item.content || item.message || ''));
          const timestamp = item.timestamp || item.time || item.date || undefined;
          if (content.trim()) {
            messages.push({
              id: `msg-${idx + 1}`,
              sender: sender.trim().slice(0, 80),
              timestamp: timestamp ? String(timestamp).trim().slice(0, 50) : undefined,
              rawTime: timestamp ? String(timestamp).trim().slice(0, 50) : undefined,
              content: content.trim(),
              originalIndex: idx,
            });
          }
        });
        if (messages.length > 0) return messages;
      }
    } catch {
      // Continue to regex parsers
    }
  }

  // Regex patterns for different chat platforms:
  // Slack pattern: [10:30 AM] Alice: Hello or Alice [10:30 AM]: Hello
  const slackPattern1 = /^\[([^\]]{1,50})\]\s+([^:]{1,80}):\s*(.*)$/;
  const slackPattern2 = /^([^\[:]{1,80})\[([^\]]{1,50})\]:\s*(.*)$/;
  const slackPattern3 = /^([^:]{1,80})\s+(\d{1,2}:\d{2}(?:\s*[AaPp][Mm])?):\s*(.*)$/;

  // WhatsApp patterns:
  // 10/12/26, 9:30 AM - Bob: Hello
  // [10/12/26, 9:30:15 AM] Bob: Hello
  const whatsAppPattern1 = /^(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4},?\s+\d{1,2}:\d{2}(?::\d{2})?(?:\s*[AaPp][Mm])?)\s*[-—]\s*([^:]{1,80}):\s*(.*)$/;
  const whatsAppPattern2 = /^\[(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4},?\s+\d{1,2}:\d{2}(?::\d{2})?(?:\s*[AaPp][Mm])?)\]\s*([^:]{1,80}):\s*(.*)$/;

  // Discord / Teams patterns:
  // Alice — Today at 3:15 PM: Hello
  // Alice at 3:15 PM: Hello
  const discordPattern = /^([^\—\-:]{1,80})\s*[\—\-]?\s*(?:Today at|Yesterday at|at)?\s*(\d{1,2}:\d{2}(?:\s*[AaPp][Mm])?):\s*(.*)$/;

  // Generic Name: Message pattern
  const genericColonPattern = /^([A-Z0-9a-z\s\._@\-\(\)]{1,80}?):\s+(.*)$/;

  const lines = trimmed.split(/\r?\n/);
  const messages: ChatMessage[] = [];
  let currentMsg: ChatMessage | null = null;
  let counter = 1;

  for (let i = 0; i < lines.length && messages.length < MAX_PARSED_MESSAGES; i++) {
    // ReDoS protection: bound line length to MAX_LINE_LENGTH
    let line = lines[i];
    if (line.length > MAX_LINE_LENGTH) {
      line = line.slice(0, MAX_LINE_LENGTH);
    }
    if (!line.trim()) {
      if (currentMsg) {
        currentMsg.content += '\n';
      }
      continue;
    }

    let match: RegExpMatchArray | null = null;

    // Try WhatsApp Pattern 1
    match = line.match(whatsAppPattern1);
    if (match) {
      if (currentMsg) messages.push(currentMsg);
      currentMsg = {
        id: `msg-${counter++}`,
        sender: match[2].trim(),
        timestamp: match[1].trim(),
        rawTime: match[1].trim(),
        content: match[3].trim(),
        originalIndex: i,
      };
      continue;
    }

    // Try WhatsApp Pattern 2
    match = line.match(whatsAppPattern2);
    if (match) {
      if (currentMsg) messages.push(currentMsg);
      currentMsg = {
        id: `msg-${counter++}`,
        sender: match[2].trim(),
        timestamp: match[1].trim(),
        rawTime: match[1].trim(),
        content: match[3].trim(),
        originalIndex: i,
      };
      continue;
    }

    // Try Slack Pattern 1: [10:30 AM] Alice: text
    match = line.match(slackPattern1);
    if (match) {
      if (currentMsg) messages.push(currentMsg);
      currentMsg = {
        id: `msg-${counter++}`,
        sender: match[2].trim(),
        timestamp: match[1].trim(),
        rawTime: match[1].trim(),
        content: match[3].trim(),
        originalIndex: i,
      };
      continue;
    }

    // Try Slack Pattern 2: Alice [10:30 AM]: text
    match = line.match(slackPattern2);
    if (match) {
      if (currentMsg) messages.push(currentMsg);
      currentMsg = {
        id: `msg-${counter++}`,
        sender: match[1].trim(),
        timestamp: match[2].trim(),
        rawTime: match[2].trim(),
        content: match[3].trim(),
        originalIndex: i,
      };
      continue;
    }

    // Try Discord / Teams pattern
    match = line.match(discordPattern);
    if (match && match[1].trim().length < 40 && !match[1].toLowerCase().includes('http')) {
      if (currentMsg) messages.push(currentMsg);
      currentMsg = {
        id: `msg-${counter++}`,
        sender: match[1].trim(),
        timestamp: match[2].trim(),
        rawTime: match[2].trim(),
        content: match[3].trim(),
        originalIndex: i,
      };
      continue;
    }

    // Try Slack Pattern 3: Alice 10:45 AM: text
    match = line.match(slackPattern3);
    if (match && match[1].trim().length < 35) {
      if (currentMsg) messages.push(currentMsg);
      currentMsg = {
        id: `msg-${counter++}`,
        sender: match[1].trim(),
        timestamp: match[2].trim(),
        rawTime: match[2].trim(),
        content: match[3].trim(),
        originalIndex: i,
      };
      continue;
    }

    // Try generic Name: Message pattern
    match = line.match(genericColonPattern);
    if (match && match[1].length <= 35 && !match[1].toLowerCase().includes('http') && !match[1].toLowerCase().includes('note')) {
      if (currentMsg) messages.push(currentMsg);
      currentMsg = {
        id: `msg-${counter++}`,
        sender: match[1].trim(),
        content: match[2].trim(),
        originalIndex: i,
      };
      continue;
    }

    // If no pattern matched, append to current message if exists
    if (currentMsg) {
      currentMsg.content += '\n' + line.trim();
    } else {
      // First line without author header
      currentMsg = {
        id: `msg-${counter++}`,
        sender: 'Message',
        content: line.trim(),
        originalIndex: i,
      };
    }
  }

  if (currentMsg) {
    messages.push(currentMsg);
  }

  return messages;
}

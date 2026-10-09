import re
import datetime
from typing import List, Dict, Any, Tuple, Optional
from models import (
    ChatMessage,
    ImportantMessage,
    DecisionItem,
    ActionItem,
    MentionItem,
    DeadlineItem,
    CatchUpSummary,
    AnalysisResponse,
    PriorityType,
    DeadlineUrgencyType
)

# Regex patterns for parsing chat exports
SLACK_PATTERN_1 = re.compile(r"^\[([^\]]+)\]\s+([^:]+):\s*(.*)$")
SLACK_PATTERN_2 = re.compile(r"^([^\[:]+)\[([^\]]+)\]:\s*(.*)$")
WHATSAPP_PATTERN_1 = re.compile(r"^(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4},?\s+\d{1,2}:\d{2}(?::\d{2})?(?:\s*[AaPp][Mm])?)\s*[-—]\s*([^:]+):\s*(.*)$")
WHATSAPP_PATTERN_2 = re.compile(r"^\[(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4},?\s+\d{1,2}:\d{2}(?::\d{2})?(?:\s*[AaPp][Mm])?)\]\s*([^:]+):\s*(.*)$")
DISCORD_PATTERN = re.compile(r"^([^\—\-:]+)\s*[\—\-]?\s*(?:Today at|Yesterday at|at)?\s*(\d{1,2}:\d{2}(?:\s*[AaPp][Mm])?):\s*(.*)$")
GENERIC_COLON_PATTERN = re.compile(r"^([A-Z0-9a-z\s\._@\-\(\)]+?):\s+(.*)$")

# Date & Deadline patterns
DATE_PATTERNS = [
    re.compile(r"\b(?:by|before|until|due|deadline)\s+([A-Za-z]+(?:\s+\d{1,2}(?:st|nd|rd|th)?)?(?:\s+at\s+\d{1,2}(?::\d{2})?\s*(?:am|pm|est|pst|utc|gmt)?)?)", re.I),
    re.compile(r"\b(?:today|tonight|tomorrow|eod|cob|asap|friday|monday|tuesday|wednesday|thursday|saturday|sunday)(?:\s+at\s+\d{1,2}(?::\d{2})?\s*(?:am|pm)?)?", re.I),
    re.compile(r"\b\d{1,2}\/\d{1,2}(?:\/\d{2,4})?(?:\s+at\s+\d{1,2}(?::\d{2})?\s*(?:am|pm)?)?", re.I),
    re.compile(r"\b(?:by\s+)?(\d{1,2}(?::\d{2})?\s*(?:am|pm|est|pst|utc|gmt))\b", re.I)
]

# Keywords for priority triage
HIGH_KEYWORDS = [
    'urgent', 'asap', 'blocker', 'blocking', 'p0', 'p1', 'critical', 'down', 'outage',
    'emergency', 'deadline today', 'immediate', 'must fix', 'penalty', 'strict', 'rescheduled'
]

MED_KEYWORDS = [
    'deadline', 'needed', 'please review', 'action item', 'decided', 'approved',
    'deploy', 'eod', 'tomorrow', 'meeting', 'release', 'update', 'status', 'form'
]

DECISION_PATTERNS = [
    re.compile(r"(?:we(?:'ve| have)? decided to|decision is to|agreed on|agreed that|final call is|let's go with|going with|approved|consensus is|confirmed decision:)\s+([^.!?\n]+)", re.I),
    re.compile(r"(?:we decided|decided:)\s*([^.!?\n]+)", re.I),
    re.compile(r"(?:the plan is to|moving forward with)\s+([^.!?\n]+)", re.I),
]

UNCERTAIN_PATTERNS = [
    re.compile(r"(?:should we|what if|maybe we can|thinking of|proposing|proposal:|could we|open question|any thoughts on)\s+([^.!?\n]+)", re.I),
    re.compile(r"\b(?:tentative|tbd|to be decided|not final|unconfirmed|pending approval)\b", re.I)
]

ACTION_PATTERNS = [
    re.compile(r"(?:can you|could you|please|pls)\s+([^.!?\n]+)", re.I),
    re.compile(r"(?:i will|i'll|i am going to|i'll take care of)\s+([^.!?\n]+)", re.I),
    re.compile(r"(?:action item|todo|to-do|task):\s*([^.!?\n]+)", re.I),
    re.compile(r"(?:need to|needs to|have to|we must|make sure to|don't forget to)\s+([^.!?\n]+)", re.I),
    re.compile(r"([A-Za-z0-9_]+)\s+(?:needs to|will|should|to)\s+(?:handle|fix|implement|create|send|verify|review|update|commit|finalize)\s+([^.!?\n]+)", re.I)
]

def normalize_whitespace(text: str) -> str:
    """Normalize excessive blank lines while preserving meaningful structure."""
    lines = [line.strip() for line in text.splitlines()]
    # Remove leading and trailing empty lines
    while lines and not lines[0]:
        lines.pop(0)
    while lines and not lines[-1]:
        lines.pop()
    return "\n".join(lines)

def parse_conversation(raw_text: str) -> List[ChatMessage]:
    """Parse chat transcript into structured ChatMessage objects."""
    clean_text = normalize_whitespace(raw_text)
    if not clean_text:
        return []

    lines = clean_text.splitlines()
    messages: List[ChatMessage] = []
    current_msg: Optional[ChatMessage] = None
    counter = 1

    for idx, line in enumerate(lines):
        if not line.strip():
            continue

        match = WHATSAPP_PATTERN_1.match(line)
        if match:
            if current_msg:
                messages.append(current_msg)
            current_msg = ChatMessage(
                id=f"msg-{counter}",
                sender=match.group(2).strip(),
                timestamp=match.group(1).strip(),
                content=match.group(3).strip(),
                original_index=idx
            )
            counter += 1
            continue

        match = WHATSAPP_PATTERN_2.match(line)
        if match:
            if current_msg:
                messages.append(current_msg)
            current_msg = ChatMessage(
                id=f"msg-{counter}",
                sender=match.group(2).strip(),
                timestamp=match.group(1).strip(),
                content=match.group(3).strip(),
                original_index=idx
            )
            counter += 1
            continue

        match = SLACK_PATTERN_1.match(line)
        if match:
            if current_msg:
                messages.append(current_msg)
            current_msg = ChatMessage(
                id=f"msg-{counter}",
                sender=match.group(2).strip(),
                timestamp=match.group(1).strip(),
                content=match.group(3).strip(),
                original_index=idx
            )
            counter += 1
            continue

        match = SLACK_PATTERN_2.match(line)
        if match:
            if current_msg:
                messages.append(current_msg)
            current_msg = ChatMessage(
                id=f"msg-{counter}",
                sender=match.group(1).strip(),
                timestamp=match.group(2).strip(),
                content=match.group(3).strip(),
                original_index=idx
            )
            counter += 1
            continue

        match = DISCORD_PATTERN.match(line)
        if match and len(match.group(1).strip()) < 40 and 'http' not in match.group(1).lower():
            if current_msg:
                messages.append(current_msg)
            current_msg = ChatMessage(
                id=f"msg-{counter}",
                sender=match.group(1).strip(),
                timestamp=match.group(2).strip(),
                content=match.group(3).strip(),
                original_index=idx
            )
            counter += 1
            continue

        match = GENERIC_COLON_PATTERN.match(line)
        if match and len(match.group(1).strip()) <= 35 and not match.group(1).lower().startswith('http'):
            if current_msg:
                messages.append(current_msg)
            current_msg = ChatMessage(
                id=f"msg-{counter}",
                sender=match.group(1).strip(),
                timestamp=None,
                content=match.group(2).strip(),
                original_index=idx
            )
            counter += 1
            continue

        if current_msg:
            current_msg.content += f"\n{line.strip()}"
        else:
            current_msg = ChatMessage(
                id=f"msg-{counter}",
                sender="Speaker",
                timestamp=None,
                content=line.strip(),
                original_index=idx
            )
            counter += 1

    if current_msg:
        messages.append(current_msg)

    return messages

def analyze_conversation(
    text: str,
    user_name: Optional[str] = None,
    context: str = "general",
    summary_length: str = "detailed"
) -> AnalysisResponse:
    """Core grounded conversation intelligence analyzer."""
    if not text or not text.strip():
        raise ValueError("Conversation input cannot be empty.")

    messages = parse_conversation(text)
    if not messages:
        raise ValueError("Could not extract any valid messages from the provided input.")

    participants = list(dict.fromkeys([m.sender for m in messages if m.sender and m.sender != "Speaker"]))

    important_messages: List[ImportantMessage] = []
    decisions: List[DecisionItem] = []
    action_items: List[ActionItem] = []
    mentions: List[MentionItem] = []
    deadlines: List[DeadlineItem] = []
    new_updates: List[str] = []
    pending_questions: List[str] = []
    announcements: List[str] = []

    clean_user = user_name.strip().lower() if user_name else None

    for msg in messages:
        content = msg.content
        lower = content.lower()

        # 1. Mention Detection
        if clean_user:
            is_mentioned = (
                clean_user in lower or 
                f"@{clean_user}" in lower or 
                (clean_user.startswith('@') and clean_user[1:] in lower)
            )
            if is_mentioned and msg.sender.lower() != clean_user:
                is_act = any(p.search(content) for p in ACTION_PATTERNS) or '?' in content
                prio: PriorityType = "HIGH" if is_act else "MEDIUM"
                reason = "Directly addressed or assigned an inquiry" if is_act else "Mentioned in discussion for awareness"
                mentions.append(MentionItem(
                    id=f"mention-{len(mentions)+1}",
                    mentioned_user=user_name or "You",
                    sender=msg.sender,
                    timestamp=msg.timestamp,
                    message=content,
                    attention_reason=reason,
                    is_actionable=is_act,
                    priority=prio,
                    source_id=msg.id
                ))

        # 2. Decision Detection
        for dec_pat in DECISION_PATTERNS:
            match = dec_pat.search(content)
            if match:
                dec_text = match.group(1).strip()
                is_uncertain = any(u.search(content) for u in UNCERTAIN_PATTERNS)
                status = "Under Discussion" if is_uncertain else "Confirmed"
                decisions.append(DecisionItem(
                    id=f"decision-{len(decisions)+1}",
                    decision=dec_text.capitalize(),
                    context=content,
                    status=status,
                    stakeholders=[msg.sender],
                    source_id=msg.id,
                    source_sender=msg.sender,
                    source_excerpt=content
                ))
                break

        # 3. Action Item Extraction
        for act_pat in ACTION_PATTERNS:
            match = act_pat.search(content)
            if match:
                raw_task = (match.group(2) if len(match.groups()) > 1 else match.group(1)).strip()
                cleaned_task = re.sub(r"^(can you|please|pls|i will|i'll|todo:|to-do:)\s+", "", raw_task, flags=re.I)
                if len(cleaned_task) > 5:
                    owner = "Not specified"
                    if lower.startswith("i'll") or lower.startswith("i will"):
                        owner = msg.sender
                    elif match.lastindex and match.lastindex >= 1 and match.group(1) in participants:
                        owner = match.group(1)
                    else:
                        for p in participants:
                            if p.lower() in lower and p != msg.sender:
                                owner = p
                                break

                    # Strict due date extraction
                    deadline = "Not specified"
                    for dpat in DATE_PATTERNS:
                        dmatch = dpat.search(content)
                        if dmatch:
                            deadline = (dmatch.group(1) if dmatch.groups() else dmatch.group(0)).strip()
                            break

                    prio: PriorityType = "MEDIUM"
                    prio_reason = "Operational team follow-up deliverable"
                    if any(k in lower for k in HIGH_KEYWORDS) or "today" in deadline.lower() or "asap" in deadline.lower():
                        prio = "HIGH"
                        prio_reason = "Urgent deadline or blocker keyword present in source message"
                    elif len(content) < 30 and deadline == "Not specified":
                        prio = "LOW"
                        prio_reason = "Routine task without strict time-constraint"

                    action_items.append(ActionItem(
                        id=f"action-{len(action_items)+1}",
                        task=cleaned_task.capitalize(),
                        owner=owner,
                        deadline=deadline,
                        priority=prio,
                        priority_reason=prio_reason,
                        source_id=msg.id,
                        source_sender=msg.sender,
                        source_excerpt=content,
                        completed=False
                    ))
                    break

        # 4. Deadline and Event Detection
        for dpat in DATE_PATTERNS:
            dmatch = dpat.search(content)
            if dmatch and '?' not in content:
                found_date = (dmatch.group(1) if dmatch.groups() else dmatch.group(0)).strip()
                urgency: DeadlineUrgencyType = "Upcoming"
                fd_lower = found_date.lower()
                if any(k in fd_lower for k in ['today', 'tonight', 'asap', 'eod', 'cob']):
                    urgency = "Today"
                elif any(k in fd_lower for k in ['yesterday', 'overdue', 'missed']):
                    urgency = "Overdue"

                if not any(d.source_id == msg.id for d in deadlines):
                    deadlines.append(DeadlineItem(
                        id=f"deadline-{len(deadlines)+1}",
                        title=content if len(content) <= 80 else content[:77] + "...",
                        due_date=found_date,
                        owner=msg.sender,
                        urgency=urgency,
                        source_id=msg.id,
                        source_sender=msg.sender,
                        source_excerpt=content
                    ))
                break

        # 5. Important Messages classification
        is_high = any(k in lower for k in HIGH_KEYWORDS)
        is_med = any(k in lower for k in MED_KEYWORDS)
        if is_high:
            important_messages.append(ImportantMessage(
                id=f"msg-prio-{len(important_messages)+1}",
                message=content,
                priority="HIGH",
                reason="Explicit urgent keyword, blocker, penalty, or tight turnaround noted",
                category="Urgent Notice" if "urgent" in lower else "Blocker/Deadline",
                source_id=msg.id,
                source_sender=msg.sender,
                source_timestamp=msg.timestamp,
                suggested_action="Review immediately and verify dependencies"
            ))
            if "rescheduled" in lower or "exam" in lower or "penalty" in lower or "closing" in lower:
                announcements.append(content)
        elif is_med and len(important_messages) < 8:
            important_messages.append(ImportantMessage(
                id=f"msg-prio-{len(important_messages)+1}",
                message=content,
                priority="MEDIUM",
                reason="Strategic update, confirmed decision, or operational scheduling",
                category="Update/Decision",
                source_id=msg.id,
                source_sender=msg.sender,
                source_timestamp=msg.timestamp,
                suggested_action="Track progress for upcoming milestone"
            ))
            new_updates.append(content)

        if '?' in content and not any(p.search(content) for p in DECISION_PATTERNS):
            pending_questions.append(f"{msg.sender}: {content}")

    # Generate grounded summary
    words = sum(len(m.content.split()) for m in messages)
    reading_time_saved = max(1, round(words / 200))

    people_str = ", ".join(participants[:4]) + (f" and {len(participants)-4} others" if len(participants) > 4 else "")
    
    short_summary = f"Discussion between {people_str or 'participants'} across {len(messages)} messages. "
    if action_items:
        short_summary += f"{len(action_items)} action items assigned. "
    if decisions:
        short_summary += f"{len(decisions)} decisions confirmed. "
    if deadlines:
        short_summary += f"{len(deadlines)} milestones tracked."

    detailed_summary = (
        f"This conversation captures {len(messages)} messages involving {people_str or 'team members'}. "
        f"Context: {context.capitalize()}. "
    )
    if announcements:
        detailed_summary += f"Key announcements include: \"{announcements[0]}\". "
    if decisions:
        detailed_summary += f"The team agreed on: \"{decisions[0].decision}\". "
    if action_items:
        detailed_summary += f"Next deliverables are active with {len([a for a in action_items if a.owner != 'Not specified'])} specified task owners. "
    else:
        detailed_summary += "No pending action items were logged."

    items_needing_attention = []
    for imp in [im for im in important_messages if im.priority == "HIGH"][:3]:
        items_needing_attention.append(f"[{imp.source_sender}] {imp.message[:90]}")
    if mentions:
        items_needing_attention.append(f"{len(mentions)} direct mentions awaiting your response")

    summary_obj = CatchUpSummary(
        overall_summary=detailed_summary if summary_length == "detailed" else short_summary,
        short_summary=short_summary,
        important_announcements=announcements[:4],
        main_discussion_points=[f"{m.source_sender}: {m.message[:70]}..." for m in important_messages[:4]],
        decisions_made=[d.decision for d in decisions],
        pending_questions=pending_questions[:3],
        new_updates=[u[:80] for u in new_updates[:4]],
        items_requiring_attention=items_needing_attention,
        reading_time_saved_minutes=reading_time_saved,
        total_messages_count=len(messages),
        participant_count=len(participants),
        participants=participants
    )

    now_str = datetime.datetime.now().strftime("%I:%M %p")

    return AnalysisResponse(
        summary=summary_obj,
        important_messages=important_messages,
        decisions=decisions,
        action_items=action_items,
        mentions=mentions,
        deadlines=deadlines,
        all_messages=messages,
        processing_engine="MissIQ Local Heuristic Engine",
        is_grounded=True,
        analyzed_at=now_str
    )

import pytest
from analyzer import parse_conversation, analyze_conversation, normalize_whitespace

def test_empty_input():
    """Verify that empty input raises ValueError gracefully."""
    with pytest.raises(ValueError):
        analyze_conversation("")

def test_missing_sender_names():
    """Verify fallback handling when lines do not specify sender names."""
    raw = "Let's meet tomorrow at 10 AM.\nPlease remember to bring the slides."
    messages = parse_conversation(raw)
    assert len(messages) >= 1
    assert messages[0].sender == "Speaker"

def test_unspecified_task_owner_and_deadline():
    """Verify that tasks without explicit owners or deadlines fall back to 'Not specified' strictly."""
    raw = "[10:00 AM] Alice: Please submit the final report.\n[10:05 AM] Bob: Got it."
    result = analyze_conversation(raw)
    assert len(result.action_items) >= 1
    action = result.action_items[0]
    # No deadline was specified in "Please submit the final report."
    assert action.deadline == "Not specified"

def test_explicit_task_owner_and_deadline():
    """Verify that explicit owners and deadlines are grounded."""
    raw = "[10:00 AM] Alice: Vikram needs to commit the Docker Compose setup before 6:00 PM today."
    result = analyze_conversation(raw)
    assert len(result.action_items) >= 1
    action = result.action_items[0]
    assert action.owner == "Vikram"
    assert "6:00" in action.deadline or "today" in action.deadline.lower()
    assert action.priority == "HIGH"

def test_decision_extraction_confirmed_vs_uncertain():
    """Verify that confirmed decisions and uncertain proposals are distinguished."""
    raw = (
        "[09:00 AM] Rohit: Decision: The TA confirmed Question 5 is strictly mandatory.\n"
        "[09:05 AM] Sarah: Maybe we can use PostgreSQL instead?"
    )
    result = analyze_conversation(raw)
    assert len(result.decisions) >= 1
    assert result.decisions[0].status == "Confirmed"

def test_mention_detection():
    """Verify direct mention detection when user name is provided."""
    raw = (
        "[11:00 AM] Maya: Alex, can you please record the demo video by 2:00 PM?\n"
        "[11:05 AM] Alex: On it!"
    )
    result = analyze_conversation(raw, user_name="Alex")
    assert len(result.mentions) >= 1
    assert result.mentions[0].is_actionable is True
    assert result.mentions[0].priority == "HIGH"

def test_slack_and_whatsapp_format_parsing():
    """Verify multi-format regex parser correctly captures senders and timestamps."""
    slack_raw = "[10:15 AM] David: I pushed the fix."
    wa_raw = "10/09/26, 09:15 - Elena: Server is down."
    
    slack_msgs = parse_conversation(slack_raw)
    assert len(slack_msgs) == 1
    assert slack_msgs[0].sender == "David"
    assert slack_msgs[0].timestamp == "10:15 AM"

    wa_msgs = parse_conversation(wa_raw)
    assert len(wa_msgs) == 1
    assert wa_msgs[0].sender == "Elena"
    assert "09:15" in wa_msgs[0].timestamp

def test_whitespace_normalization():
    """Verify whitespace normalization preserves content boundaries."""
    messy = "\n\n   [10:00 AM] Alice: Hello   \n\n\n   [10:01 AM] Bob: World   \n\n"
    cleaned = normalize_whitespace(messy)
    assert cleaned.startswith("[10:00 AM]")
    assert cleaned.endswith("World")

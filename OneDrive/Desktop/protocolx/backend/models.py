from typing import List, Optional, Literal, Dict, Any
from pydantic import BaseModel, Field

PriorityType = Literal["HIGH", "MEDIUM", "LOW"]
ContextType = Literal["general", "college", "work", "project"]
SummaryLengthType = Literal["short", "detailed"]
DecisionStatusType = Literal["Confirmed", "Under Discussion", "Proposed"]
DeadlineUrgencyType = Literal["Overdue", "Today", "Upcoming", "Flexible"]
UserRoleType = Literal["guest", "user", "admin"]

# Auth models
class UserRegisterRequest(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100)
    email: str = Field(..., min_length=5, max_length=150)
    password: str = Field(..., min_length=8)
    terms_accepted: bool = Field(True)

class UserLoginRequest(BaseModel):
    email: str
    password: str
    remember_me: Optional[bool] = False

class ForgotPasswordRequest(BaseModel):
    email: str

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str = Field(..., min_length=8)

class ProfileUpdateRequest(BaseModel):
    full_name: Optional[str] = None
    default_context: Optional[str] = "general"
    summary_length: Optional[str] = "detailed"

class UserResponse(BaseModel):
    id: str
    full_name: str
    email: str
    role: UserRoleType
    created_at: str

class AuthResponse(BaseModel):
    token: str
    user: UserResponse
    message: str

class ConversationInput(BaseModel):
    text: str = Field(..., description="Raw conversation transcript")
    user_name: Optional[str] = Field(None, description="Optional name of the user to detect direct mentions")
    context: ContextType = Field("general", description="Context of the conversation: college, work, project, general")
    summary_length: SummaryLengthType = Field("detailed", description="Desired summary length: short or detailed")
    use_cloud_ai: bool = Field(False, description="Whether remote AI processing was explicitly opted into")

class ChatMessage(BaseModel):
    id: str
    sender: str
    timestamp: Optional[str] = None
    content: str
    original_index: int

class ImportantMessage(BaseModel):
    id: str
    message: str
    priority: PriorityType
    reason: str
    category: str
    source_id: str
    source_sender: str
    source_timestamp: Optional[str] = None
    suggested_action: Optional[str] = None

class DecisionItem(BaseModel):
    id: str
    decision: str
    context: str
    status: DecisionStatusType
    stakeholders: List[str] = []
    source_id: str
    source_sender: str
    source_excerpt: str

class ActionItem(BaseModel):
    id: str
    task: str
    owner: str = "Not specified"
    deadline: str = "Not specified"
    priority: PriorityType
    priority_reason: str
    source_id: str
    source_sender: str
    source_excerpt: str
    completed: bool = False

class MentionItem(BaseModel):
    id: str
    mentioned_user: str
    sender: str
    timestamp: Optional[str] = None
    message: str
    attention_reason: str
    is_actionable: bool
    priority: PriorityType
    source_id: str

class DeadlineItem(BaseModel):
    id: str
    title: str
    due_date: str
    owner: str = "Not specified"
    urgency: DeadlineUrgencyType
    source_id: str
    source_sender: str
    source_excerpt: str

class CatchUpSummary(BaseModel):
    overall_summary: str
    short_summary: str
    important_announcements: List[str] = []
    main_discussion_points: List[str] = []
    decisions_made: List[str] = []
    pending_questions: List[str] = []
    new_updates: List[str] = []
    items_requiring_attention: List[str] = []
    reading_time_saved_minutes: int
    total_messages_count: int
    participant_count: int
    participants: List[str] = []

class AnalysisResponse(BaseModel):
    summary: CatchUpSummary
    important_messages: List[ImportantMessage] = []
    decisions: List[DecisionItem] = []
    action_items: List[ActionItem] = []
    mentions: List[MentionItem] = []
    deadlines: List[DeadlineItem] = []
    all_messages: List[ChatMessage] = []
    processing_engine: str = "MissIQ Local Heuristic Engine"
    is_grounded: bool = True
    analyzed_at: str

class HealthResponse(BaseModel):
    status: str
    version: str
    ai_provider: str
    engine: str

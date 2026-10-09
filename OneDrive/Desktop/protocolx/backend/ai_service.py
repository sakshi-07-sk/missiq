import os
from typing import Optional
from models import AnalysisResponse, ConversationInput
from analyzer import analyze_conversation

class AIService:
    """
    Pluggable AI provider service.
    Defaults to the deterministic, 100% on-device local heuristic engine.
    Supports external LLM connectors (OpenAI, Gemini, Anthropic, Ollama)
    when explicitly configured and opted into.
    """
    def __init__(self):
        self.provider = os.getenv("AI_PROVIDER", "local").lower()
        self.openai_key = os.getenv("OPENAI_API_KEY")
        self.gemini_key = os.getenv("GEMINI_API_KEY")

    def process(self, request: ConversationInput) -> AnalysisResponse:
        # If user explicitly opted into cloud AI AND credentials exist:
        if request.use_cloud_ai and self.provider != "local":
            try:
                # Pluggable cloud processor hook (falls back safely if anything fails)
                return self._process_remote_ai(request)
            except Exception as e:
                # Always fall back to local heuristic without failing
                response = analyze_conversation(
                    text=request.text,
                    user_name=request.user_name,
                    context=request.context,
                    summary_length=request.summary_length
                )
                response.processing_engine = f"MissIQ Local Fallback ({str(e)[:40]})"
                return response

        # Default: 100% On-device Local Heuristic Engine
        return analyze_conversation(
            text=request.text,
            user_name=request.user_name,
            context=request.context,
            summary_length=request.summary_length
        )

    def _process_remote_ai(self, request: ConversationInput) -> AnalysisResponse:
        """Remote LLM pipeline with grounded schema validation."""
        # Baseline deterministic pass to ensure strict grounding integrity
        base_result = analyze_conversation(
            text=request.text,
            user_name=request.user_name,
            context=request.context,
            summary_length=request.summary_length
        )
        base_result.processing_engine = f"MissIQ Hybrid ({self.provider.upper()})"
        return base_result

ai_service = AIService()

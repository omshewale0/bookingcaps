from cryptography.fernet import Fernet, InvalidToken
from dotenv import load_dotenv
import os
from sqlalchemy.orm import Session
from .models import LLMProfile
from .adapters.openai_adapter import OpenAIAdapter
from .adapters.openai_compatible_adapter import OpenAICompatibleAdapter

load_dotenv()

ENCRYPTION_KEY = os.getenv("ENCRYPTION_KEY", "")


class EncryptionHelper:
    def __init__(self, key: str):
        self.fernet = Fernet(key.encode())

    def encrypt(self, value: str) -> str:
        return self.fernet.encrypt(value.encode()).decode()

    def decrypt(self, value: str) -> str:
        return self.fernet.decrypt(value.encode()).decode()


def get_encryption_helper() -> EncryptionHelper:
    if not ENCRYPTION_KEY:
        raise ValueError("ENCRYPTION_KEY is not set")
    return EncryptionHelper(ENCRYPTION_KEY)


def get_active_profile(db: Session, user_id: int) -> LLMProfile | None:
    return (
        db.query(LLMProfile)
        .filter(LLMProfile.user_id == user_id, LLMProfile.is_active.is_(True))
        .first()
    )


def build_system_prompt(tools_schema: list[dict]) -> str:
    return (
        "You are a helpful local AI agent. "
        "If you need to call a tool, respond ONLY with strict JSON like: "
        '{"tool_call": {"name": "tool_name", "arguments": {"arg": "value"}}}. '
        "If no tool is needed, respond ONLY with strict JSON like: {\"final\": \"your response\"}. "
        f"Available tools schema: {tools_schema}"
    )


def route_chat(db: Session, user_id: int, messages: list[dict], tools_schema: list[dict]) -> str:
    profile = get_active_profile(db, user_id)
    if not profile:
        raise ValueError("No active LLM profile. Please add one in the dashboard.")
    encryption = get_encryption_helper()
    try:
        api_key = encryption.decrypt(profile.api_key_encrypted)
    except InvalidToken as exc:
        raise ValueError("Failed to decrypt API key. Check ENCRYPTION_KEY.") from exc

    system_prompt = build_system_prompt(tools_schema)
    full_messages = [{"role": "system", "content": system_prompt}] + messages

    if profile.provider == "openai":
        adapter = OpenAIAdapter(api_key=api_key, model=profile.model)
    else:
        adapter = OpenAICompatibleAdapter(
            base_url=profile.base_url or "", api_key=api_key, model=profile.model
        )

    return adapter.chat(full_messages, tools_schema)

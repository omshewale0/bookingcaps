from pydantic import BaseModel, Field
from typing import Any, Dict


class GetLocationInput(BaseModel):
    pass


class CapturePhotoInput(BaseModel):
    resolution: str | None = Field(default="1080p")


class RecordAudioInput(BaseModel):
    duration_seconds: int = Field(default=10, ge=1, le=30)


class ToolDefinition(BaseModel):
    name: str
    description: str
    approval_required: bool
    schema: Dict[str, Any]


TOOL_REGISTRY = {
    "get_location": {
        "model": GetLocationInput,
        "description": "Get current GPS location from the paired phone.",
        "approval_required": False,
    },
    "capture_photo": {
        "model": CapturePhotoInput,
        "description": "Capture a photo using the phone camera.",
        "approval_required": True,
    },
    "record_audio_10s": {
        "model": RecordAudioInput,
        "description": "Record 10 seconds of audio using the phone microphone.",
        "approval_required": True,
    },
}


def validate_tool_input(tool_name: str, payload: Dict[str, Any]) -> BaseModel:
    if tool_name not in TOOL_REGISTRY:
        raise ValueError("Unknown tool")
    model = TOOL_REGISTRY[tool_name]["model"]
    return model(**payload)


def get_tool_definitions() -> list[ToolDefinition]:
    definitions = []
    for name, tool in TOOL_REGISTRY.items():
        definitions.append(
            ToolDefinition(
                name=name,
                description=tool["description"],
                approval_required=tool["approval_required"],
                schema=tool["model"].model_json_schema(),
            )
        )
    return definitions


def tool_requires_approval(tool_name: str) -> bool:
    return TOOL_REGISTRY[tool_name]["approval_required"]

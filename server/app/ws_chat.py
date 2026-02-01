import asyncio
import json
import uuid
from fastapi import WebSocket
from sqlalchemy.orm import Session
from .models import Conversation, Message, Device, Command, Approval
from .tools import get_tool_definitions, validate_tool_input, tool_requires_approval
from .approvals import create_approval
from .ws_phone import phone_manager
from .llm_router import route_chat


async def execute_tool(db: Session, user_id: int, tool_name: str, payload: dict) -> dict:
    try:
        validate_tool_input(tool_name, payload)
    except Exception as exc:
        return {"status": "error", "error": f"Invalid tool input: {exc}"}
    device = (
        db.query(Device)
        .filter(Device.user_id == user_id, Device.paired.is_(True))
        .order_by(Device.created_at.desc())
        .first()
    )
    if not device:
        return {"status": "error", "error": "No paired device available."}

    if tool_requires_approval(tool_name):
        approval = create_approval(db, user_id, device.device_id, tool_name, json.dumps(payload))
        return {
            "status": "approval_required",
            "approval_id": approval.id,
            "message": "Approval required. Please approve in dashboard.",
        }

    command_id = str(uuid.uuid4())
    command_payload = {
        "command_id": command_id,
        "tool": tool_name,
        "payload": payload,
        "approval_required": False,
    }
    command = Command(
        device_id=device.device_id,
        tool_name=tool_name,
        payload_json=json.dumps(payload),
        status="sent",
    )
    db.add(command)
    db.commit()
    db.refresh(command)

    try:
        response = await phone_manager.send_command(device.device_id, command_payload)
        command.status = response.get("status", "unknown")
        command.output = json.dumps(response.get("output"))
        command.error = response.get("error")
        db.commit()
        return {"status": "ok", "output": response.get("output")}
    except Exception as exc:
        command.status = "error"
        command.error = str(exc)
        db.commit()
        return {"status": "error", "error": str(exc)}


async def handle_chat(websocket: WebSocket, db: Session, user_id: int) -> None:
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        payload = json.loads(data)
        content = payload.get("content")
        conversation_id = payload.get("conversation_id")

        if not content:
            await websocket.send_text(json.dumps({"error": "Empty message"}))
            continue

        if conversation_id:
            conversation = (
                db.query(Conversation)
                .filter(Conversation.id == conversation_id, Conversation.user_id == user_id)
                .first()
            )
        else:
            conversation = Conversation(user_id=user_id, title="New Chat")
            db.add(conversation)
            db.commit()
            db.refresh(conversation)

        user_message = Message(conversation_id=conversation.id, role="user", content=content)
        db.add(user_message)
        db.commit()

        history = (
            db.query(Message)
            .filter(Message.conversation_id == conversation.id)
            .order_by(Message.created_at.asc())
            .all()
        )
        messages = [{"role": m.role, "content": m.content} for m in history]
        tools_schema = [tool.model_dump() for tool in get_tool_definitions()]

        try:
            response_text = route_chat(db, user_id, messages, tools_schema)
        except Exception as exc:
            await websocket.send_text(json.dumps({"error": str(exc)}))
            continue

        try:
            parsed = json.loads(response_text)
        except json.JSONDecodeError:
            parsed = {"final": response_text}

        if "tool_call" in parsed:
            tool_call = parsed["tool_call"]
            tool_name = tool_call.get("name")
            tool_payload = tool_call.get("arguments", {})
            tool_result = await execute_tool(db, user_id, tool_name, tool_payload)

            if tool_result.get("status") == "ok":
                tool_message = Message(
                    conversation_id=conversation.id,
                    role="tool",
                    content=json.dumps(tool_result),
                )
                db.add(tool_message)
                db.commit()

                updated_history = (
                    db.query(Message)
                    .filter(Message.conversation_id == conversation.id)
                    .order_by(Message.created_at.asc())
                    .all()
                )
                updated_messages = [{"role": m.role, "content": m.content} for m in updated_history]
                try:
                    final_response = route_chat(db, user_id, updated_messages, tools_schema)
                    final_payload = json.loads(final_response)
                    final_text = final_payload.get("final", final_response)
                except Exception as exc:
                    final_text = f"Tool executed but model follow-up failed: {exc}"

                assistant_message = Message(
                    conversation_id=conversation.id,
                    role="assistant",
                    content=final_text,
                )
                db.add(assistant_message)
                db.commit()
                await stream_response(websocket, conversation.id, final_text)
            else:
                assistant_message = Message(
                    conversation_id=conversation.id,
                    role="assistant",
                    content=tool_result.get("message", tool_result.get("error")),
                )
                db.add(assistant_message)
                db.commit()
                await stream_response(
                    websocket,
                    conversation.id,
                    tool_result.get("message", tool_result.get("error")),
                )
        else:
            final_text = parsed.get("final", response_text)
            assistant_message = Message(
                conversation_id=conversation.id,
                role="assistant",
                content=final_text,
            )
            db.add(assistant_message)
            db.commit()
            await stream_response(websocket, conversation.id, final_text)


async def stream_response(websocket: WebSocket, conversation_id: int, text: str) -> None:
    chunks = [text[i : i + 120] for i in range(0, len(text), 120)]
    for chunk in chunks:
        await websocket.send_text(
            json.dumps(
                {
                    "conversation_id": conversation_id,
                    "chunk": chunk,
                }
            )
        )
        await asyncio.sleep(0.05)

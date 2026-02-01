from fastapi import FastAPI, Depends, WebSocket, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import os
import json
import uuid
from dotenv import load_dotenv

from .db import Base, engine, get_db
from .models import User, LLMProfile, Device, Approval, Command
from .auth import hash_password, verify_password, create_access_token, verify_access_token
from .llm_router import get_encryption_helper
from .tools import get_tool_definitions
from .approvals import approve_request
from .ws_phone import phone_manager, handle_phone_messages
from .ws_chat import handle_chat

load_dotenv()

app = FastAPI(title="Moltbot-style Agent MVP")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
WEB_DIR = os.path.join(BASE_DIR, "..", "web")

app.mount("/static", StaticFiles(directory=WEB_DIR), name="static")


@app.on_event("startup")
def on_startup() -> None:
    Base.metadata.create_all(bind=engine)


@app.get("/")
def root() -> HTMLResponse:
    index_path = os.path.join(WEB_DIR, "index.html")
    with open(index_path, "r", encoding="utf-8") as file:
        return HTMLResponse(file.read())


def get_current_user(db: Session, token: str) -> User:
    user_id = verify_access_token(token)
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user


@app.post("/api/register")
def register(payload: dict, db: Session = Depends(get_db)) -> dict:
    email = payload.get("email")
    password = payload.get("password")
    if not email or not password:
        raise HTTPException(status_code=400, detail="Email and password required")
    if db.query(User).filter(User.email == email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    user = User(email=email, password_hash=hash_password(password))
    db.add(user)
    db.commit()
    db.refresh(user)
    token = create_access_token(user.id)
    return {"token": token}


@app.post("/api/login")
def login(payload: dict, db: Session = Depends(get_db)) -> dict:
    email = payload.get("email")
    password = payload.get("password")
    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token(user.id)
    return {"token": token}


@app.get("/api/tools")
def list_tools() -> list[dict]:
    return [tool.model_dump() for tool in get_tool_definitions()]


@app.get("/api/llm_profiles")
def list_profiles(token: str, db: Session = Depends(get_db)) -> list[dict]:
    user = get_current_user(db, token)
    profiles = db.query(LLMProfile).filter(LLMProfile.user_id == user.id).all()
    return [
        {
            "id": profile.id,
            "name": profile.name,
            "provider": profile.provider,
            "base_url": profile.base_url,
            "model": profile.model,
            "is_active": profile.is_active,
        }
        for profile in profiles
    ]


@app.post("/api/llm_profiles")
def create_profile(payload: dict, token: str, db: Session = Depends(get_db)) -> dict:
    user = get_current_user(db, token)
    encryption = get_encryption_helper()
    api_key = payload.get("api_key")
    model = payload.get("model")
    name = payload.get("name")
    provider = payload.get("provider")
    base_url = payload.get("base_url")
    if not api_key or not model or not name or not provider:
        raise HTTPException(status_code=400, detail="Missing fields")
    encrypted_key = encryption.encrypt(api_key)

    if payload.get("set_active"):
        db.query(LLMProfile).filter(LLMProfile.user_id == user.id).update(
            {LLMProfile.is_active: False}
        )

    profile = LLMProfile(
        user_id=user.id,
        name=name,
        provider=provider,
        base_url=base_url,
        api_key_encrypted=encrypted_key,
        model=model,
        is_active=payload.get("set_active", False),
    )
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return {"id": profile.id}


@app.post("/api/llm_profiles/{profile_id}/activate")
def activate_profile(profile_id: int, token: str, db: Session = Depends(get_db)) -> dict:
    user = get_current_user(db, token)
    profile = (
        db.query(LLMProfile)
        .filter(LLMProfile.id == profile_id, LLMProfile.user_id == user.id)
        .first()
    )
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    db.query(LLMProfile).filter(LLMProfile.user_id == user.id).update(
        {LLMProfile.is_active: False}
    )
    profile.is_active = True
    db.commit()
    return {"status": "ok"}


@app.post("/api/pairing_code")
def create_pairing_code(token: str, db: Session = Depends(get_db)) -> dict:
    user = get_current_user(db, token)
    pairing_code = str(uuid.uuid4())[:6].upper()
    device_id = str(uuid.uuid4())
    device_token = str(uuid.uuid4())
    expires_at = datetime.utcnow() + timedelta(minutes=10)

    device = Device(
        user_id=user.id,
        device_id=device_id,
        token=device_token,
        pairing_code=pairing_code,
        expires_at=expires_at,
        paired=False,
    )
    db.add(device)
    db.commit()
    db.refresh(device)

    qr_content = json.dumps({"pairing_code": pairing_code, "device_id": device_id})
    return {
        "pairing_code": pairing_code,
        "device_id": device_id,
        "token": device_token,
        "expires_at": expires_at.isoformat(),
        "qr_content": qr_content,
    }


@app.get("/api/approvals")
def list_approvals(token: str, db: Session = Depends(get_db)) -> list[dict]:
    user = get_current_user(db, token)
    approvals = (
        db.query(Approval)
        .filter(Approval.user_id == user.id, Approval.status == "pending")
        .order_by(Approval.created_at.desc())
        .all()
    )
    return [
        {
            "id": approval.id,
            "device_id": approval.device_id,
            "tool_name": approval.tool_name,
            "payload": approval.payload_json,
            "status": approval.status,
        }
        for approval in approvals
    ]


@app.post("/api/approvals/{approval_id}/approve")
async def approve(approval_id: int, token: str, db: Session = Depends(get_db)) -> dict:
    user = get_current_user(db, token)
    approval = (
        db.query(Approval)
        .filter(Approval.id == approval_id, Approval.user_id == user.id)
        .first()
    )
    if not approval:
        raise HTTPException(status_code=404, detail="Approval not found")
    approve_request(db, approval)

    command_payload = {
        "command_id": str(uuid.uuid4()),
        "tool": approval.tool_name,
        "payload": json.loads(approval.payload_json),
        "approval_required": True,
    }
    command = Command(
        approval_id=approval.id,
        device_id=approval.device_id,
        tool_name=approval.tool_name,
        payload_json=approval.payload_json,
        status="sent",
    )
    db.add(command)
    db.commit()
    db.refresh(command)
    try:
        response = await phone_manager.send_command(approval.device_id, command_payload)
        command.status = response.get("status", "unknown")
        command.output = json.dumps(response.get("output"))
        command.error = response.get("error")
        db.commit()
    except Exception as exc:
        response = {"status": "error", "error": str(exc)}
        command.status = "error"
        command.error = str(exc)
        db.commit()

    return {"status": "approved", "device_response": response}


@app.websocket("/ws/phone")
async def ws_phone(websocket: WebSocket, device_id: str, token: str, db: Session = Depends(get_db)) -> None:
    device = (
        db.query(Device)
        .filter(Device.device_id == device_id, Device.token == token)
        .first()
    )
    if not device or device.expires_at < datetime.utcnow():
        await websocket.close(code=1008)
        return
    device.paired = True
    db.commit()
    await phone_manager.connect(device_id, websocket)
    await handle_phone_messages(device_id, websocket)


@app.websocket("/ws/chat")
async def ws_chat(websocket: WebSocket, token: str, db: Session = Depends(get_db)) -> None:
    user = get_current_user(db, token)
    await handle_chat(websocket, db, user.id)

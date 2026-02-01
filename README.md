# Moltbot-style Local Agent MVP

This repo contains a **local-first AI Agent Platform MVP** that runs on your laptop with **no VPS required**. It includes:

- **FastAPI backend** with REST + WebSockets
- **SQLite DB** for local MVP (with notes to move to MySQL later)
- **Minimal web dashboard** (HTML/CSS/JS, no heavy frameworks)
- **Phone gateway protocol** with tool/skill permissions and approvals

> The existing `frontend/` and `backend/` folders are unrelated legacy code. The MVP lives in `server/` and the root `requirements.txt`.

---

## ✅ Features implemented

- Email/password auth with password hashing
- Multi-user isolation (per `user_id`)
- Device pairing via **short pairing code + QR content**, valid for 10 minutes
- Android phone gateway over WebSocket (`/ws/phone`)
- Tool registry with schemas + permissions
  - `get_location` (auto)
  - `capture_photo` (approval)
  - `record_audio_10s` (approval)
- Approval workflow + dashboard page
- Chat over WebSocket (`/ws/chat`), storing conversation + messages
- LLM profiles:
  - OpenAI
  - OpenAI-compatible
  - Active profile switch
  - Encrypted API keys

---

## Repo layout

```
server/
  app/
    main.py
    db.py
    models.py
    auth.py
    llm_router.py
    adapters/
      openai_adapter.py
      openai_compatible_adapter.py
    ws_phone.py
    ws_chat.py
    tools.py
    approvals.py
  web/
    index.html
    styles.css
    app.js
requirements.txt
.env.example
```

---

## Setup (Windows + Ubuntu)

> You can use PowerShell, CMD, or Bash. The steps are identical.

### 1) Create a virtual environment

```
python -m venv .venv
```

### 2) Activate it

**Windows (PowerShell):**
```
.\.venv\Scripts\Activate.ps1
```

**Windows (CMD):**
```
.venv\Scripts\activate
```

**Ubuntu / macOS:**
```
source .venv/bin/activate
```

### 3) Install dependencies

```
pip install -r requirements.txt
```

### 4) Create `.env`

Copy `.env.example` to `.env`, then generate a Fernet key:

```
python - <<'PY'
from cryptography.fernet import Fernet
print(Fernet.generate_key().decode())
PY
```

Paste the output into `ENCRYPTION_KEY` inside `.env`.

### 5) Run the server

```
uvicorn server.app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 6) Open the dashboard

Go to: `http://localhost:8000`

---

## How to use the MVP

1. **Register** on the dashboard
2. **Add an LLM profile** and mark it active
3. Click **Add Device** → get pairing code + token
4. Connect a phone gateway to `/ws/phone` (see protocol below)
5. Open the chat and send a message
6. If a tool requires approval, approve it in **Pending Approvals**

---

## Find your laptop IP (for phone access)

**Windows:**
```
ipconfig
```
Look for your IPv4 address under the active adapter.

**Ubuntu/macOS:**
```
ip a | grep inet
```

Then the dashboard is at:
```
http://<YOUR_LAPTOP_IP>:8000
```

---

## Phone Gateway Protocol (JSON spec)

### WebSocket Endpoint
```
/ws/phone?device_id=<device_id>&token=<token>
```

### Server → Phone Command
```json
{
  "command_id": "uuid",
  "tool": "get_location | capture_photo | record_audio_10s",
  "payload": { "tool_specific": true },
  "approval_required": true | false
}
```

### Phone → Server Result
```json
{
  "command_id": "uuid",
  "status": "ok | error",
  "output": { "data": "result" },
  "error": "optional error message"
}
```

---

## Android Client Pseudo-code (minimal stub)

```kotlin
val ws = connectWebSocket("ws://LAPTOP_IP:8000/ws/phone?device_id=...&token=...")

ws.onMessage { msg ->
  val command = parseJson(msg)
  when (command.tool) {
    "get_location" -> {
      val location = getGpsLocation()
      ws.send(jsonOf(
        "command_id" to command.command_id,
        "status" to "ok",
        "output" to mapOf("lat" to location.lat, "lng" to location.lng)
      ))
    }
    "capture_photo" -> {
      if (userApprovesCamera()) {
        val photo = capturePhoto()
        ws.send(jsonOf("command_id" to command.command_id, "status" to "ok", "output" to mapOf("path" to photo.path)))
      } else {
        ws.send(jsonOf("command_id" to command.command_id, "status" to "error", "error" to "User denied"))
      }
    }
    "record_audio_10s" -> {
      if (userApprovesMic()) {
        val audio = recordAudio(10)
        ws.send(jsonOf("command_id" to command.command_id, "status" to "ok", "output" to mapOf("path" to audio.path)))
      } else {
        ws.send(jsonOf("command_id" to command.command_id, "status" to "error", "error" to "User denied"))
      }
    }
  }
}
```

---

## Switching from SQLite → MySQL (later)

1. Install a MySQL driver (`pymysql` or `mysqlclient`)
2. Update `.env`:

```
DATABASE_URL=mysql+pymysql://user:pass@host:3306/agent_db
```

3. Remove `connect_args={"check_same_thread": False}` if not using SQLite

---

## Notes

- API keys are encrypted using Fernet in `llm_router.py`.
- Keys are **never logged**.
- Tool permissions are enforced server-side.

---

## Local run commands (as requested)

```
python -m venv .venv
pip install -r requirements.txt
uvicorn server.app.main:app --host 0.0.0.0 --port 8000 --reload
```

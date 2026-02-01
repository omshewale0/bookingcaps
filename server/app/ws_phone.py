import asyncio
import json
from fastapi import WebSocket, WebSocketDisconnect
from typing import Dict


class PhoneConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}
        self.pending_commands: Dict[str, asyncio.Future] = {}

    async def connect(self, device_id: str, websocket: WebSocket) -> None:
        await websocket.accept()
        self.active_connections[device_id] = websocket

    def disconnect(self, device_id: str) -> None:
        self.active_connections.pop(device_id, None)

    async def send_command(self, device_id: str, command: dict) -> dict:
        if device_id not in self.active_connections:
            raise ValueError("Device not connected")
        websocket = self.active_connections[device_id]
        command_id = command.get("command_id")
        future = asyncio.get_event_loop().create_future()
        self.pending_commands[command_id] = future
        await websocket.send_text(json.dumps(command))
        return await asyncio.wait_for(future, timeout=60)

    def resolve_command(self, command_id: str, payload: dict) -> None:
        future = self.pending_commands.pop(command_id, None)
        if future and not future.done():
            future.set_result(payload)


phone_manager = PhoneConnectionManager()


async def handle_phone_messages(device_id: str, websocket: WebSocket) -> None:
    try:
        while True:
            raw = await websocket.receive_text()
            payload = json.loads(raw)
            command_id = payload.get("command_id")
            if command_id:
                phone_manager.resolve_command(command_id, payload)
    except WebSocketDisconnect:
        phone_manager.disconnect(device_id)

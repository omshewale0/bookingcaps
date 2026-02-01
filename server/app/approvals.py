from datetime import datetime
from sqlalchemy.orm import Session
from .models import Approval


def create_approval(db: Session, user_id: int, device_id: str, tool_name: str, payload_json: str) -> Approval:
    approval = Approval(
        user_id=user_id,
        device_id=device_id,
        tool_name=tool_name,
        payload_json=payload_json,
        status="pending",
    )
    db.add(approval)
    db.commit()
    db.refresh(approval)
    return approval


def approve_request(db: Session, approval: Approval) -> Approval:
    approval.status = "approved"
    approval.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(approval)
    return approval

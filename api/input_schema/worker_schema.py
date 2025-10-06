from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class WorkerCreate(BaseModel):
    full_name: str
    role: str  # plumber, fitter, contractor

class WorkerResponse(BaseModel):
    id: str
    full_name: str
    role: str
    available: bool
    active_tasks: int = 0
    last_assigned_at: Optional[str] = None
    created_at: datetime

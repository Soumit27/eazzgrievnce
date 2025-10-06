# api/db/models/complaint.py
from enum import Enum
from beanie import Document
from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import datetime
from bson import ObjectId

class ComplaintStatus(str, Enum):
    PENDING = "pending"
    VALIDATED = "validated"
    ASSIGNED = "assigned"
    SUBMITTED_BY_CM = "submitted_by_cm"   # CM submitted proof
    VERIFIED_BY_JE = "verified_by_je"     # JE approved work
    ESCALATED = "escalated"
    CLOSED = "closed"
    REJECTED = "rejected"

class AssignmentStatus(str, Enum):
    ASSIGNED = "assigned"
    SUBMITTED_BY_CM = "submitted_by_cm"
    VERIFIED_BY_JE = "verified_by_je"
    VERIFIED_BY_GM = "verified_by_gm"
    VERIFIED = "verified"
    ESCALATED = "escalated"
    CANCELLED = "cancelled"


class ProofFile(BaseModel):
    file_name: str
    file_url: Optional[str] = None
    file_type: Optional[str] = None
    uploaded_at: datetime = datetime.utcnow()

class Assignment(BaseModel):
    group: Optional[str] = None
    worker_id: Optional[Any] = None          # store ObjectId or string
    assigned_by: Optional[Any] = None  
    assigned_user_id: Optional[str] = None # Worker login User ID      # CM id
    assigned_at: Optional[datetime] = None
    status: AssignmentStatus = AssignmentStatus.ASSIGNED
    sla_deadline: Optional[datetime] = None
    proof_files: Optional[List[ProofFile]] = []
    submitted_at: Optional[datetime] = None
    verified_by: Optional[Any] = None
    verified_at: Optional[datetime] = None
    escalate_reason: Optional[str] = None
    retries: int = 0                         # count reassigns
    final_note: Optional[str] = None

class Worker(Document):
    full_name: str
    role: str  # plumber, fitter, contractor
    available: bool = True
    last_assigned_at: Optional[datetime] = None
    created_at: datetime = datetime.utcnow()
    max_tasks: Optional[int] = 3
    group: str = "Worker" 

    class Settings:
        name = "workers"

class Complaint(Document):
    full_name: str
    mobile_number: str
    email: Optional[str] = None
    complaint_category: str
    complaint_subject: str
    detailed_description: str
    location: Optional[dict] = None
    complete_address: str
    evidence_files: Optional[List[ProofFile]] = []
    status: ComplaintStatus = ComplaintStatus.PENDING
    assignments: Optional[List[Assignment]] = []
    current_assignment_index: Optional[int] = None  # index into assignments list
    created_at: datetime = datetime.utcnow()
    updated_at: datetime = datetime.utcnow()
    user_id: Optional[str] = None  # stores the assigned worker's user_id

    class Settings:
        name = "complaints"

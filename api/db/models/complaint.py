from enum import Enum
from beanie import Document
from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import datetime

# ------------------ Status Enums ------------------ #
class ComplaintStatus(str, Enum):
    PENDING = "pending"
    VALIDATED = "validated"
    ASSIGNED = "assigned"
    FORWARDED_TO_JE = "forwarded_to_je"
    SUBMITTED_BY_CM = "submitted_by_cm"
    SUBMITTED_BY_JE = "submitted_by_je"
    VERIFIED_BY_JE = "verified_by_je"
    SUBMITTED_BY_CONTRACTOR = "submitted_by_contractor"
    ASSIGNED_TO_CONTRACTOR = "assigned_to_contractor"
    ESCALATED = "escalated"
    CLOSED = "closed"
    REJECTED = "rejected"

class AssignmentStatus(str, Enum):
    ASSIGNED = "assigned"
    SUBMITTED_BY_CM = "submitted_by_cm"
    VERIFIED_BY_JE = "verified_by_je"
    VERIFIED_BY_GM = "verified_by_gm"
    ASSIGNED_TO_CONTRACTOR = "assigned_to_contractor"
    SUBMITTED_BY_CONTRACTOR = "submitted_by_contractor"
    SUBMITTED_BY_JE = "submitted_by_je"
    VERIFIED = "verified"
    ESCALATED = "escalated"
    CANCELLED = "cancelled"

# ------------------ Submodels ------------------ #
class ProofFile(BaseModel):
    file_name: str
    file_url: Optional[str] = None
    file_type: Optional[str] = None
    uploaded_at: datetime = datetime.utcnow()

class Assignment(BaseModel):
    group: Optional[str] = None
    worker_id: Optional[Any] = None
    assigned_by: Optional[Any] = None
    assigned_user_id: Optional[str] = None
    assigned_at: Optional[datetime] = None
    status: AssignmentStatus = AssignmentStatus.ASSIGNED
    sla_deadline: Optional[datetime] = None
    proof_files: Optional[List[ProofFile]] = []
    submitted_at: Optional[datetime] = None
    verified_by: Optional[Any] = None
    verified_at: Optional[datetime] = None
    escalate_reason: Optional[str] = None
    retries: int = 0
    final_note: Optional[str] = None

# ------------------ Worker Model ------------------ #
class Worker(Document):
    full_name: str
    role: str  # plumber, fitter, contractor
    available: bool = True
    last_assigned_at: Optional[datetime] = None
    created_at: datetime = datetime.utcnow()
    max_tasks: Optional[int] = 3
    group: str = "Worker"
    created_by_je: Optional[str] = None

    class Settings:
        name = "workers"

# ------------------ Complaint Model ------------------ #
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
    current_assignment_index: Optional[int] = None
    created_at: datetime = datetime.utcnow()
    updated_at: datetime = datetime.utcnow()
    user_id: Optional[str] = None  # stores assigned worker's user_id
    forwarded_to_je: Optional[str] = None
    # ------------------ Contractor fields ------------------ #
    assigned_contractor_id: Optional[str] = None
    assigned_by_je: Optional[str] = None
    verified_by_je: Optional[str] = None
    verification_action: Optional[str] = None
    verification_note: Optional[str] = None

    class Settings:
        name = "complaints"

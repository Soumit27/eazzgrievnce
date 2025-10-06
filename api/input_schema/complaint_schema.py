from typing import List, Optional
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Literal

class Location(BaseModel):
    lat: float
    lng: float

class EvidenceFile(BaseModel):
    file_name: str
    file_url: Optional[str] = None
    file_type: Optional[str] = None

# ------------------ Assignment Schemas ------------------ #
class ProofFileSchema(BaseModel):
    file_name: str
    file_url: Optional[str] = None
    file_type: Optional[str] = None

class AssignmentSchema(BaseModel):
    group: Optional[str] = None
    assigned_by: Optional[str] = None
    worker_id: Optional[str] = None
    status: Optional[Literal[
        'assigned',
        'submitted_by_cm',
        'verified_by_je',
        'verified_by_gm',
        'verified',
        'escalated',
        'cancelled'
    ]] = 'assigned'
    assigned_at: Optional[datetime] = None
    sla_deadline: Optional[datetime] = None
    retries: Optional[int] = 0
    proof_files: Optional[List[ProofFileSchema]] = []
    verified_by: Optional[str] = None
    submitted_at: Optional[datetime] = None
    verified_at: Optional[datetime] = None
    escalate_reason: Optional[str] = None
    final_note: Optional[str] = None 


# ------------------ Request Schemas ------------------ #
class ComplaintCreate(BaseModel):
    full_name: str = Field(..., min_length=1, strip_whitespace=True)
    mobile_number: str = Field(..., min_length=10, max_length=15)
    email: Optional[EmailStr] = None
    complaint_category: str
    complaint_subject: str
    detailed_description: str
    location: Optional[Location] = None
    complete_address: str
    evidence_files: Optional[List[EvidenceFile]] = []

class ComplaintUpdate(BaseModel):
    complaint_category: Optional[str] = None
    complaint_subject: Optional[str] = None
    detailed_description: Optional[str] = None
    location: Optional[Location] = None
    complete_address: Optional[str] = None
    evidence_files: Optional[List[EvidenceFile]] = None
    status: Optional[str] = None  # pending, in_progress, resolved

# ------------------ Response Schema ------------------ #
class ComplaintResponse(BaseModel):
    id: str
    full_name: str
    mobile_number: str
    email: Optional[EmailStr] = None
    complaint_category: str
    complaint_subject: str
    detailed_description: str
    location: Optional[Location] = None
    complete_address: str
    evidence_files: Optional[List[EvidenceFile]] = []
    status: str
    user_id: Optional[str] = None
    created_at: datetime
    assignments: Optional[List[AssignmentSchema]] = []
    current_assignment: Optional[AssignmentSchema] = None




class AssignRequest(BaseModel):
    group: Optional[str] = None         # e.g., "AM", "Worker", "Contractor"
    worker_user_id: Optional[str] = None      # assigned worker/contractor id
    remarks: Optional[str] = None
    sla_minutes: Optional[int] = 240 

# ------------------ Assign Request Schema ------------------ #
class SubmitProofRequest(BaseModel):
    proof_files: List[ProofFileSchema]


class VerifyActionRequest(BaseModel):
    action: str  # "approve" | "reject"
    note: Optional[str] = None


class ManagerApproveRequest(BaseModel):
    note: Optional[str] = None


class EscalateRequest(BaseModel):
    reason: str
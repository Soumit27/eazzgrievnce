# api/controllers/complaint_ctrl.py
from api.db.models.complaint import Complaint, Assignment, ProofFile, Worker, ComplaintStatus, AssignmentStatus
from typing import List, Dict, Optional
from fastapi import HTTPException
from bson import ObjectId
from datetime import datetime, timedelta

# ------------------ Helpers ------------------


async def get_active_assignments_count(worker_id: str) -> int:
    # Count complaints assigned to this worker that are not closed or escalated
    active_complaints = await Complaint.find(
        {
            "assignments.worker_id": str(worker_id),
            "status": {"$nin": [ComplaintStatus.CLOSED, ComplaintStatus.ESCALATED]}
        }
    ).to_list()
    return len(active_complaints)


def _to_object_id(id_str: str) -> ObjectId:
    try:
        return ObjectId(id_str)
    except Exception:
        raise HTTPException(status_code=200, detail="Invalid ID format")


async def _set_worker_availability(worker_id: str, available: bool = True):
    try:
        worker = await Worker.get(ObjectId(worker_id))
        if worker:
            worker.available = available  # set availability
            worker.last_assigned_at = datetime.utcnow()  # track last assignment
            await worker.save()
    except Exception:
        pass



def _get_current_assignment(complaint: Complaint) -> Assignment:
    idx = complaint.current_assignment_index
    if idx is None or idx >= len(complaint.assignments or []):
        raise HTTPException(status_code=200, detail="No active assignment found")
    return complaint.assignments[idx]

def complaint_to_dict(complaint: Complaint) -> Dict:
    data = complaint.dict()
    data["id"] = str(complaint.id)

    # Convert top-level datetimes
    for field in ["created_at", "updated_at"]:
        if getattr(complaint, field, None):
            data[field] = getattr(complaint, field).isoformat()

    # Convert assignments safely
    assignments = []
    for a in complaint.assignments or []:
        assignment_dict = a.dict()
        for oid_field in ["worker_id", "assigned_by", "verified_by", "assigned_user_id"]:
            if assignment_dict.get(oid_field):
                assignment_dict[oid_field] = str(assignment_dict[oid_field])
        for dt_field in ["assigned_at", "submitted_at", "verified_at", "sla_deadline"]:
            if assignment_dict.get(dt_field):
                assignment_dict[dt_field] = assignment_dict[dt_field].isoformat()
        assignments.append(assignment_dict)
    data["assignments"] = assignments

    # Current assignment
    current_assignment = (
        assignments[complaint.current_assignment_index]
        if complaint.current_assignment_index is not None and assignments
        else None
    )
    data["current_assignment"] = current_assignment
    data["user_id"] = current_assignment.get("assigned_user_id") if current_assignment else None

    return data

# ------------------ CRUD Controllers ------------------

async def create_complaint_controller(data: Complaint) -> Dict:
    saved = await data.insert()
    return complaint_to_dict(saved)

async def get_all_complaints_controller() -> List[Dict]:
    complaints = await Complaint.find_all().to_list()
    return [complaint_to_dict(c) for c in complaints]

async def get_complaint_by_id_controller(complaint_id: str) -> Dict:
    complaint = await Complaint.get(_to_object_id(complaint_id))
    if not complaint:
        raise HTTPException(status_code=200, detail="Complaint not found")
    return complaint_to_dict(complaint)

async def update_complaint_controller(complaint_id: str, data: dict) -> Dict:
    complaint = await Complaint.get(_to_object_id(complaint_id))
    if not complaint:
        raise HTTPException(status_code=200, detail="Complaint not found")
    await complaint.set(data)
    complaint.updated_at = datetime.utcnow()
    await complaint.save()
    return complaint_to_dict(complaint)

async def delete_complaint_controller(complaint_id: str) -> Dict:
    complaint = await Complaint.get(_to_object_id(complaint_id))
    if not complaint:
        raise HTTPException(status_code=200, detail="Complaint not found")
    await complaint.delete()
    return {"detail": "Complaint deleted successfully"}

# ------------------ Workflow Controllers ------------------

async def assign_complaint_controller(
    complaint_id: str,
    group: Optional[str] = None,
    worker_user_id: Optional[str] = None,
    assigned_by: Optional[str] = None,
    sla_minutes: int = 240
) -> Dict:
    complaint = await Complaint.get(_to_object_id(complaint_id))
    if not complaint:
        raise HTTPException(status_code=200, detail="Complaint not found")
    if complaint.status == ComplaintStatus.CLOSED:
        raise HTTPException(status_code=400, detail="Cannot assign a closed complaint")

    worker = None
    if worker_user_id:
        worker = await Worker.find_one(Worker.id == _to_object_id(worker_user_id))
        if not worker:
            raise HTTPException(status_code=200, detail="Worker not found")
        if not worker.available:
            raise HTTPException(status_code=400, detail="Worker not available")

    sla_deadline = datetime.utcnow() + timedelta(minutes=sla_minutes)
    assignment = Assignment(
        group="Worker",
        worker_id=str(worker.id) if worker else None,
        assigned_by=str(assigned_by),
        assigned_user_id=str(worker.id) if worker else None,
        assigned_at=datetime.utcnow(),
        status=AssignmentStatus.ASSIGNED,
        sla_deadline=sla_deadline,
        retries=0,
    )

    complaint.assignments = complaint.assignments or []
    complaint.assignments.append(assignment)
    complaint.current_assignment_index = len(complaint.assignments) - 1
    complaint.status = ComplaintStatus.ASSIGNED
    complaint.updated_at = datetime.utcnow()

    if worker:
       await _set_worker_availability(str(worker.id))


    await complaint.save()
    return complaint_to_dict(complaint)


async def submit_proof_controller(
    complaint_id: str,
    submitter_id: str,
    proof_files: List[ProofFile],
    role: str
) -> Dict:
    complaint = await Complaint.get(_to_object_id(complaint_id))
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")

    current = _get_current_assignment(complaint)
    if not current:
        raise HTTPException(status_code=404, detail="No active assignment found")
    
    if current.status != AssignmentStatus.ASSIGNED_TO_CONTRACTOR:
        raise HTTPException(status_code=403, detail="Complaint not in valid state for submission")

    if role == "Contractor":
        if str(current.worker_id) != str(submitter_id):
            raise HTTPException(status_code=403, detail="Contractor not assigned to this complaint")
    elif role != "JE":
        raise HTTPException(status_code=403, detail="Unauthorized role for proof submission")

    current.proof_files = proof_files
    current.status = AssignmentStatus.SUBMITTED_BY_CM
    current.submitted_at = datetime.utcnow()
    complaint.status = ComplaintStatus.SUBMITTED_BY_CM
    complaint.updated_at = datetime.utcnow()
    await complaint.save()

    return complaint_to_dict(complaint)

async def verify_proof_controller(complaint_id: str, je_id: str, action: str, note: Optional[str] = None) -> Dict:
    complaint = await Complaint.get(_to_object_id(complaint_id))
    if not complaint:
        raise HTTPException(status_code=200, detail="Complaint not found")

    current = _get_current_assignment(complaint)
    if current.status != AssignmentStatus.SUBMITTED_BY_CM:
        raise HTTPException(status_code=200, detail="No proof submitted by CM to verify")

    if action == "approve":
        current.status = AssignmentStatus.VERIFIED_BY_JE
        current.verified_by = str(je_id)
        current.verified_at = datetime.utcnow()
        complaint.status = ComplaintStatus.VERIFIED_BY_JE

    elif action == "reject":
        current.status = AssignmentStatus.ESCALATED
        current.escalate_reason = note or "Rejected by JE"
        complaint.status = ComplaintStatus.ESCALATED
    else:
        raise HTTPException(status_code=200, detail="Invalid action")

    if current.worker_id:
        await _set_worker_availability(current.worker_id, available=True)

    complaint.updated_at = datetime.utcnow()
    await complaint.save()
    return complaint_to_dict(complaint)


async def manager_approve_close_controller(complaint_id: str, manager_id: str, final_note: Optional[str] = None) -> Dict:
    complaint = await Complaint.get(_to_object_id(complaint_id))
    if not complaint:
        raise HTTPException(status_code=200, detail="Complaint not found")
    if complaint.status != ComplaintStatus.VERIFIED_BY_JE:
        raise HTTPException(status_code=200, detail="Complaint not verified by JE for closure")

    current = _get_current_assignment(complaint)
    current.status = AssignmentStatus.VERIFIED_BY_GM
    current.verified_by = manager_id
    current.verified_at = datetime.utcnow()
    current.final_note = final_note

    complaint.status = ComplaintStatus.CLOSED
    complaint.updated_at = datetime.utcnow()
    await complaint.save()
    return complaint_to_dict(complaint)


async def escalate_complaint_controller(complaint_id: str, reason: str) -> Dict:
    complaint = await Complaint.get(_to_object_id(complaint_id))
    if not complaint:
        raise HTTPException(status_code=200, detail="Complaint not found")

    complaint.status = ComplaintStatus.ESCALATED
    if complaint.assignments:
        last = complaint.assignments[-1]
        last.status = AssignmentStatus.ESCALATED
        last.escalate_reason = reason
        if last.worker_id:
            await _set_worker_availability(last.worker_id, available=True)

    complaint.updated_at = datetime.utcnow()
    await complaint.save()
    return complaint_to_dict(complaint)




# ------------------ Forward complaint to JE ------------------
async def forward_to_je_controller(complaint_id: str, cm_id: str, je_id: str) -> Dict:
    complaint = await Complaint.get(_to_object_id(complaint_id))
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    if complaint.status != ComplaintStatus.ASSIGNED:
        raise HTTPException(status_code=400, detail="Only assigned complaints can be forwarded")
    
    # Add forward assignment
    assignment = Assignment(
        group="JE",
        assigned_user_id=str(je_id),
        assigned_by=str(cm_id),
        assigned_at=datetime.utcnow(),
        status=AssignmentStatus.ASSIGNED
    )
    complaint.assignments = complaint.assignments or []
    complaint.assignments.append(assignment)
    complaint.current_assignment_index = len(complaint.assignments) - 1
    complaint.status = ComplaintStatus.FORWARDED_TO_JE
    complaint.updated_at = datetime.utcnow()
    await complaint.save()
    return complaint_to_dict(complaint)

# ------------------ JE creates contractor ------------------
async def create_contractor_controller(je_id: str, contractor_data: dict) -> Dict:
    """
    JE can create a contractor. Only JE ID is saved in created_by_je.
    """
    # Ensure je_id is string
    contractor_data["created_by_je"] = str(je_id)

    # Set role explicitly as contractor
    contractor_data["role"] = "contractor"
    contractor_data["available"] = True
    contractor_data["group"] = "Contractor"

    # Create and insert contractor
    contractor = Worker(**contractor_data)
    saved_contractor = await contractor.insert()

    return {
        "id": str(saved_contractor.id),
        "full_name": saved_contractor.full_name,
        "role": saved_contractor.role,
        "created_by_je": saved_contractor.created_by_je,
        "available": saved_contractor.available,
        "group": saved_contractor.group,
    }


# ------------------ Assign contractor (JE only) ------------------
async def assign_contractor_controller(
    complaint_id: str, contractor_id: str, je_id: str, sla_minutes: int = 240
) -> Dict:
    complaint = await Complaint.get(_to_object_id(complaint_id))
    contractor = await Worker.get(_to_object_id(contractor_id))

    if not complaint or not contractor:
        raise HTTPException(status_code=404, detail="Complaint or contractor not found")

    if str(getattr(contractor, "created_by_je", None)) != str(je_id):
        raise HTTPException(status_code=403, detail="JE can only assign contractors they created")


    assignment = Assignment(
        group="Contractor",
        worker_id=str(contractor.id),
        assigned_user_id=str(contractor.id),
        assigned_by=str(je_id),
        assigned_at=datetime.utcnow(),
        status=AssignmentStatus.ASSIGNED_TO_CONTRACTOR,
        sla_deadline=datetime.utcnow() + timedelta(minutes=sla_minutes)
    )

    complaint.assignments = complaint.assignments or []
    complaint.assignments.append(assignment)
    complaint.current_assignment_index = len(complaint.assignments) - 1
    complaint.status = ComplaintStatus.ASSIGNED
    complaint.updated_at = datetime.utcnow()
    await _set_worker_availability(contractor.id, available=False)
    await complaint.save()
    return complaint_to_dict(complaint)

# ------------------ Contractor submits proof ------------------
async def submit_proof_controller(
    complaint_id: str,
    submitter_id: str,
    proof_files: List[ProofFile],
    role: str  # "CM" or "JE"
) -> Dict:
    """
    Handles submission of proof files.
    - CM submits proof for Worker assignments
    - JE submits proof for Contractor assignments
    """

    complaint = await Complaint.get(_to_object_id(complaint_id))
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")

    current = _get_current_assignment(complaint)
    if not current:
        raise HTTPException(status_code=404, detail="No active assignment found")

    # Role-specific checks
    if role == "CM":
        if current.group != "Worker":
            raise HTTPException(status_code=403, detail="CM can only submit proof for Worker")
        current.status = AssignmentStatus.SUBMITTED_BY_CM
        complaint.status = ComplaintStatus.SUBMITTED_BY_CM

    elif role == "JE":
        if current.group != "Contractor":
            raise HTTPException(status_code=403, detail="JE can only submit proof for Contractor")
        current.status = AssignmentStatus.SUBMITTED_BY_JE
        complaint.status = ComplaintStatus.SUBMITTED_BY_JE

    else:
        raise HTTPException(status_code=403, detail="Unauthorized role for proof submission")

    current.proof_files = proof_files
    current.submitted_at = datetime.utcnow()
    complaint.updated_at = datetime.utcnow()
    await complaint.save()

    return complaint_to_dict(complaint)


# ------------------ JE verifies contractor work ------------------
async def je_verify_contractor_controller(
    complaint_id: str,
    je_id: str,
    action: str,
    note: Optional[str] = None
) -> Dict:
    complaint = await Complaint.get(_to_object_id(complaint_id))
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")

    current = _get_current_assignment(complaint)

    # ✅ JE is allowed to verify directly (no CM or contractor proof check)
    if not current:
        raise HTTPException(status_code=400, detail="No active assignment found for this complaint")

    if action == "approve":
        current.status = AssignmentStatus.VERIFIED_BY_JE
        current.verified_by = str(je_id)
        current.verified_at = datetime.utcnow()
        complaint.status = ComplaintStatus.VERIFIED_BY_JE
    elif action == "reject":
        current.status = AssignmentStatus.ESCALATED
        current.escalate_reason = note or "Rejected by JE"
        complaint.status = ComplaintStatus.ESCALATED
    else:
        raise HTTPException(status_code=400, detail="Invalid action")

    if current.worker_id:
        await _set_worker_availability(current.worker_id, True)

    complaint.updated_at = datetime.utcnow()
    await complaint.save()
    return complaint_to_dict(complaint)



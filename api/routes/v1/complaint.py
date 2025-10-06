from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from typing import List
import os, shutil, uuid

from api.db.models.user import User
from api.db.models.complaint import Complaint, Worker
from api.controllers.complaint_ctrl import (
    create_complaint_controller,
    get_all_complaints_controller,
    assign_complaint_controller,
    submit_proof_controller,
    verify_proof_controller,
    manager_approve_close_controller,
    escalate_complaint_controller,
    get_active_assignments_count
)
from api.input_schema.complaint_schema import (
    ComplaintCreate, ComplaintResponse, AssignRequest, SubmitProofRequest,
    VerifyActionRequest, ManagerApproveRequest, EscalateRequest
)
from api.core.deps import get_current_user
from api.core.roles import roles_required

router = APIRouter(prefix="/complaint", tags=["Complaints"])

# =======================
# 1) Submit a new complaint
# =======================
@router.post("/", response_model=ComplaintResponse)
async def create_complaint(payload: ComplaintCreate, current_user: User = Depends(get_current_user)):
    """
    Any user can submit a complaint.
    """
    complaint = Complaint(**payload.dict(), created_by=current_user.id)
    return await create_complaint_controller(complaint)


# =======================
# 2) Get all complaints
# =======================
@router.get("/", response_model=List[ComplaintResponse])
async def get_all_complaints():
    return await get_all_complaints_controller()


# # =======================
# # 3) Assign complaint to worker (CM only)
# # =======================
# @router.post("/{complaint_id}/assign", response_model=ComplaintResponse, dependencies=[Depends(roles_required(["CM"]))])
# async def assign_complaint(
#     complaint_id: str,
#     payload: AssignRequest,
#     current_user: User = Depends(get_current_user)
# ):
#     """
#     Only CM can assign the work.
#     Auto-select worker if not provided and check worker capacity.
#     """
#     worker_user_id = payload.worker_user_id
#     if not worker_user_id:
#         workers = await Worker.find({"available": True}).to_list()
#         for w in workers:
#             active_count = await get_active_assignments_count(str(w.id))
#             if active_count < (w.max_tasks or 3):
#                 worker_user_id = str(w.id)
#                 break
#         if not worker_user_id:
#             raise HTTPException(status_code=400, detail="No available worker to assign")

#     return await assign_complaint_controller(
#         complaint_id,
#         group=payload.group,
#         worker_user_id=worker_user_id,
#         assigned_by=current_user.id,
#         sla_minutes=payload.sla_minutes
#     )



# =======================
# 3) Assign complaint to worker (CM only)
# =======================
@router.post("/{complaint_id}/assign", dependencies=[Depends(roles_required(["CM"]))])
async def assign_complaint(
    complaint_id: str,
    payload: AssignRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Only CM can assign the work.
    Auto-select worker if not provided and check worker capacity.
    Also shows all available workers with their workloads.
    """

    # --- Step 1: Fetch all workers and calculate their workload ---
    all_workers = await Worker.find_all().to_list()
    workers_info = []

    # for worker in all_workers:
    #     active_count = await get_active_assignments_count(str(worker.id))
    #     workers_info.append({
    #         "id": str(worker.id),
    #         "name": getattr(worker, "name", ""),
    #         "email": getattr(worker, "email", ""),
    #         "group": getattr(worker, "group", "Worker"),
    #         "available": getattr(worker, "available", True),
    #         "max_tasks": getattr(worker, "max_tasks", 3),
    #         "active_tasks": active_count,
    #         "can_take_more": getattr(worker, "available", True)
    #         and active_count < getattr(worker, "max_tasks", 3)
    #     })


    for worker in all_workers:
       active_count = await get_active_assignments_count(str(worker.id))
       workers_info.append({
        "id": str(worker.id),
        "name": getattr(worker, "name", ""),
        "email": getattr(worker, "email", ""),
        "group": getattr(worker, "group", "Worker"),
        "available": True,       # always show in dropdown
        "active_tasks": active_count,  # show how many tasks assigned
    })


    # --- Step 2: Auto-select least busy worker if none is given ---
    worker_user_id = payload.worker_user_id
    if not worker_user_id:
        sorted_workers = sorted(workers_info, key=lambda x: x["active_tasks"])
        worker_user_id = sorted_workers[0]["id"] if sorted_workers else None


    # --- Step 3: Perform assignment using existing controller ---
    complaint_data = await assign_complaint_controller(
        complaint_id,
        group=payload.group,
        worker_user_id=worker_user_id,
        assigned_by=current_user.id,
        sla_minutes=payload.sla_minutes
    )

    # --- Step 4: Return complaint + all workers info ---
    return {
        "message": "Complaint assigned successfully",
        "complaint": complaint_data,
        "available_workers": workers_info
    }


# =======================
# 4) Submit proof for complaint (CM only)
# =======================
@router.post("/{complaint_id}/submit-proof", response_model=ComplaintResponse, dependencies=[Depends(roles_required(["CM"]))])
async def submit_proof(
    complaint_id: str,
    files: List[UploadFile] = File(...)
):
    """
    Submit proof files (images/docs) for a complaint.
    """
    upload_folder = f"uploads/{complaint_id}"
    os.makedirs(upload_folder, exist_ok=True)

    proof_files = []
    for file in files:
        if file.content_type not in ["image/jpeg", "image/png", "application/pdf"]:
            raise HTTPException(status_code=400, detail="Invalid file type")
        unique_filename = f"{uuid.uuid4()}_{file.filename}"
        file_path = os.path.join(upload_folder, unique_filename)

        with open(file_path, "wb") as f:
            shutil.copyfileobj(file.file, f)

        proof_files.append({
            "file_name": file.filename,
            "file_url": f"/uploads/{complaint_id}/{unique_filename}"
        })

    return await submit_proof_controller(
        complaint_id=complaint_id,
        proof_files=proof_files
    )


# =======================
# 5) Verify proof (JE only)
# =======================
@router.post("/{complaint_id}/verify", response_model=ComplaintResponse, dependencies=[Depends(roles_required(["JE"]))])
async def verify_proof(
    complaint_id: str,
    action_payload: VerifyActionRequest,
    current_user: User = Depends(get_current_user)
):
    return await verify_proof_controller(
        complaint_id,
        je_id=current_user.id,
        action=action_payload.action,
        note=action_payload.note
    )


# =======================
# 6) Manager approve/close (GM/Manager/SDO)
# =======================
@router.post("/{complaint_id}/manager-approve", response_model=ComplaintResponse, dependencies=[Depends(roles_required(["GM","Manager", "SDO"]))])
async def manager_approve_close(
    complaint_id: str,
    payload: ManagerApproveRequest,
    current_user: User = Depends(get_current_user)
):
    return await manager_approve_close_controller(
        complaint_id,
        manager_id=current_user.id,
        final_note=payload.note
    )


# =======================
# 7) Escalate complaint (AM/CM/SDO)
# =======================
@router.post("/{complaint_id}/escalate", response_model=ComplaintResponse, dependencies=[Depends(roles_required(["AM","CM","SDO"]))])
async def escalate_complaint(
    complaint_id: str,
    payload: EscalateRequest
):
    return await escalate_complaint_controller(
        complaint_id,
        reason=payload.reason
    )


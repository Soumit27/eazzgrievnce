# api/controllers/contractor_ctrl.py
from fastapi import HTTPException
from api.db.models.worker import Worker
from api.controllers.complaint_ctrl import get_active_assignments_count
from typing import Dict

async def create_contractor_controller(je_user, payload: Dict):
    # defensive check
    if getattr(je_user, "role", "").upper() != "JE":
        raise HTTPException(status_code=403, detail="Only JE can create contractors")

    contractor = Worker(
        full_name=payload["name"],
        role="contractor",
        group="Contractor",
        available=True,
        max_tasks=payload.get("max_tasks", 3),
        created_by_je=str(je_user.id)
    )
    await contractor.insert()
    return {"id": str(contractor.id), "message": "Contractor created"}

async def get_my_contractors_controller(je_user):
    if getattr(je_user, "role", "").upper() != "JE":
        raise HTTPException(status_code=403, detail="Only JE can view contractors")

    contractors = await Worker.find({"created_by_je": str(je_user.id), "group": "Contractor"}).to_list()
    out = []
    for c in contractors:
        active_count = await get_active_assignments_count(str(c.id))
        out.append({
            "id": str(c.id),
            "name": getattr(c, "full_name", ""),
            "email": getattr(c, "email", None),
            "available": getattr(c, "available", True),
            "max_tasks": getattr(c, "max_tasks", 3),
            "active_tasks": active_count
        })
    return out

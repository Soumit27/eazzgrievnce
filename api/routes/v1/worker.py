from fastapi import APIRouter, Depends
from typing import List
from api.controllers.worker_ctrl import create_worker_controller, get_workers_controller
from api.input_schema.worker_schema import WorkerCreate, WorkerResponse
from api.core.roles import roles_required
from api.core.permissions import permission_required

router = APIRouter(prefix="/worker", tags=["Workers"])


@router.post("/", response_model=WorkerResponse, dependencies=[Depends(permission_required("worker", "create"))])
async def create_worker(payload: WorkerCreate):
    """
    CM creates a Worker profile (no login account).
    """
    return await create_worker_controller(payload.full_name, payload.role)

@router.get("/", response_model=List[WorkerResponse], dependencies=[Depends(roles_required(["CM"]))])
async def list_workers():
    """
    List all worker profiles (CM only).
    """
    return await get_workers_controller()

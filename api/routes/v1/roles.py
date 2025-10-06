from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
from api.db.models.role_permission import RolePermission, Permission
from api.core.permissions import permission_required
from pydantic import BaseModel

router = APIRouter(prefix="/roles", tags=["Roles"])

# Controller-like logic
async def create_role_controller(payload: "RoleCreateRequest") -> "RoleResponse":
    role_name = payload.role.upper().strip()

    existing = await RolePermission.find_one(RolePermission.role == role_name)
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Role already exists")

    # Create role in DB
    rp = RolePermission(role=role_name, permissions=payload.permissions)
    await rp.insert()  # MongoDB assigns rp.id automatically

    # Return RoleResponse including id
    return RoleResponse(
        id=str(rp.id),       # must include id
        role=rp.role,
        permissions=rp.permissions
    )

async def get_roles_controller():
    rows = await RolePermission.find_all().to_list()
    return [r.role for r in rows]

# Pydantic schemas
class RoleCreateRequest(BaseModel):
    role: str
    permissions: List[Permission] = []

class RoleResponse(RoleCreateRequest):
    id: str

# Endpoints
@router.get("/available", response_model=List[str])
async def get_roles_available():
    return await get_roles_controller()

# Create role - protected by permission
@router.post("/", response_model=RoleResponse, dependencies=[Depends(permission_required("role", "create"))])
async def create_role(payload: RoleCreateRequest):
    return await create_role_controller(payload)


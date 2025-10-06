from api.db.models.complaint import Worker
from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Dict
from api.core.deps import get_current_user, roles_required
from api.controllers import user_ctrl
from api.input_schema.user_schema import UserResponseSchema, OfficialRegisterSchema, WorkerCreateSchema
from api.db.models.user import User
from api.controllers.user_ctrl import list_complaint_managers
from api.core.auth import hash_password
from api.core.permissions import permission_required


router = APIRouter(prefix="/users", tags=["Users"])


# ----------------- HELPERS -----------------
def format_user(u: User) -> UserResponseSchema:
    return UserResponseSchema(
        id=str(u.id),
        name=u.name,
        email=u.email,
        phone=u.phone,
        role=u.role,
        division=u.division,
        status=u.status
    )


# ----------------- LIST USERS -----------------
@router.get("/", response_model=List[UserResponseSchema], dependencies=[Depends(roles_required(["GM","AM",]))])
async def list_users():
    users = await user_ctrl.list_users()
    return [format_user(u) for u in users]


# ----------------- CURRENT USER -----------------
@router.get("/me", response_model=UserResponseSchema)
async def get_me(user: User = Depends(get_current_user)):
    return format_user(user)


@router.post("/", response_model=UserResponseSchema)
async def create_user(
    data: OfficialRegisterSchema,
    gm_user: User = Depends(get_current_user),
    permission: bool = Depends(permission_required("user", "create"))
):
    """
    GM creates a new user. Permission is checked via 'permission_required'.
    """
    try:
        u = await user_ctrl.create_user_by_gm(data, gm_user)
        return format_user(u)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))

    

# ----------------- UPDATE USER -----------------
@router.put("/{user_id}", response_model=UserResponseSchema)
async def update_user(user_id: str, patch: Dict, current_user: User = Depends(get_current_user)):
    if current_user.role != "GM" and str(current_user.id) != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not allowed")

    u = await user_ctrl.update_user(user_id, patch)
    if not u:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    return format_user(u)


# ----------------- DELETE USER (GM only) -----------------
@router.delete("/{user_id}", dependencies=[Depends(roles_required(["GM"]))])
async def delete_user(user_id: str):
    ok = await user_ctrl.delete_user(user_id)
    if not ok:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return {"message": "User deleted"}




@router.get("/complaint-managers", response_model=List[UserResponseSchema],
            dependencies=[Depends(roles_required(["GM", "AM"]))])  # adjust roles as needed
async def get_complaint_managers():
    cms = await list_complaint_managers()
    return [format_user(u) for u in cms]









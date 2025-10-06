from typing import List, Optional
from fastapi import HTTPException, status
from api.db.models.user import User
from api.input_schema.user_schema import OfficialRegisterSchema
from api.core.auth import hash_password
from api.core.permissions import has_permission
from api.db.models.role_permission import RolePermission


# ----------------- HELPERS -----------------
async def get_user_or_404(user_id: str) -> User:
    """Fetch user or raise 404"""
    user = await User.get(user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user


# ----------------- USERS -----------------
async def list_users() -> List[User]:
    try:
        return await User.find_all().to_list()
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail=f"Failed to list users: {str(e)}")



async def list_complaint_managers() -> List[User]:
    try:
        return await User.find(User.role == "CM").to_list()
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail=f"Failed to fetch Complaint Managers: {str(e)}")

async def get_user_by_id(user_id: str) -> Optional[User]:
    try:
        return await get_user_or_404(user_id)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail=f"Error retrieving user: {str(e)}")


async def create_user_by_gm(data: OfficialRegisterSchema, gm_user: User) -> User:
    print("GM role:", gm_user.role)
    """
    Create a new user by GM (General Manager).
    - GM must have 'user:create' permission.
    - GM can only assign roles that exist in RolePermission table.
    - GM must also have permission to assign the target role.
    """

    try:
        # 1) Check if GM has base permission to create users
        if not await has_permission(gm_user, "user", "create"):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You are not allowed to create users"
            )

        # 2) Normalize target role
        target_role = data.role.upper().strip()
        

        gm_rp = await RolePermission.find_one(RolePermission.role == str(gm_user.role).upper())
        if not gm_rp:
            raise HTTPException(status_code=403, detail="GM role not configured")

        if "*" not in [r.upper() for r in gm_rp.assignable_roles] and target_role not in [r.upper() for r in gm_rp.assignable_roles]:
            raise HTTPException(
                status_code=403,
                detail=f"You cannot assign role: {target_role}"
            )


        # 5) Ensure email is unique
        email = data.email.lower().strip()
        if await User.find_one(User.email == email):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User with this email already exists"
            )

        # 6) Create new user
        new_user = User(
            name=data.name.strip(),
            email=email,
            hashed_password=hash_password(data.password),
            role=target_role,
            division=data.division or gm_user.division,  # default to GM's division
            status="active"
        )

        await new_user.insert()
        return new_user

    except HTTPException:
        # re-raise handled errors
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unexpected error while creating user: {str(e)}"
        )





async def update_user(user_id: str, patch: dict) -> User:
    try:
        user = await get_user_or_404(user_id)
        allowed_fields = ["name", "division", "status", "role", "email", "phone"]
        
        for key in allowed_fields:
            if key in patch:
                setattr(user, key, patch[key])
        
        await user.save()
        return user

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail=f"Error updating user: {str(e)}")


async def delete_user(user_id: str) -> bool:
    try:
        user = await get_user_or_404(user_id)
        await user.delete()
        return True

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail=f"Error deleting user: {str(e)}")

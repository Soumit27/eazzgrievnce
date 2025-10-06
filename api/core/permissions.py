from fastapi import Depends, HTTPException, status
from api.core.deps import get_current_user
from api.db.models.user import User
from api.db.models.role_permission import RolePermission
from typing import List

# has_permission (already updated earlier)
async def has_permission(user: User, resource: str, action: str, target: str = None) -> bool:
    if not user or not getattr(user, "role", None):
        return False

    role_name = str(user.role).upper()
    rp = await RolePermission.find_one(RolePermission.role == role_name)
    if not rp:
        return False

    resource = (resource or "").lower()
    action = (action or "").lower()
    target = (target or "").upper() if target else None

    for p in rp.permissions:
        res = p.resource.lower()
        act = p.action.lower()
        tgt = p.target.upper() if p.target else None

        res_match = (res == "*" or res == resource)
        act_match = (act == "*" or act == action)
        tgt_match = True
        if target and tgt:
            tgt_match = (tgt == target)

        if res_match and act_match and tgt_match:
            return True

    return False


# 🔑 permission_required dependency for routes
def permission_required(resource: str, action: str):
    async def wrapper(user: User = Depends(get_current_user)):
        if not await has_permission(user, resource, action):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"You are not allowed to {action} {resource}"
            )
        return user   # return user if you need user object in route
    return wrapper


# api/core/roles.py
from fastapi import Depends, HTTPException, status
from api.core.deps import get_current_user  # you have this already

def roles_required(allowed_roles: list):
    def inner(current_user = Depends(get_current_user)):
        if current_user.role not in allowed_roles:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")
        return current_user
    return inner

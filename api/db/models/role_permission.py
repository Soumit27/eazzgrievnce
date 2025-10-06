from beanie import Document
from pydantic import BaseModel
from typing import List, Optional

class Permission(BaseModel):
    resource: str   # "user", "complaint", "worker", "role", or "*"
    action: str     # "create", "read", "update", "delete", "assign" or "*"
    target: Optional[str] = None  # optional role target

class RolePermission(Document):
    role: str
    permissions: List[Permission] = []
    assignable_roles: List[str] = []   # <— NEW

    class Settings:
        name = "role_permissions"

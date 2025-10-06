from beanie import Document, init_beanie
from typing import List, Dict
from pydantic import BaseModel

class PermissionModel(BaseModel):
    resource: str
    action: str

class RoleModel(Document):
    role: str
    permissions: List[PermissionModel]

    class Settings:
        name = "roles"

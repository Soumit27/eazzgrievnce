from fastapi import HTTPException
from api.db.models.role import RoleModel  # your role Mongo model

# Create a new role
async def create_role_controller(role_data: dict):
    # Check if role already exists
    existing_role = await RoleModel.find_one({"role": role_data["role"]})
    if existing_role:
        raise HTTPException(status_code=400, detail="Role already exists")
    
    new_role = RoleModel(**role_data)
    await new_role.insert()
    return {"role": new_role.role, "permissions": new_role.permissions}


# Get all roles
async def get_roles_controller():
    roles = await RoleModel.find_all().to_list()
    return roles

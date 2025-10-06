from api.db.models.role_permission import RolePermission, Permission

async def seed_roles():
    # GM permissions
    gm_permissions = [
        Permission(resource="role", action="create"),
        Permission(resource="role", action="update"),
        Permission(resource="user", action="create"),
        Permission(resource="user", action="update"),
    ]

    gm_role = await RolePermission.find_one(RolePermission.role == "GM")
    if not gm_role:
        await RolePermission(
            role="GM",
            permissions=gm_permissions,
            assignable_roles=["JE","SDO","CM"]   # <— GM can assign only these
        ).insert()
    else:
        gm_role.permissions = gm_permissions
        gm_role.assignable_roles = ["JE","SDO","CM"]
        await gm_role.save()

    # Admin permissions
    admin_permissions = [Permission(resource="*", action="*")]
    admin_role = await RolePermission.find_one(RolePermission.role == "ADMIN")
    if not admin_role:
        await RolePermission(
            role="ADMIN",
            permissions=admin_permissions,
            assignable_roles=["*"]   # <— Admin can assign any role
        ).insert()
    else:
        admin_role.permissions = admin_permissions
        admin_role.assignable_roles = ["*"]
        await admin_role.save()

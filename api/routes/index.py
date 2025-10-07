from fastapi import APIRouter
# from routes.v1 import auth, user


from api.routes.v1 import (
     user as v1_user,
     auth as v1_auth,
     complaint as v1_complaint,
     worker as v1_worker,
     roles as v1_roles,
)

router = APIRouter()
API_VERSION = "/v1"

# include all routers here
router.include_router(v1_auth.router, prefix=API_VERSION)
router.include_router(v1_user.router, prefix=API_VERSION)
router.include_router(v1_complaint.router, prefix=API_VERSION)
router.include_router(v1_worker.router, prefix=API_VERSION)
router.include_router(v1_roles.router, prefix=API_VERSION)





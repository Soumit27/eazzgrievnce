# api/main.py
from fastapi import FastAPI
from api.db.mongo import init_db 
from api.routes.index import router
from api.db.seed_roles import seed_roles

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="EazzGrievance API")

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],  # frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# include routes
app.include_router(router)

# initialize MongoDB
@app.on_event("startup")
async def on_startup():
    await init_db()
    await seed_roles()

@app.get("/")
def root():
    return {"message": "FastAPI + MongoDB running"}

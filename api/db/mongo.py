# api/db.py
import motor.motor_asyncio
from beanie import init_beanie
from api.routes import index
from api.db.models.user import User
from api.db.models.complaint import Complaint, Worker
from api.db.models.role_permission import RolePermission 
import os
from dotenv import load_dotenv

load_dotenv()  # load .env

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("MONGO_DB", "grievance")

async def init_db():
    client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URI)
    db = client[DB_NAME]
    await init_beanie(database=db, document_models=[User, Complaint, Worker, RolePermission])
    print("✅ Beanie initialized with MongoDB")

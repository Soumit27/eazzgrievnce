# api/db/models/user.py
from beanie import Document
from pydantic import EmailStr
from typing import Optional
from datetime import datetime

class User(Document):
    name: str
    email: Optional[EmailStr] = None     # For officials
    phone: Optional[str] = None          # For citizens
    hashed_password: Optional[str] = None
    role: str                             # e.g., "GM","CM","AM","JE","SDO","Citizen"
    division: Optional[str] = None
    status: str = "active"
    created_at: datetime = datetime.utcnow()

    class Settings:
        name = "users"

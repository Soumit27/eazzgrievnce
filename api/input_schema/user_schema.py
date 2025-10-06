# api/input_schema/user_schema.py
from pydantic import BaseModel, EmailStr
from typing import Optional

# --- Requests ---
class OfficialRegisterSchema(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str            # "GM","CM","AM","JE","SDO"
    division: Optional[str] = None

class OfficialLoginSchema(BaseModel):
    email: EmailStr
    password: str

class CitizenSendOTPSchema(BaseModel):
    phone: str

class CitizenVerifyOTPSchema(BaseModel):
    phone: str
    otp: str

# --- Responses ---
class UserResponseSchema(BaseModel):
    id: str
    name: str
    email: Optional[EmailStr]
    phone: Optional[str]
    role: str
    division: Optional[str]
    status: str


class WorkerCreateSchema(BaseModel):
    full_name: str
    role: str = "Worker"  # default role

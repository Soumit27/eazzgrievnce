# api/input_schema/auth_schema.py
from pydantic import BaseModel

class TokenSchema(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str

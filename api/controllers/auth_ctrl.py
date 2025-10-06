from fastapi.responses import JSONResponse
from datetime import timedelta, datetime
from typing import Dict, Optional, List
import os
import random
import traceback
from dotenv import load_dotenv
from api.db.models.user import User
from api.input_schema.user_schema import OfficialRegisterSchema
from api.input_schema.auth_schema import TokenSchema
from api.core.auth import hash_password, verify_password, create_access_token

# ------------------ ENV & CONFIG ------------------
load_dotenv()
OTP_EXPIRY_SECONDS: int = int(os.getenv("OTP_EXPIRY_SECONDS", "300"))

# In-memory OTP store: { phone: {"otp": "123456", "expires_at": datetime} }
_otp_store: Dict[str, Dict] = {}

# ------------------ HELPERS ------------------
def _generate_otp() -> str:
    """Generate a 6-digit OTP."""
    return f"{random.randint(100000, 999999):06d}"

def _otp_response(
    status: bool,
    message: str,
    phone: Optional[str] = None,
    otp: Optional[str] = None,
    errors: Optional[List[str]] = None
) -> JSONResponse:
    """Standardized OTP response."""
    content = {
        "status": status,
        "message": message,
        "errors": errors or [],
        "data": {"phone": phone, "otp_debug": otp} if status else {}
    }
    return JSONResponse(status_code=200, content=content)

# ------------------ OFFICIALS ------------------
async def register_official(data: OfficialRegisterSchema) -> User:
    """Register an official user."""
    if await User.find_one(User.email == data.email.lower().strip()):
        raise ValueError("User already exists")

    user = User(
        name=data.name.strip(),
        email=data.email.lower().strip(),
        hashed_password=hash_password(data.password),
        role=data.role.upper(),
        division=data.division
    )
    await user.insert()
    return user

async def login_official(email: str, password: str) -> TokenSchema:
    """Authenticate official and return JWT token."""
    user = await User.find_one(User.email == email.lower().strip())
    if not user or not verify_password(password, user.hashed_password):
        raise ValueError("Invalid credentials")

    token = create_access_token({"sub": str(user.id), "role": user.role})
    return TokenSchema(access_token=token, role=user.role)

# ------------------ CITIZENS ------------------
def send_otp(phone: str) -> JSONResponse:
    """Generate & store OTP for a citizen."""
    try:
        if not phone:
            return _otp_response(False, "Phone number is required")

        otp = _generate_otp()
        _otp_store[phone] = {
            "otp": otp,
            "expires_at": datetime.utcnow() + timedelta(seconds=OTP_EXPIRY_SECONDS),
        }
        return _otp_response(True, "OTP sent successfully", phone=phone, otp=otp)

    except Exception as e:
        traceback.print_exc()
        return _otp_response(False, f"Error sending OTP: {str(e)}")

async def verify_otp_and_get_token(phone: str, otp: str) -> TokenSchema:
    """Verify OTP and return JWT token for citizen login/registration."""
    entry = _otp_store.get(phone)

    if not entry:
        raise ValueError("No OTP found or expired")

    if entry["expires_at"] < datetime.utcnow():
        _otp_store.pop(phone, None)
        raise ValueError("OTP expired")

    if entry["otp"] != otp:
        raise ValueError("Invalid OTP")

    # Get or create citizen user
    user = await User.find_one(User.phone == phone)
    if not user:
        user = User(name=f"Citizen-{phone[-4:]}", phone=phone, role="CITIZEN")
        await user.insert()

    # OTP one-time use
    _otp_store.pop(phone, None)

    token = create_access_token({"sub": str(user.id), "role": user.role})
    return TokenSchema(access_token=token, role=user.role)

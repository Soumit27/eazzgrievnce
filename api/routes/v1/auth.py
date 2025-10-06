from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordRequestForm
from api.input_schema.user_schema import OfficialRegisterSchema, CitizenSendOTPSchema, CitizenVerifyOTPSchema, UserResponseSchema
from api.input_schema.auth_schema import TokenSchema
from api.controllers.auth_ctrl import send_otp, verify_otp_and_get_token, register_official, login_official

router = APIRouter(prefix="/auth", tags=["Auth"])

# -------------------- Register official --------------------
@router.post("/register", response_model=UserResponseSchema)
async def register(data: OfficialRegisterSchema):
    try:
        user = await register_official(data)
        return UserResponseSchema(
            id=str(user.id),
            name=user.name,
            email=user.email,
            phone=user.phone,
            role=user.role,
            division=user.division,
            status=user.status
        )
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))

# -------------------- Login official (email + password) --------------------
@router.post("/login", response_model=TokenSchema)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    """
    Swagger will show 'username' and 'password' fields here.
    'username' is your email for official login.
    """
    try:
        token = await login_official(form_data.username, form_data.password)
        return token
    except ValueError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

# -------------------- Citizen OTP --------------------
@router.post("/citizen/send-otp")
def citizen_send_otp(payload: CitizenSendOTPSchema):
    """
    Send mock OTP (6-digit) to a given phone number.
    """
    otp_data = send_otp(payload.phone)
    return otp_data  # Keep verbose JSONResponse for send-otp

@router.post("/citizen/verify-otp", response_model=TokenSchema)
async def citizen_verify_otp(payload: CitizenVerifyOTPSchema):
    """
    Verify OTP and return token.
    """
    try:
        return await verify_otp_and_get_token(payload.phone, payload.otp)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))

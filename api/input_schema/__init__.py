# api/input_schemas/__init__.py
from .user_schema import (
    OfficialRegisterSchema,
    OfficialLoginSchema,
    CitizenSendOTPSchema,
    CitizenVerifyOTPSchema
)
from .auth_schema import TokenSchema
from .complaint_schema import ComplaintCreate, ComplaintUpdate, ComplaintResponse
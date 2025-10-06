# api/controllers/__init__.py
from .auth_ctrl import register_official, login_official, send_otp, verify_otp_and_get_token
from .user_ctrl import list_users, get_user_by_id, create_user_by_gm, update_user, delete_user, list_complaint_managers
from .complaint_ctrl import (
    create_complaint_controller,
    get_all_complaints_controller,
    get_complaint_by_id_controller,
    update_complaint_controller,
    delete_complaint_controller
)
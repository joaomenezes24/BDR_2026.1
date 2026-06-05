from fastapi import APIRouter

from app.services.analytics_service import (
    get_dashboard
)

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)

@router.get("")
def dashboard():
    return get_dashboard()
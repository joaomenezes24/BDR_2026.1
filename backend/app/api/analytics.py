from fastapi import APIRouter

from app.services.analytics_service import (
    get_ranking_gastos,
    get_temas,
    get_escolaridade
)

router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"]
)

@router.get("/gastos")
def gastos():
    return get_ranking_gastos()


@router.get("/temas")
def temas():
    return get_temas()


@router.get("/escolaridade")
def escolaridade():
    return get_escolaridade()
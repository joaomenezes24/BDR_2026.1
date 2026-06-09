from typing import List
from fastapi import APIRouter

from app.services.analytics_service import AnalyticsService
from app.schemas.analytics import (
    OverviewResponse,
    TemaResponse,
    EscolaridadeResponse,
    EscolaridadeGastosResponse,
    WordCloudResponse
)

router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"]
)


@router.get(
    "/overview",
    response_model=OverviewResponse
)
def get_overview():
    return AnalyticsService.get_overview()


@router.get(
    "/temas",
    response_model=List[TemaResponse]
)
def get_temas():
    return AnalyticsService.get_temas()

@router.get(
    "/escolaridade",
    response_model=list[EscolaridadeResponse]
)
def get_escolaridade():
    return AnalyticsService.get_escolaridade()

@router.get(
    "/escolaridade-gastos",
    response_model=list[EscolaridadeGastosResponse]
)
def get_escolaridade_gastos():
    return AnalyticsService.get_escolaridade_gastos()

@router.get(
    "/wordcloud",
    response_model=list[WordCloudResponse]
)
def get_wordcloud():
    return AnalyticsService.get_wordcloud()
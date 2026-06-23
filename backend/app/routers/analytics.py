from typing import List
from fastapi import APIRouter

from app.services.analytics_service import AnalyticsService
from app.schemas.analytics import (
    OverviewResponse,
    TemaResponse,
    EscolaridadeResponse,
    EscolaridadeGastosResponse,
    WordCloudResponse,
    PartidoResponse,
    EscolaridadeFidelidadeResponse,
    EscolaridadeProposicoesResponse,
    EscolaridadeEventosResponse
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

@router.get(
    "/partidos",
    response_model=list[PartidoResponse]
)
def get_partidos():
    return AnalyticsService.get_partidos()

@router.get(
    "/escolaridade-fidelidade",
    response_model=list[EscolaridadeFidelidadeResponse]
)
def get_escolaridade_fidelidade():
    return AnalyticsService.get_escolaridade_fidelidade()

@router.get(
    "/escolaridade-proposicoes",
    response_model=list[EscolaridadeProposicoesResponse]
)
def get_escolaridade_proposicoes():
    return AnalyticsService.get_escolaridade_proposicoes()

@router.get(
    "/escolaridade-eventos",
    response_model=list[EscolaridadeEventosResponse]
)
def get_escolaridade_eventos():
    return AnalyticsService.get_escolaridade_eventos()
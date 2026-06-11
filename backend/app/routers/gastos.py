from typing import List

from fastapi import APIRouter

from app.schemas.gasto import (
    GastoDeputadoResponse,
    CategoriaGastoResponse
)

from app.services.gastos_service import GastosService

router = APIRouter(
    prefix="/gastos",
    tags=["Gastos"]
)

@router.get(
    "/ranking",
    response_model=List[GastoDeputadoResponse]
)
def ranking_gastos():
    return GastosService.get_ranking_gastos()


@router.get(
    "/categorias",
    response_model=List[CategoriaGastoResponse]
)
def gastos_por_categoria():
    return GastosService.get_gastos_por_categoria()
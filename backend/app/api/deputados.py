from fastapi import APIRouter

from backend.app.services.votacao_service import (
    listar_deputados,
    buscar_deputado,
    gastos_deputado
)
from app.services.deputados_service import DeputadosService

router = APIRouter(
    prefix="/deputados",
    tags=["Deputados"]
)

@router.get("")
def deputados(
    partido: str | None = None,
    uf: str | None = None,
    sexo: str | None = None
):
    return listar_deputados(
        partido,
        uf,
        sexo
    )

@router.get("/{id_deputado}")
def deputado(id_deputado: int):
    return buscar_deputado(id_deputado)

@router.get("/{id_deputado}/despesas")
def despesas(id_deputado: int):
    return gastos_deputado(id_deputado)

def perfil(deputado_id: int):
    return DeputadosService.get_perfil(deputado_id)


def despesas(deputado_id: int):
    return DeputadosService.get_despesas(deputado_id)
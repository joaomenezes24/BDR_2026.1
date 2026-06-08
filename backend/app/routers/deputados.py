from fastapi import APIRouter, HTTPException

from app.schemas.deputados import (
    DeputadoPerfilResponse,
    DeputadoDespesaResponse
)

from app.services.deputados_service import DeputadosService

router = APIRouter(
    prefix="/deputados",
    tags=["Deputados"]
)


@router.get(
    "/{deputado_id}",
    response_model=DeputadoPerfilResponse
)
def get_perfil(deputado_id: int):

    deputado = DeputadosService.get_perfil(deputado_id)

    if deputado is None:
        raise HTTPException(
            status_code=404,
            detail="Deputado não encontrado"
        )

    return deputado


@router.get(
    "/{deputado_id}/despesas",
    response_model=list[DeputadoDespesaResponse]
)
def get_despesas(deputado_id: int):
    return DeputadosService.get_despesas(deputado_id)
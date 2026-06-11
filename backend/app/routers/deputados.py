from fastapi import APIRouter

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
    return DeputadosService.listar_deputados(
        partido,
        uf,
        sexo
    )


@router.get("/{id_deputado}")
def deputado(id_deputado: int):
    return DeputadosService.buscar_deputado(
        id_deputado
    )


@router.get("/{id_deputado}/despesas")
def despesas(id_deputado: int):
    return DeputadosService.gastos_deputado(
        id_deputado
    )
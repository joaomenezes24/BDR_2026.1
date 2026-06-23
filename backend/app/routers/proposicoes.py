from fastapi import APIRouter
from app.services.proposicoes_service import ProposicoesService

router = APIRouter(
    prefix="/proposicoes",
    tags=["proposicoes"]
)

@router.get("/tema/{tema}")
def proposicaoes_por_tema(tema: str, limit: int, offset: int):
    return ProposicoesService.get_proposicoes_por_tema(tema, limit, offset)

@router.get("/votos/{proposicao_id}")
def votos_por_proposicao(proposicao_id: int):
    return ProposicoesService.get_votos_por_proposicao(proposicao_id)
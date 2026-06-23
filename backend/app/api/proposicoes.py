from app.services.proposicoes_service import ProposicoesService

def proposicao_por_tema(tema: str):
    return ProposicoesService.get_proposicao_por_tema(tema)

def votos_por_proposicao(proposicao_id: int):
    return ProposicoesService.get_votos_por_proposicao(proposicao_id)
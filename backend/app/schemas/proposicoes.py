from pydantic import BaseModel

class ProposicaoResponse(BaseModel):
    siglaTipo: str
    numero: int
    ano: int
    ementa: str
    link: str | None = None
    proposicao_id: int
    proposicao_uri: str
    #tempo_banco: float = None
    #tempo_api_camara: float = None

class ProposicaoVotosResponse(BaseModel):
    votos_sim: list
    votos_nao: list
    votos_outros: list

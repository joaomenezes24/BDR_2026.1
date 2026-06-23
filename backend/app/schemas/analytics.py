from pydantic import BaseModel


class OverviewResponse(BaseModel):
    total_deputados: int
    total_despesas: int
    total_proposicoes: int
    total_votacoes: int


class TemaResponse(BaseModel):
    tema: str
    qtd_total: int
    ano_minimo: int | None = None
    ano_maximo: int | None = None

class EscolaridadeResponse(BaseModel):
    escolaridade: str | None = None
    qtd_total: int

class EscolaridadeGastosResponse(BaseModel):
    escolaridade: str
    media_gasto: float
    quantidade_deputados: int

class WordCloudResponse(BaseModel):
    text: str
    value: int

class PartidoResponse(BaseModel):
    partido: str
    qtd_total: int

class EscolaridadeFidelidadeResponse(BaseModel):
    escolaridade: str | None = None
    fidelidade_media: float

class EscolaridadeProposicoesResponse(BaseModel):
    escolaridade: str | None = None
    total_deputados: int
    media_proposicoes: float

class EscolaridadeEventosResponse(BaseModel):
    escolaridade: str | None = None
    total_deputados: int
    media_presenca: float
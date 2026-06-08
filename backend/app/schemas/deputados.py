from pydantic import BaseModel


class EscolaridadeResponse(BaseModel):
    escolaridade: str | None = None
    qtd_total: int


class DeputadoPerfilResponse(BaseModel):
    deputado_id: int
    nome: str
    partido: str | None = None
    uf: str | None = None
    sexo: str | None = None
    escolaridade: str | None = None
    situacao: str | None = None
    total_gasto: float


class DeputadoDespesaResponse(BaseModel):
    categoria: str
    valor_total: float
    quantidade: int
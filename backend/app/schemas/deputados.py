from pydantic import BaseModel

class DeputadoPerfilResponse(BaseModel):
    deputado_id: int
    nome: str
    nome_civil: str
    partido: str | None = None
    uf: str | None = None
    sexo: str | None = None
    escolaridade: str | None = None
    situacao: str | None = None
    total_gasto: float
    datanascimento: str | None = None
    foto: str | None = None


class DeputadoDespesaResponse(BaseModel):
    categoria: str
    valor_total: float
    quantidade: int
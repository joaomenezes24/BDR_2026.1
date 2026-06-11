from pydantic import BaseModel


class GastoDeputadoResponse(BaseModel):
    deputado: str
    partido: str | None = None
    uf: str | None = None
    total_gasto: float
    ano_minimo: int | None = None
    ano_maximo: int | None = None


class CategoriaGastoResponse(BaseModel):
    categoria: str
    valor_total_gasto: float
    qtd_total: int
    ano_minimo: int | None = None
    ano_maximo: int | None = None
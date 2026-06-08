from sqlalchemy import text

from app.database.connection import engine

def listar_deputados(
    partido=None,
    uf=None,
    sexo=None
):

    sql = """
        SELECT *
        FROM Deputados
        WHERE 1=1
    """

    params = {}

    if partido:
        sql += " AND siglapartido = :partido"
        params["partido"] = partido

    if uf:
        sql += " AND siglauf = :uf"
        params["uf"] = uf

    if sexo:
        sql += " AND sexo = :sexo"
        params["sexo"] = sexo

    with engine.connect() as conn:

        result = conn.execute(
            text(sql),
            params
        )

        rows = result.mappings().all()

    return rows


def buscar_deputado(id_deputado):

    sql = """
    SELECT *
    FROM Deputados
    WHERE deputado_id = :id
    """

    with engine.connect() as conn:

        result = conn.execute(
            text(sql),
            {"id": id_deputado}
        )

        deputado = result.mappings().first()

    return deputado

def gastos_deputado(id_deputado):

    sql = """
    SELECT
        txtdescricao,
        ROUND(SUM(vlrliquido),2) AS total
    FROM Despesas
    WHERE idecadastro = :id
    GROUP BY txtdescricao
    ORDER BY total DESC
    """

    with engine.connect() as conn:

        result = conn.execute(
            text(sql),
            {"id": id_deputado}
        )

        return result.mappings().all()
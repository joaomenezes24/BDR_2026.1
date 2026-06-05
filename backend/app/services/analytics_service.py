import pandas as pd

from app.database.connection import engine


def get_dashboard():
    with engine.connect() as conn:

        deputados = pd.read_sql(
            "SELECT COUNT(*) AS total FROM Deputados",
            conn
        )

        partidos = pd.read_sql(
            """
            SELECT COUNT(DISTINCT siglapartido) AS total
            FROM Deputados
            """,
            conn
        )

        proposicoes = pd.read_sql(
            """
            SELECT COUNT(*) AS total
            FROM Proposicoes
            """,
            conn
        )

        despesas = pd.read_sql(
            """
            SELECT COALESCE(SUM(vlrliquido),0) AS total
            FROM Despesas
            """,
            conn
        )

        return {
            "deputados": int(deputados.iloc[0]["total"]),
            "partidos": int(partidos.iloc[0]["total"]),
            "proposicoes": int(proposicoes.iloc[0]["total"]),
            "gastos": float(despesas.iloc[0]["total"])
        }

def get_ranking_gastos():

    sql = """
    SELECT
        d.ultimostatus_nome AS deputado,
        d.siglapartido AS partido,
        d.siglaUF AS uf,
        ROUND(SUM(dp.vlrliquido),2) AS total_gasto
    FROM Despesas dp
    JOIN Deputados d
        ON CAST(dp.idecadastro AS INTEGER)
        =
        CAST(d.deputado_id AS INTEGER)
    GROUP BY dp.idecadastro
    ORDER BY total_gasto DESC
    LIMIT 20
    """

    with engine.connect() as conn:
        df = pd.read_sql(sql, conn)

    return df.to_dict(orient="records")

def get_temas():

    sql = """
    SELECT
        tema,
        COUNT(*) AS quantidade
    FROM ProposicoesTemas
    GROUP BY tema
    ORDER BY quantidade DESC
    """

    with engine.connect() as conn:
        df = pd.read_sql(sql, conn)

    return df.to_dict(orient="records")

def get_escolaridade():

    sql = """
    SELECT
        escolaridade,
        COUNT(*) AS quantidade
    FROM Deputados
    GROUP BY escolaridade
    ORDER BY quantidade DESC
    """

    with engine.connect() as conn:
        df = pd.read_sql(sql, conn)

    return df.to_dict(orient="records")


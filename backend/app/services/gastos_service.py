from app.database.connection import get_connection
from app.database.queries import (
    RANKING_GASTOS_QUERY,
    GASTOS_POR_CATEGORIA_QUERY
)


class GastosService:

    @staticmethod
    def get_ranking_gastos():
        conn = get_connection()

        try:

            cursor = conn.cursor()

            cursor.execute(RANKING_GASTOS_QUERY)

            rows = cursor.fetchall()

            return [
                {
                    "deputado_id": row["deputado_id"],
                    "deputado": row["deputado"],
                    "partido": row["partido"],
                    "uf": row["uf"],
                    "total_gasto": row["total_gasto"],
                    "ano_minimo": row["ano_minimo"],
                    "ano_maximo": row["ano_maximo"]
                }
                for row in rows
            ]

        finally:
            conn.close()

    @staticmethod
    def get_gastos_por_categoria():

        conn = get_connection()

        try:
            cursor = conn.cursor()

            cursor.execute(GASTOS_POR_CATEGORIA_QUERY)

            rows = cursor.fetchall()

            return [
                {
                    "categoria": row["categoria"],
                    "valor_total_gasto": row["valor_total_gasto"],
                    "qtd_total": row["qtd_total"],
                    "ano_minimo": row["ano_minimo"],
                    "ano_maximo": row["ano_maximo"]
                }
                for row in rows
            ]

        finally:
            conn.close()
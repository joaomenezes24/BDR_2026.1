from app.database.connection import get_connection
from app.database.queries import (
    DEPUTADO_PERFIL_QUERY,
    DEPUTADO_DESPESAS_QUERY
)


class DeputadosService:

    @staticmethod
    def get_perfil(deputado_id: int):

        conn = get_connection()

        try:
            cursor = conn.cursor()

            cursor.execute(
                DEPUTADO_PERFIL_QUERY,
                (deputado_id,)
            )

            row = cursor.fetchone()

            if not row:
                return None

            return {
                "deputado_id": row["deputado_id"],
                "nome": row["nome"],
                "partido": row["partido"],
                "uf": row["uf"],
                "sexo": row["sexo"],
                "escolaridade": row["escolaridade"],
                "situacao": row["situacao"],
                "total_gasto": row["total_gasto"]
            }

        finally:
            conn.close()

    @staticmethod
    def get_despesas(deputado_id: int):

        conn = get_connection()

        try:
            cursor = conn.cursor()

            cursor.execute(
                DEPUTADO_DESPESAS_QUERY,
                (deputado_id,)
            )

            rows = cursor.fetchall()

            return [
                {
                    "categoria": row["categoria"],
                    "valor_total": row["valor_total"],
                    "quantidade": row["quantidade"]
                }
                for row in rows
            ]

        finally:
            conn.close()
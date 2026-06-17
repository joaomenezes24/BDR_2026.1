from app.database.connection import get_connection
from app.database.queries import (
    OVERVIEW_QUERY,
    PARTIDOS_QUERY,
    TEMAS_QUERY,
    ESCOLARIDADE_QUERY,
    ESCOLARIDADE_GASTOS_QUERY,
    WORDCLOUD_QUERY
)

class AnalyticsService:

    @staticmethod
    def get_overview():
        conn = get_connection()

        try:
            cursor = conn.cursor()
            cursor.execute(OVERVIEW_QUERY)

            row = cursor.fetchone()

            return {
                "total_deputados": row["total_deputados"],
                "total_despesas": row["total_despesas"],
                "total_proposicoes": row["total_proposicoes"],
                "total_votacoes": row["total_votacoes"]
            }

        finally:
            conn.close()

    @staticmethod
    def get_temas():

        conn = get_connection()

        try:
            cursor = conn.cursor()

            cursor.execute(TEMAS_QUERY)

            rows = cursor.fetchall()

            return [
                {
                    "tema": row["tema"],
                    "qtd_total": row["qtd_total"],
                    "ano_minimo": row["ano_minimo"],
                    "ano_maximo": row["ano_maximo"]
                }
                for row in rows
            ]

        finally:
            conn.close()

    @staticmethod
    def get_escolaridade():

        conn = get_connection()

        try:
            cursor = conn.cursor()

            cursor.execute(ESCOLARIDADE_QUERY)

            rows = cursor.fetchall()

            return [
                {
                    "escolaridade": row["escolaridade"],
                    "qtd_total": row["qtd_total"]
                }
                for row in rows
            ]

        finally:
            conn.close()

    @staticmethod
    def get_escolaridade_gastos():

        conn = get_connection()

        try:
            cursor = conn.cursor()

            cursor.execute(ESCOLARIDADE_GASTOS_QUERY)

            rows = cursor.fetchall()

            return [
                {
                    "escolaridade": row["escolaridade"],
                    "media_gasto": row["media_gasto"],
                    "quantidade_deputados": row["quantidade_deputados"]
                }
                for row in rows
            ]

        finally:
            conn.close()

    @staticmethod
    def get_wordcloud():

        conn = get_connection()

        try:
            cursor = conn.cursor()

            cursor.execute(WORDCLOUD_QUERY)

            rows = cursor.fetchall()

            return [
                {
                    "text": row["text"],
                    "value": row["value"]
                }
                for row in rows
            ]

        finally:
            conn.close()

    @staticmethod
    def get_partidos():

        conn = get_connection()

        try:
            cursor = conn.cursor()

            cursor.execute(PARTIDOS_QUERY)

            rows = cursor.fetchall()

            return [
                {
                    "partido": row["partido"],
                    "qtd_total": row["qtd_total"]
                }
                for row in rows
            ]

        finally:
            conn.close()
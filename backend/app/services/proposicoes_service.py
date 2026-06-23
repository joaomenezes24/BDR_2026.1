from app.schemas.proposicoes import ProposicaoResponse
from app.database.connection import get_connection
from app.database.queries import(
    PROPOSICOES_TEMAS_QUERY,
    PROPOSICOES_TEMAS_VOTOS
)
    
import requests
import time

class ProposicoesService:  
    @staticmethod
    def get_proposicoes_por_tema(tema: str, limit: int, offset: int) -> list[ProposicaoResponse]:
        #print("DEBUG: Chamando get_proposicoes_por_tema com tema:", tema, "limit:", limit, "offset:", offset)
        conn = get_connection()

        #inicio = time.time()
        try:
            cursor = conn.cursor()
            #print("DEBUG: inciando query...")
            cursor.execute(PROPOSICOES_TEMAS_QUERY, (tema, limit, offset))
            rows = cursor.fetchall()
            #tempo_banco = time.time() - inicio
            #print(f"DEBUG: Query executada. Número de resultados: {len(rows)}")

            resultados = []
            
            for row in rows:
                uri_camara = row["uri"] 
                link_documento = None
                
                # Faz o fetch na API da Câmara buscando o JSON
                try:
                    #print(f"DEBUG: Buscando link do inteiro teor na API da Câmara")
                    headers = {"Accept": "application/json"}

                    #inicio_api = time.time()
                    resposta = requests.get(uri_camara, headers=headers, timeout=5)
                    #tempo_api_camara = time.time() - inicio_api
                    #print(f"DEBUG: Resposta da API da Câmara: {resposta.status_code}")

                    if resposta.status_code == 200:
                        dados_json = resposta.json()
                        # Extrai a urlInteiroTeor navegando no JSON retornado
                        link_documento = dados_json.get("dados", {}).get("urlInteiroTeor")
                        #print(f"DEBUG: Link do inteiro teor encontrado: {link_documento}")
                except Exception as e:
                    print(f"Erro ao buscar link do inteiro teor na API da Câmara para {uri_camara}: {e}")

                # Monta a resposta final juntando os dados do banco com o link da API
                resultados.append(
                    ProposicaoResponse(
                        siglaTipo=row["siglatipo"],
                        numero=row["numero"],
                        ano=row["ano"],
                        ementa=row["ementa"],
                        link=link_documento, # Injeta o link na response
                        proposicao_id=row["proposicao_id"],
                        proposicao_uri=uri_camara,
                        # tempo_banco=tempo_banco,
                        # tempo_api_camara=tempo_api_camara
                    )
                )

            return resultados

        finally:
            conn.close()

    @staticmethod
    def get_votos_por_proposicao(proposicao_id: int) -> dict:
        conn = get_connection()

        try:
            cursor = conn.cursor()
            
            cursor.execute(PROPOSICOES_TEMAS_VOTOS, (proposicao_id,))
            rows = cursor.fetchall()

            votos_sim = []
            votos_nao = []
            votos_outros = []

            for row in rows:
                deputado_info = {
                    "nome": row["deputado_nome"],
                    "partido": row["deputado_siglapartido"],
                    "uf": row["deputado_siglauf"]
                }
                
                # Normalizamos o texto para evitar bugs de maiúsculas/minúsculas
                voto_texto = row["voto"].strip().lower()
                
                if voto_texto == 'sim':
                    votos_sim.append(deputado_info)
                elif voto_texto in ['não', 'nao']:
                    votos_nao.append(deputado_info)
                else:
                    votos_outros.append(deputado_info)

            # Retornamos um dicionário já formatado perfeitamente para os quadros da interface
            return {
                "votos_sim": votos_sim,
                "votos_nao": votos_nao,
                "votos_outros": votos_outros
            }

        finally:
            conn.close()


if __name__ == '__main__':
    tema_teste = "Saúde"
    limit_teste = 1
    offset_teste = 0
    
    print(f"--- Testando a função get_proposicoes_por_tema com tema='{tema_teste}' ---")
    
    # Adiciona um manipulador para ver a saída do log de requests
    import logging
    logging.basicConfig(level=logging.DEBUG)
    
    try:
        proposicoes = ProposicoesService.get_proposicoes_por_tema(tema_teste, limit_teste, offset_teste)
        
        if proposicoes:
            print("\n--- Resultados do Teste ---")
            for p in proposicoes:
                print(f"    Link: {p.link}")
                print("-" * 20)
        else:
            print("\n--- Nenhum resultado encontrado para o teste. ---")
            
    except Exception as e:
        print(f"\n--- Ocorreu um erro durante o teste: {e} ---")

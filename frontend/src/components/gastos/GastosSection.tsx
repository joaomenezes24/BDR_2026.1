"use client";

import { useEffect, useState } from "react";
import { gastosService } from "@/src/services/gastosServices";

// Definindo os tipos de abas possíveis para evitar erros de digitação
type Aba = "ranking" | "despesas";

export default function Gastos() {
  const [ranking, setRanking] = useState<any[]>([]);
  const [despesas, setDespesas] = useState<any[]>([]);
  const [deputadoSelecionado, setDeputadoSelecionado] = useState<string>("");

  const [carregandoRanking, setCarregandoRanking] = useState<boolean>(true);
  const [carregandoDespesas, setCarregandoDespesas] = useState<boolean>(false);

  // Novo estado para controlar a aba atual
  const [abaAtiva, setAbaAtiva] = useState<Aba>("ranking");

  useEffect(() => {
    const CACHE_KEY = "ranking_gastos_cache";
    
    // Tenta buscar os dados no cache do navegador
    const dadosEmCache = sessionStorage.getItem(CACHE_KEY);

    if (dadosEmCache) {
      // Se achou no cache, usa eles imediatamente e encerra
      setRanking(JSON.parse(dadosEmCache));
      setCarregandoRanking(false);
      return; 
    }

    setCarregandoRanking(true);
    gastosService
      .getRanking()
      .then((dados) => {
        setRanking(dados);
        console.log("Exemplo de um deputado:", dados[0]);
        // Salva o resultado no cache para os próximos reloads
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(dados));
      })
      .finally(() => setCarregandoRanking(false));
  }, []);

  async function selecionarDeputado(deputado: any) {
    setDeputadoSelecionado(deputado.deputado);
    setCarregandoDespesas(true);
    
    // Muda automaticamente para a aba de despesas ao selecionar um deputado
    setAbaAtiva("despesas");

    try {
      const dados = await gastosService.getDespesasDeputado(
        deputado.deputado_id
      );
      setDespesas(dados);
    } catch (error) {
      console.error("Erro ao buscar despesas do deputado:", error);
    } finally {
      setCarregandoDespesas(false);
    }
  }

  return (
    <div>
      <h1>Painel de Gastos Parlamentares</h1>

      {/* Navegação das Abas */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", borderBottom: "1px solid #ccc", paddingBottom: "1rem" }}>
        <button
          onClick={() => setAbaAtiva("ranking")}
          style={{ 
            fontWeight: abaAtiva === "ranking" ? "bold" : "normal",
            cursor: "pointer",
            padding: "0.5rem 1rem"
          }}
        >
          Ranking
        </button>
        <button
          onClick={() => setAbaAtiva("despesas")}
          style={{ 
            fontWeight: abaAtiva === "despesas" ? "bold" : "normal",
            cursor: "pointer",
            padding: "0.5rem 1rem"
          }}
        >
          Com o que o deputado gasta
        </button>
      </div>

      {/* CONTEÚDO DA ABA: RANKING */}
      {abaAtiva === "ranking" && (
        <div>
          <h2>Ranking de Gastos</h2>
          {carregandoRanking ? (
            <p>Carregando dados do ranking...</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Posição</th>
                  <th>Deputado</th>
                  <th>Partido</th>
                  <th>UF</th>
                  <th>Total Gasto</th>
                  <th>Período</th>
                </tr>
              </thead>
              <tbody>
                {ranking.map((dep, index) => (
                  <tr
                    key={dep.deputado_id}
                    onClick={() => selecionarDeputado(dep)}
                    style={{ cursor: "pointer" }}
                  >
                    <td>{index + 1}</td>
                    <td>{dep.deputado}</td>
                    <td>{dep.partido}</td>
                    <td>{dep.uf}</td>
                    <td>
                      R$ {Number(dep.total_gasto).toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td>
                      {dep.ano_minimo} - {dep.ano_maximo}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* CONTEÚDO DA ABA: DESPESAS */}
      {abaAtiva === "despesas" && (
        <div>
          {/* Validação caso o usuário acesse a aba sem selecionar ninguém */}
          {!deputadoSelecionado && !carregandoDespesas ? (
            <p>Selecione um deputado no ranking para ver com o que ele gasta.</p>
          ) : (
            <div>
              <h2>Despesas de {deputadoSelecionado}</h2>

              {carregandoDespesas ? (
                <p>Buscando despesas...</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Categoria</th>
                      <th>Valor Total</th>
                      <th>Quantidade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {despesas.map((despesa, index) => (
                      <tr key={index}>
                        <td>{despesa.categoria}</td>
                        <td>
                          R$ {Number(despesa.valor_total).toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                          })}
                        </td>
                        <td>{despesa.quantidade}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
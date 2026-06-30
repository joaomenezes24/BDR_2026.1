"use client";

import { useEffect, useState } from "react";
import { gastosService } from "@/src/services/gastosServices";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import HelpTooltip from "../HelpToolTip";
import styles from "@/src/components/dashboard/dashboard.module.css";

// Tipos
type Aba = "ranking" | "despesas";

type Ordenacao = {
  coluna: string;
  direcao: "asc" | "desc";
};

// Paleta de cores para o Gráfico de Pizza
const CORES_GRAFICO = [
  "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8",
  "#82ca9d", "#ffc658", "#8dd1e1", "#a4de6c", "#d0ed57"
];

export default function Gastos() {
  // Estados de dados
  const [ranking, setRanking] = useState<any[]>([]);
  const [despesas, setDespesas] = useState<any[]>([]);
  const [deputadoSelecionado, setDeputadoSelecionado] = useState<string>("");

  // Estados de UI e Carregamento
  const [carregandoRanking, setCarregandoRanking] = useState<boolean>(true);
  const [carregandoDespesas, setCarregandoDespesas] = useState<boolean>(false);
  const [abaAtiva, setAbaAtiva] = useState<Aba>("ranking");

  // Estados de Filtro e Ordenação
  const [buscaNome, setBuscaNome] = useState<string>(""); // NOVO ESTADO: Busca por nome
  const [filtroPartidos, setFiltroPartidos] = useState<string[]>([]);
  const [filtroUFs, setFiltroUFs] = useState<string[]>([]);
  const [ordenacao, setOrdenacao] = useState<Ordenacao>({
    coluna: "posicaoOriginal",
    direcao: "asc", 
  });

  // Busca de Dados Inicial (Ranking com Cache)
  useEffect(() => {
    const CACHE_KEY = "ranking_gastos_cache_v2";
    const dadosEmCache = sessionStorage.getItem(CACHE_KEY);

    if (dadosEmCache) {
      setRanking(JSON.parse(dadosEmCache));
      setCarregandoRanking(false);
      return;
    }

    setCarregandoRanking(true);
    gastosService
      .getRanking()
      .then((dados) => {
        // Injeta a posição original no momento do download
        const dadosComPosicao = dados.map((dep: any, index: number) => ({
          ...dep,
          posicaoOriginal: index + 1
        }));
        
        setRanking(dadosComPosicao);
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(dadosComPosicao));
      })
      .finally(() => setCarregandoRanking(false));
  }, []);

  // Seleção de Parlamentar
  async function selecionarDeputado(deputado: any) {
  console.log("Deputado clicado:", deputado);
  console.log("ID enviado:", deputado.deputado_id);

  setDeputadoSelecionado(deputado.deputado);
  setCarregandoDespesas(true);
  setAbaAtiva("despesas");

  try {
    const dados = await gastosService.getDespesasDeputado(deputado.deputado_id);
    console.log("Despesas retornadas:", dados);
    setDespesas(dados);
  } catch (error) {
    console.error(error);
  } finally {
    setCarregandoDespesas(false);
  }
}

  // --- LÓGICA DE FILTRAGEM E ORDENAÇÃO ---
  const partidosUnicos = Array.from(new Set(ranking.map((d) => d.partido))).sort();
  const ufsUnicas = Array.from(new Set(ranking.map((d) => d.uf))).sort();

  let dadosProcessados = ranking.filter((dep) => {
    const passaPartido = filtroPartidos.length === 0 || filtroPartidos.includes(dep.partido);
    const passaUF = filtroUFs.length === 0 || filtroUFs.includes(dep.uf);
    // NOVA LÓGICA: Verifica se o nome digitado está contido no nome do deputado (ignorando maiúsculas/minúsculas)
    const passaNome = buscaNome === "" || dep.deputado.toLowerCase().includes(buscaNome.toLowerCase());
    
    return passaPartido && passaUF && passaNome;
  });

  dadosProcessados.sort((a, b) => {
    let valorA = a[ordenacao.coluna];
    let valorB = b[ordenacao.coluna];

    if (ordenacao.coluna === "total_gasto" || ordenacao.coluna === "posicaoOriginal") {
      valorA = Number(valorA) || 0;
      valorB = Number(valorB) || 0;
    } else {
      valorA = String(valorA).toLowerCase();
      valorB = String(valorB).toLowerCase();
    }

    if (valorA < valorB) return ordenacao.direcao === "asc" ? -1 : 1;
    if (valorA > valorB) return ordenacao.direcao === "asc" ? 1 : -1;
    return 0;
  });

  const alternarOrdenacao = (coluna: string) => {
    setOrdenacao((prev) => ({
      coluna,
      direcao: prev.coluna === coluna && prev.direcao === "desc" ? "asc" : "desc",
    }));
  };

  const renderIconeOrdenacao = (coluna: string) => {
    if (ordenacao.coluna !== coluna) return " ↕";
    return ordenacao.direcao === "asc" ? " ▲" : " ▼";
  };

  // --- PREPARAÇÃO DOS DADOS DO GRÁFICO (Top 5 + Outros) ---
  const dadosGraficoOrdenados = despesas
    .map((despesa) => ({
      name: despesa.categoria,
      value: Number(despesa.valor_total)
    }))
    .sort((a, b) => b.value - a.value);

  const TOP_N = 5;
  const dadosGrafico = dadosGraficoOrdenados.slice(0, TOP_N);
  
  if (dadosGraficoOrdenados.length > TOP_N) {
    const valorOutros = dadosGraficoOrdenados
      .slice(TOP_N)
      .reduce((soma, item) => soma + item.value, 0);
    
    dadosGrafico.push({
      name: "OUTROS",
      value: valorOutros
    });
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ backgroundColor: "#fff", padding: "10px", border: "1px solid #ccc", borderRadius: "5px", zIndex: 10 }}>
          <p style={{ margin: 0, fontWeight: "bold", fontSize: "0.9rem" }}>{payload[0].name}</p>
          <p style={{ margin: 0, color: payload[0].payload.fill, fontWeight: "bold" }}>
            R$ {payload[0].value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
        </div>
      );
    }
    return null;
  };

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
            padding: "0.5rem 1rem",
          }}
        >
          Ranking
        </button>
        <button
          onClick={() => setAbaAtiva("despesas")}
          style={{
            fontWeight: abaAtiva === "despesas" ? "bold" : "normal",
            cursor: "pointer",
            padding: "0.5rem 1rem",
          }}
        >
          Com o que o deputado gasta
        </button>
      </div>

      {/* --- ABA: RANKING --- */}
      {abaAtiva === "ranking" && (
        <div>
          <div className={styles.sectionHeader}>
            <h2>Ranking de Gastos</h2>
            <HelpTooltip
              pergunta="1. Deputados ordenados por gasto"
              descricao="A posição do deputado se dá pelo total gasto. É possível filtrar por partido, UF e buscar por nome."
            />
          </div>
          {/* ÁREA DE FILTROS */}
          {!carregandoRanking && (
            <div style={{ marginBottom: "1.5rem", padding: "1rem", backgroundColor: "#f5f5f5", borderRadius: "8px" }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "2rem" }}>
                
                {/* Busca por Nome */}
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>Buscar por Nome:</label>
                  <input
                    type="text"
                    value={buscaNome}
                    onChange={(e) => setBuscaNome(e.target.value)}
                    placeholder="Digite o nome..."
                    style={{ padding: "0.5rem", minWidth: "250px", border: "1px solid #ccc", borderRadius: "4px" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>Filtrar por Partido:</label>
                  <select 
                    onChange={(e) => {
                      const valor = e.target.value;
                      if (valor && !filtroPartidos.includes(valor)) setFiltroPartidos([...filtroPartidos, valor]);
                      e.target.value = ""; 
                    }}
                    style={{ padding: "0.5rem", border: "1px solid #ccc", borderRadius: "4px" }}
                  >
                    <option value="">Adicionar Partido...</option>
                    {partidosUnicos.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.5rem" }}>
                    {filtroPartidos.map(p => (
                      <span key={p} style={{ backgroundColor: "#e0e0e0", padding: "0.2rem 0.6rem", borderRadius: "16px", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        {p} <button onClick={() => setFiltroPartidos(filtroPartidos.filter(item => item !== p))} style={{ cursor: "pointer", border: "none", background: "transparent", fontWeight: "bold" }}>x</button>
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>Filtrar por UF:</label>
                  <select 
                    onChange={(e) => {
                      const valor = e.target.value;
                      if (valor && !filtroUFs.includes(valor)) setFiltroUFs([...filtroUFs, valor]);
                      e.target.value = ""; 
                    }}
                    style={{ padding: "0.5rem", border: "1px solid #ccc", borderRadius: "4px" }}
                  >
                    <option value="">Adicionar UF...</option>
                    {ufsUnicas.map((uf) => <option key={uf} value={uf}>{uf}</option>)}
                  </select>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.5rem" }}>
                    {filtroUFs.map(uf => (
                      <span key={uf} style={{ backgroundColor: "#e0e0e0", padding: "0.2rem 0.6rem", borderRadius: "16px", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        {uf} <button onClick={() => setFiltroUFs(filtroUFs.filter(item => item !== uf))} style={{ cursor: "pointer", border: "none", background: "transparent", fontWeight: "bold" }}>x</button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <p style={{ fontSize: "0.9rem", color: "#666", marginTop: "1rem" }}>
                Exibindo {dadosProcessados.length} de {ranking.length} deputados.
              </p>
            </div>
          )}

          {/* TABELA DE RANKING */}
          {carregandoRanking ? (
            <p>Carregando dados do ranking...</p>
          ) : (
            <table style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th onClick={() => alternarOrdenacao("posicaoOriginal")} style={{ cursor: "pointer", userSelect: "none", borderBottom: "2px solid #ccc", padding: "0.5rem" }}>Posição{renderIconeOrdenacao("posicaoOriginal")}</th>
                  <th onClick={() => alternarOrdenacao("deputado")} style={{ cursor: "pointer", userSelect: "none", borderBottom: "2px solid #ccc", padding: "0.5rem" }}>Deputado{renderIconeOrdenacao("deputado")}</th>
                  <th onClick={() => alternarOrdenacao("partido")} style={{ cursor: "pointer", userSelect: "none", borderBottom: "2px solid #ccc", padding: "0.5rem" }}>Partido{renderIconeOrdenacao("partido")}</th>
                  <th onClick={() => alternarOrdenacao("uf")} style={{ cursor: "pointer", userSelect: "none", borderBottom: "2px solid #ccc", padding: "0.5rem" }}>UF{renderIconeOrdenacao("uf")}</th>
                  <th onClick={() => alternarOrdenacao("total_gasto")} style={{ cursor: "pointer", userSelect: "none", borderBottom: "2px solid #ccc", padding: "0.5rem" }}>Total Gasto{renderIconeOrdenacao("total_gasto")}</th>
                  <th style={{ borderBottom: "2px solid #ccc", padding: "0.5rem" }}>Período</th>
                </tr>
              </thead>
              <tbody>
                {dadosProcessados.map((dep) => (
                  <tr key={dep.deputado_id} onClick={() => selecionarDeputado(dep)} style={{ cursor: "pointer", borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "0.5rem" }}>{dep.posicaoOriginal}</td>
                    <td style={{ padding: "0.5rem" }}>{dep.deputado}</td>
                    <td style={{ padding: "0.5rem" }}>{dep.partido}</td>
                    <td style={{ padding: "0.5rem" }}>{dep.uf}</td>
                    <td style={{ padding: "0.5rem" }}>R$ {Number(dep.total_gasto).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
                    <td style={{ padding: "0.5rem" }}>{dep.ano_minimo} - {dep.ano_maximo}</td>
                  </tr>
                ))}
                {dadosProcessados.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", padding: "1rem" }}>Nenhum deputado encontrado.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* --- ABA: DESPESAS --- */}
      {abaAtiva === "despesas" && (
        <div>
          {!deputadoSelecionado && !carregandoDespesas ? (
            <p>Selecione um deputado no ranking para ver com o que ele gasta.</p>
          ) : (
            <div>
              <div className={styles.sectionHeader}>
                <h2>Despesas de {deputadoSelecionado}</h2>
                <HelpTooltip
                  pergunta="13. Com o que o deputado gasta"
                  descricao="Esta tabela mostra as despesas do deputado selecionado, agrupadas por categoria. O gráfico ao lado apresenta a distribuição das maiores categorias de gasto."
                />
              </div>

              {carregandoDespesas ? (
                <p>Buscando despesas...</p>
              ) : (
                <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", alignItems: "flex-start", marginTop: "1.5rem" }}>
                  
                  {/* TABELA LADO ESQUERDO */}
                  <div style={{ flex: "1 1 500px", overflowX: "auto" }}>
                    <table style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
                      <thead>
                        <tr>
                          <th style={{ borderBottom: "2px solid #ccc", padding: "0.5rem" }}>Categoria</th>
                          <th style={{ borderBottom: "2px solid #ccc", padding: "0.5rem" }}>Valor Total</th>
                          <th style={{ borderBottom: "2px solid #ccc", padding: "0.5rem" }}>Quantidade</th>
                        </tr>
                      </thead>
                      <tbody>
                        {despesas.map((despesa, index) => (
                          <tr key={index} style={{ borderBottom: "1px solid #eee" }}>
                            <td style={{ padding: "0.5rem" }}>{despesa.categoria}</td>
                            <td style={{ padding: "0.5rem" }}>
                              R$ {Number(despesa.valor_total).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                            </td>
                            <td style={{ padding: "0.5rem" }}>{despesa.quantidade}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* GRÁFICO LADO DIREITO */}
                  {despesas.length > 0 && (
                    <div style={{ flex: "1 1 400px", minHeight: "450px", backgroundColor: "#f9f9f9", padding: "1rem", borderRadius: "8px", display: "flex", flexDirection: "column" }}>
                      <h3 style={{ textAlign: "center", marginTop: 0, fontSize: "1.1rem" }}>Distribuição dos Maiores Gastos</h3>
                      
                      <div style={{ width: "100%", height: "400px" }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart margin={{ bottom: 20 }}>
                            <Pie
                              data={dadosGrafico}
                              dataKey="value"
                              nameKey="name"
                              cx="50%"
                              cy="40%"
                              outerRadius={85}
                              fill="#8884d8"
                              label={false}
                            >
                              {dadosGrafico.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={CORES_GRAFICO[index % CORES_GRAFICO.length]} />
                              ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend 
                              layout="horizontal" 
                              verticalAlign="bottom" 
                              align="center"
                              wrapperStyle={{ 
                                fontSize: "11px",
                                paddingTop: "10px",
                                lineHeight: "16px"
                              }} 
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}

                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
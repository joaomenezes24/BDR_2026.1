"use client";

import { useEffect, useState } from "react";
import { deputadosService } from "@/src/services/deputadosService";
import { DeputadoResumo, DeputadoDetalhes } from "@/src/types/deputados";
import WordCloudTemas from "@/src/components/deputados/WordcloudProposicoesTemas";
import styles from "@/src/components/dashboard/dashboard.module.css";
import HelpTooltip from "../HelpToolTip"

// Paleta de cores (Aproveitada para colorir as palavras da nuvem)
const CORES_GRAFICO = [
  "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8",
  "#82ca9d", "#ffc658", "#8dd1e1", "#a4de6c", "#d0ed57",
  "#1f4e79", "#d97706", "#10b981", "#ef4444", "#9467bd"
];

export default function Deputados() {
  const [deputados, setDeputados] = useState<DeputadoResumo[]>([]);
  const [selecionado, setSelecionado] = useState<DeputadoDetalhes | null>(null);
  
  const [dadosProposicoes, setDadosProposicoes] = useState<any | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [loadingPerfil, setLoadingPerfil] = useState(false);

  const [busca, setBusca] = useState("");
  const [filtroPartido, setFiltroPartido] = useState("");
  const [filtroUF, setFiltroUF] = useState("");

  useEffect(() => {
    deputadosService
      .getDeputados()
      .then(setDeputados)
      .finally(() => setLoading(false));
  }, []);

  async function abrirDeputado(deputadoId: number) {
    setLoadingPerfil(true);
    setSelecionado(null);
    setDadosProposicoes(null); 

    try {
      const [dados, proposicoes] = await Promise.all([
        deputadosService.getDeputado(deputadoId),
        deputadosService.getTemasDeputado(deputadoId) 
      ]);
      
      setSelecionado(dados);
      setDadosProposicoes(proposicoes);
    } catch (error) {
      console.error("Erro ao carregar os dados do deputado:", error);
    } finally {
      setLoadingPerfil(false);
    }
  }

  const formatarData = (dataStr: string) => {
    if (!dataStr) return "-";
    const data = new Date(dataStr);
    return data.toLocaleDateString("pt-BR");
  };

  const partidosUnicos = Array.from(new Set(deputados.map(d => d.siglapartido))).sort();
  const ufsUnicas = Array.from(new Set(deputados.map(d => d.siglauf))).sort();

  const deputadosFiltrados = deputados.filter((dep) => {
    const matchNome = dep.nome.toLowerCase().includes(busca.toLowerCase());
    const matchPartido = filtroPartido === "" || dep.siglapartido === filtroPartido;
    const matchUF = filtroUF === "" || dep.siglauf === filtroUF;
    
    return matchNome && matchPartido && matchUF;
  });

  // Funções de configuração da WordCloud
  // Como os valores (1, 2, 5, 7) são pequenos, multiplicamos para gerar um tamanho de pixel legível
  const calcularTamanhoFonteNuvem = (word: any) => 14 + (word.value * 6);
  // Algumas palavras na horizontal, outras na vertical (90 graus)
  const rotacionarPalavra = () => 0;

  if (loading) {
    return <p style={{ padding: "20px", fontFamily: "sans-serif" }}>Carregando deputados...</p>;
  }

  return (
    <div className="deputados-container" style={{ 
      display: "flex", 
      gap: "2rem", 
      padding: "20px", 
      fontFamily: "sans-serif", 
      flexWrap: "wrap",
      alignItems: "flex-start" 
    }}>
      
      {/* SEÇÃO ESQUERDA: LISTA / TABELA */}
      <div className="deputados-lista" style={{ 
        flex: "1 1 550px", 
        display: "flex", 
        flexDirection: "column"
      }}>
        <div className={styles.sectionHeader}>
          <h2> Painel de Deputados </h2>
          <HelpTooltip
            pergunta="Como explorar os dados dos deputados?"
            descricao="Essa seção permite explorar dados específicos de um deputado, dando enfoque aos
            (1)gastos e (4)escolaridade, além de uma (2)nuvem de palavras explicitando o eixo de atuação."
          />
        </div> 

        <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder="Buscar por nome..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            style={{ flex: "1 1 200px", padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
          />
          
          <select 
            value={filtroPartido} 
            onChange={(e) => setFiltroPartido(e.target.value)}
            style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc", minWidth: "120px" }}
          >
            <option value="">Todos os Partidos</option>
            {partidosUnicos.map(partido => (
              <option key={partido} value={partido}>{partido}</option>
            ))}
          </select>

          <select 
            value={filtroUF} 
            onChange={(e) => setFiltroUF(e.target.value)}
            style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc", minWidth: "100px" }}
          >
            <option value="">Todas as UFs</option>
            {ufsUnicas.map(uf => (
              <option key={uf} value={uf}>{uf}</option>
            ))}
          </select>
        </div>

        <div style={{ 
          maxHeight: "600px", 
          overflowY: "auto", 
          border: "1px solid #eaeaea", 
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
        }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead style={{ position: "sticky", top: 0, zIndex: 1, backgroundColor: "#f8f9fa", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
              <tr>
                <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>Nome</th>
                <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>Partido</th>
                <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>UF</th>
              </tr>
            </thead>
            <tbody>
              {deputadosFiltrados.length > 0 ? (
                deputadosFiltrados.map((dep) => (
                  <tr
                    key={dep.deputado_id}
                    onClick={() => abrirDeputado(dep.deputado_id)}
                    className="deputado-row"
                    style={{ cursor: "pointer", borderBottom: "1px solid #eee", transition: "background-color 0.2s" }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#f1f5f9")}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    <td style={{ padding: "12px" }}>{dep.nome}</td>
                    <td style={{ padding: "12px" }}>{dep.siglapartido}</td>
                    <td style={{ padding: "12px" }}>{dep.siglauf}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} style={{ padding: "20px", textAlign: "center", color: "#666" }}>
                    Nenhum deputado encontrado com os filtros selecionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <p style={{ fontSize: "0.85rem", color: "#666", marginTop: "8px" }}>
          Mostrando {deputadosFiltrados.length} deputado(s)
        </p>
      </div>

      {/* SEÇÃO DIREITA: CARD DE PERFIL */}
      <div className="deputado-detalhes" style={{ 
        flex: "1 1 350px", 
        minWidth: "300px",
        position: "sticky", 
        top: "20px"
      }}>
        <div style={{
          backgroundColor: "#fff",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          padding: "24px",
          border: "1px solid #eaeaea",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center"
        }}>
          {!selecionado && !loadingPerfil && (
            <p style={{ color: "#666", margin: "40px 0" }}>Selecione um deputado na lista ao lado para ver os detalhes.</p>
          )}

          {loadingPerfil && (
            <p style={{ color: "#666", margin: "40px 0" }}>Carregando dados do deputado...</p>
          )}

          {selecionado && !loadingPerfil && (
            <>
              <div style={{
                background: "linear-gradient(163deg, rgba(0, 229, 255, 1) 0%, rgba(59, 148, 75, 1) 61%, rgba(255, 255, 10, 1) 100%)",
                padding: "6px",
                borderRadius: "50%",
                display: "inline-block",
                marginBottom: "16px",
                width: "140px",
                height: "140px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.15)"
              }}>
                <img
                  src={selecionado.foto}
                  alt={`Foto de ${selecionado.nome_popular}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "4px solid #ffffff",
                    backgroundColor: "#ffffff"
                  }}
                />
              </div>

              <h2 style={{ margin: "0 0 8px 0", fontSize: "1.5rem", color: "#1f2937" }}>
                {selecionado.nome_popular}
              </h2>
              <span style={{ 
                backgroundColor: "#f3f4f6", 
                color: "#4b5563", 
                padding: "4px 12px", 
                borderRadius: "99px", 
                fontSize: "0.875rem", 
                fontWeight: "bold",
                marginBottom: "20px"
              }}>
                {selecionado.partido} - {selecionado.uf}
              </span>

              <div style={{ 
                width: "100%", 
                textAlign: "left", 
                marginTop: "16px",
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: "12px",
                fontSize: "0.95rem",
                color: "#374151"
              }}>
                <div style={{ paddingBottom: "8px", borderBottom: "1px solid #f3f4f6" }}>
                  <strong style={{ color: "#111827", display: "block", fontSize: "0.8rem", textTransform: "uppercase" }}>Nome Civil</strong>
                  {selecionado.nome_civil}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", paddingBottom: "8px", borderBottom: "1px solid #f3f4f6" }}>
                  <div>
                    <strong style={{ color: "#111827", display: "block", fontSize: "0.8rem", textTransform: "uppercase" }}>Nascimento</strong>
                    {formatarData(selecionado.datanascimento)}
                  </div>
                  <div>
                    <strong style={{ color: "#111827", display: "block", fontSize: "0.8rem", textTransform: "uppercase" }}>Sexo</strong>
                    {selecionado.sexo === "M" ? "Masculino" : selecionado.sexo === "F" ? "Feminino" : selecionado.sexo}
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", paddingBottom: "8px", borderBottom: "1px solid #f3f4f6" }}>
                  <div>
                    <strong style={{ color: "#111827", display: "block", fontSize: "0.8rem", textTransform: "uppercase" }}>Escolaridade</strong>
                    {selecionado.escolaridade}
                  </div>
                  <div>
                    <strong style={{ color: "#111827", display: "block", fontSize: "0.8rem", textTransform: "uppercase" }}>Situação</strong>
                    <span style={{ color: selecionado.situacao === "Exercício" ? "#16a34a" : "#ca8a04", fontWeight: "bold" }}>
                      {selecionado.situacao}
                    </span>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "8px" }}>
                  <div style={{ 
                    backgroundColor: "#f8fafc", 
                    padding: "16px", 
                    borderRadius: "8px", 
                    border: "1px solid #e2e8f0",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center"
                  }}>
                    <strong style={{ color: "#111827", display: "block", fontSize: "0.75rem", textTransform: "uppercase", marginBottom: "4px" }}>Total Gasto</strong>
                    <span style={{ fontSize: "1.1rem", fontWeight: "bold", color: "#dc2626" }}>
                      R$ {selecionado.total_gasto?.toLocaleString("pt-BR", { minimumFractionDigits: 2 }) || "0,00"}
                    </span>
                  </div>

                  <div style={{ 
                    backgroundColor: "#f0fdf4", 
                    padding: "16px", 
                    borderRadius: "8px", 
                    border: "1px solid #bbf7d0",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center"
                  }}>
                    <strong style={{ color: "#111827", display: "block", fontSize: "0.75rem", textTransform: "uppercase", marginBottom: "4px" }}>Proposições</strong>
                    <span style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#16a34a" }}>
                      {dadosProposicoes?.qtd_total_proposicoes || 0}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* SEÇÃO INFERIOR: TEMAS DE ATUAÇÃO (WORDCLOUD MODULARIZADA) */}
      {/* SEÇÃO INFERIOR: TEMAS DE ATUAÇÃO */}
      {selecionado && dadosProposicoes && dadosProposicoes.proposicoes_tema && dadosProposicoes.proposicoes_tema.length > 0 && !loadingPerfil && (
        <div style={{
          width: "100%",
          backgroundColor: "#fff",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          padding: "24px",
          border: "1px solid #eaeaea",
        }}>
          <h3 style={{ 
            margin: "0 0 20px 0", 
            fontSize: "1.2rem", 
            color: "#1f2937", 
            textAlign: "center",
          }}>
            Temas de Atuação do Parlamentar {selecionado.nome_popular}
          </h3>
          
          {/* Chama o componente limpo e sem travas de altura! */}
          <WordCloudTemas data={dadosProposicoes.proposicoes_tema} />
          
        </div>
      )}

    </div>
  );
}
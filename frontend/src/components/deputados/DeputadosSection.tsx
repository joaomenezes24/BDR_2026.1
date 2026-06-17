"use client";

import { useEffect, useState } from "react";
import { deputadosService } from "@/src/services/deputadosService";
import { DeputadoResumo, DeputadoDetalhes } from "@/src/types/deputados";

export default function Deputados() {
  const [deputados, setDeputados] = useState<DeputadoResumo[]>([]);
  const [selecionado, setSelecionado] = useState<DeputadoDetalhes | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingPerfil, setLoadingPerfil] = useState(false);

  // Estados dos filtros
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
    try {
      const dados = await deputadosService.getDeputado(deputadoId);
      setSelecionado(dados);
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
      
      {/* SEÇÃO DA LISTA / TABELA */}
      <div className="deputados-lista" style={{ 
        flex: "1 1 550px", 
        display: "flex", 
        flexDirection: "column"
      }}>
        <h1 style={{ borderBottom: "2px solid #eee", paddingBottom: "10px", marginBottom: "15px", color: "#333" }}>
          Painel de Deputados
        </h1>

        {/* ÁREA DE FILTROS */}
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

        {/* CONTÊINER DA TABELA*/}
        <div style={{ 
          maxHeight: "600px", 
          overflowY: "auto", // Scroll exclusivo da tabela
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

      {/* SEÇÃO DO CARD DE PERFIL */}
      <div className="deputado-detalhes" style={{ 
        flex: "1 1 350px", 
        minWidth: "300px",
        position: "sticky", // Mantém o card fixo se a página inteira rolar
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
            <p style={{ color: "#666", margin: "40px 0" }}>Carregando perfil do deputado...</p>
          )}

          {selecionado && !loadingPerfil && (
            <>
              {/* FOTO COM DEGRADÊ */}
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

              {/* TÍTULO E SUBTÍTULO DO CARD */}
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

              {/* GRID DE INFORMAÇÕES */}
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

                <div style={{ 
                  backgroundColor: "#f8fafc", 
                  padding: "16px", 
                  borderRadius: "8px", 
                  marginTop: "8px",
                  border: "1px solid #e2e8f0" 
                }}>
                  <strong style={{ color: "#111827", display: "block", fontSize: "0.85rem", textTransform: "uppercase" }}>Total Gasto</strong>
                  <span style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#dc2626" }}>
                    R$ {selecionado.total_gasto.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
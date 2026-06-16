"use client";
import React, { useState, useEffect } from 'react';
import GraficoCamaraInterativo from './GraficoCamaraInterativo';

export default function PerfilParlamentar() {
  const [criterio, setCriterio] = useState('siglaPartido');
  const [dadosDeputados, setDadosDeputados] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const resposta = await fetch('/mockdados/deputados_plenario_preciso.json');
        if (!resposta.ok) throw new Error('Erro ao carregar dados');
        const dados = await resposta.json();
        setDadosDeputados(dados);
      } catch (err: unknown) {
        const mensagem = err instanceof Error ? err.message : String(err);
        setErro(mensagem);
      } finally {
        setCarregando(false);
      }
    };

    carregarDados();
  }, []);

  const estiloBotao = (criterioBotao) => ({
    padding: '10px 20px',
    margin: '0 5px',
    borderRadius: '20px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
    backgroundColor: criterio === criterioBotao ? '#b2dfdb' : '#e0f2f1',
    color: '#004d40'
  });

  if (carregando) return <div style={{ padding: '40px' }}>Carregando dados...</div>;
  if (erro) return <div style={{ padding: '40px', color: 'red' }}>Erro: {erro}</div>;
  if (!dadosDeputados) return <div style={{ padding: '40px' }}>Nenhum dado disponível</div>;

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center', textDecoration: 'underline' }}>Perfil do plenário</h1>

      {/* Menu de Filtros */}
      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '40px' }}>
        <button style={estiloBotao('escolaridade')} onClick={() => setCriterio('escolaridade')}>ESCOLARIDADE</button>
        <button style={estiloBotao('sexo')} onClick={() => setCriterio('sexo')}>SEXO</button>
        <button style={estiloBotao('siglapartido')} onClick={() => setCriterio('siglapartido')}>PARTIDO</button>
        <button style={estiloBotao('alinhamento_politico')} onClick={() => setCriterio('alinhamento_politico')}>ESPECTRO POLÍTICO</button>
        {/* <button style={estiloBotao('regiao')} onClick={() => setCriterio('regiao')}>REGIÃO DO BRASIL</button> */}
      </div>

      {/* Renderiza o Gráfico */}
      <GraficoCamaraInterativo deputados={dadosDeputados} criterioAtual={criterio} />
    </div>
  );
}

"use client";
import React, { useState, useEffect } from 'react';
import './PerfilParlamentar.css';
import GraficoCamaraInterativo from './GraficoCamaraInterativo';

export default function PerfilParlamentar() {
  const [criterio, setCriterio] = useState('siglaPartido');
  const [dadosDeputados, setDadosDeputados] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    fetch('/mockdados/deputados_plenario_preciso.json')
      .then(r => r.json())
      .then(setDadosDeputados)
      .finally(() => setCarregando(false));
  }, []);

  const filtros = [
    { id: 'escolaridade', label: 'ESCOLARIDADE' },
    { id: 'sexo', label: 'SEXO' },
    { id: 'siglapartido', label: 'PARTIDO' },
    { id: 'alinhamento_politico', label: 'ESPECTRO POLÍTICO' }
  ];

  if (carregando) return <div className="p-10 text-center">Carregando plenário...</div>;

  return (
    <div className="perfil-container">
      <header className="perfil-header">
        <h1>Raio-X do Plenário</h1>
        <p>Análise demográfica e política dos deputados em exercício</p>
      </header>

      {/* Menu de Filtros */}
      <nav className="filtro-group">
        {filtros.map(f => (
          <button 
            key={f.id}
            className={`btn-filtro ${criterio === f.id ? 'active' : ''}`}
            onClick={() => setCriterio(f.id)}
          >
            {f.label}
          </button>
        ))}
      </nav>

      {/* Renderiza o Gráfico em um Card */}
      <div className="grafico-wrapper">
        <GraficoCamaraInterativo deputados={dadosDeputados} criterioAtual={criterio} />
      </div>
    </div>
  );
}
"use client";
import React, { useState, useEffect } from 'react';
import './PerfilParlamentar.css';
import GraficoCamaraInterativo from './GraficoCamaraInterativo';
import styles from "@/src/components/dashboard/dashboard.module.css";
import HelpTooltip from "../HelpToolTip";

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
      <div className={styles.sectionHeader}>
          <h2>Raio-X do Plenário</h2>
          <HelpTooltip
            pergunta="9. Qual o viés do deputado? direita/ esquerda/ centro"
            descricao="Essa seção é dedicada a demonstrar demograficamente a distribuição da câmara
            por (4)escolaridade, sexo, partido e (9.1)espectro político.  "
          />
      </div>
      <header className="perfil-header">
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
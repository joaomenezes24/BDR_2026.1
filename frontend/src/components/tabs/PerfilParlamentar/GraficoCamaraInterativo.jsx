import React, { useMemo } from 'react';

// Paleta de cores de alto contraste para gerar legendas dinâmicas
const PALETA_CORES = [
  '#1976d2', '#d32f2f', '#388e3c', '#fbc02d', '#8e24aa', '#e65100', 
  '#0097a7', '#c2185b', '#afb42b', '#5d4037', '#455a64', '#0288d1',
  '#7b1fa2', '#f57c00', '#689f38', '#1976d2', '#d32f2f', '#388e3c'
];

const GraficoCamaraInterativo = ({ deputados, criterioAtual }) => {
  
  // 1. Gera as 513 posições matemáticas exatas (executado apenas uma vez)
  const posicoesFixas = useMemo(() => {
    const width = 800, height = 400;
    const cx = width / 2, cy = height - 20;
    const numRows = 11;
    let posicoes = [];
    const rowLengths = [];
    let totalLength = 0;

    for (let i = 0; i < numRows; i++) {
      let r = 120 + i * ((340 - 120) / (numRows - 1));
      let len = Math.PI * r;
      rowLengths.push({ r, len });
      totalLength += len;
    }

    let seatsPerRow = rowLengths.map(row => Math.round(513 * (row.len / totalLength)));
    let currentTotal = seatsPerRow.reduce((a, b) => a + b, 0);
    seatsPerRow[numRows - 1] += (513 - currentTotal); // Ajuste fino

    // Gera as coordenadas brutas
    for (let i = 0; i < numRows; i++) {
      let r = rowLengths[i].r;
      let numSeats = seatsPerRow[i];

      for (let j = 0; j < numSeats; j++) {
        let angle = numSeats > 1 ? Math.PI - (j / (numSeats - 1)) * Math.PI : Math.PI / 2;
        
        posicoes.push({ 
          x: cx + r * Math.cos(angle), 
          y: cy - r * Math.sin(angle),
          angle: angle, 
          r: r         
        });
      }
    }
    posicoes.sort((a, b) => {
      // Diferença mínima para evitar bugs de arredondamento no JavaScript
      if (Math.abs(b.angle - a.angle) > 0.0001) {
        return b.angle - a.angle; 
      }
      return a.r - b.r;
    });

    return posicoes;
  }, []);

  // 2. Mapeia as cores dinamicamente baseadas no critério escolhido
  const legendaCores = useMemo(() => {
    const valoresUnicos = [...new Set(deputados.map(d => d[criterioAtual]))].sort();
    const mapaCores = {};
    
    valoresUnicos.forEach((valor, index) => {
      // Reutiliza a paleta de cores. Se houver mais valores que cores, recicla a paleta.
      mapaCores[valor] = PALETA_CORES[index % PALETA_CORES.length];
    });
    
    return mapaCores;
  }, [deputados, criterioAtual]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* Gráfico SVG */}
      <svg width="800" height="400" viewBox="0 0 800 400" style={{ background: '#fff', borderRadius: '8px' }}>
        {posicoesFixas.map((pos, index) => {
          // O deputado do índice 0 (extrema-esquerda) vai para a primeira bolinha
          const deputado = deputados[index];
          const valorCriterio = deputado ? deputado[criterioAtual] : null;
          const cor = valorCriterio ? legendaCores[valorCriterio] : '#e0e0e0';

          return (
            <circle
              key={index}
              cx={pos.x}
              cy={pos.y}
              r={6}
              fill={cor}
              style={{ transition: 'fill 0.4s ease', stroke: '#fff', strokeWidth: '0.5px' }}
            >
              {deputado && (
                <title>{`${deputado.ultimostatus_nome} (${deputado.siglapartido}-${deputado.siglauf}) \n${criterioAtual.toUpperCase()}: ${valorCriterio}`}</title>
              )}
            </circle>
          );
        })}
      </svg>

      {/* Legenda Dinâmica Gerada Automaticamente */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', maxWidth: '800px', marginTop: '20px', justifyContent: 'center' }}>
        {Object.entries(legendaCores).map(([chave, cor]) => (
          <div key={chave} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '14px', color: '#555' }}>
            <span style={{ width: '12px', height: '12px', backgroundColor: cor, borderRadius: '50%', display: 'inline-block' }}></span>
            {chave}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GraficoCamaraInterativo;
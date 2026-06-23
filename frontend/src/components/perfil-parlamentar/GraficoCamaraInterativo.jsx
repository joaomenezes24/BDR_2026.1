import React, { useMemo, useState } from 'react';

// Paleta de cores de alto contraste para gerar legendas dinâmicas
const PALETA_CORES = [
  '#1976d2', '#d32f2f', '#388e3c', '#fbc02d', '#8e24aa', '#e65100', 
  '#0097a7', '#c2185b', '#afb42b', '#5d4037', '#455a64', '#0288d1',
  '#7b1fa2', '#f57c00', '#689f38', '#1976d2', '#d32f2f', '#388e3c'
];

const GraficoCamaraInterativo = ({ deputados, criterioAtual }) => {
  const [hoverInfo, setHoverInfo] = useState(null);
  
  // Novos Estados para a Busca e Seleção
  const [termoBusca, setTermoBusca] = useState('');
  const [mostrarDropdown, setMostrarDropdown] = useState(false);
  const [deputadoSelecionadoId, setDeputadoSelecionadoId] = useState(null);

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
    seatsPerRow[numRows - 1] += (513 - currentTotal); 

    for (let i = 0; i < numRows; i++) {
      let r = rowLengths[i].r;
      let numSeats = seatsPerRow[i];

      for (let j = 0; j < numSeats; j++) {
        let angle = numSeats > 1 ? Math.PI - (j / (numSeats - 1)) * Math.PI : Math.PI / 2;
        posicoes.push({ x: cx + r * Math.cos(angle), y: cy - r * Math.sin(angle), angle: angle, r: r });
      }
    }
    posicoes.sort((a, b) => {
      if (Math.abs(b.angle - a.angle) > 0.0001) return b.angle - a.angle; 
      return a.r - b.r;
    });

    return posicoes;
  }, []);

  // 2. Mapeia as cores dinamicamente baseadas no critério escolhido
  const legendaCores = useMemo(() => {
    if (criterioAtual === 'votoAtual') {
      return {
        'SIM': '#388e3c', 'NÃO': '#d32f2f', 'ABSTENÇÃO': '#fbc02d', 'Sem informação': '#e0e0e0'
      };
    }

    const valoresUnicos = [...new Set(deputados.map(d => d && d[criterioAtual]))].filter(Boolean).sort();
    const mapaCores = {};
    valoresUnicos.forEach((valor, index) => {
      mapaCores[valor] = PALETA_CORES[index % PALETA_CORES.length];
    });
    return mapaCores;
  }, [deputados, criterioAtual]);

  // 3. Filtra os resultados da barra de busca
  const resultadosBusca = useMemo(() => {
    if (!termoBusca.trim()) return [];
    const termo = termoBusca.toLowerCase();
    
    // Filtra pelo nome civil ou nome eleitoral e retorna no máximo 5 resultados
    return deputados
      .filter(d => d && (
        (d.ultimostatus_nome && d.ultimostatus_nome.toLowerCase().includes(termo)) ||
        (d.nomecivil && d.nomecivil.toLowerCase().includes(termo))
      ))
      .slice(0, 5);
  }, [termoBusca, deputados]);

  // Manipuladores de Seleção
  const handleSelecionarDeputado = (id) => {
    // Se clicar no mesmo que já está selecionado, ele remove a seleção (toggle)
    setDeputadoSelecionadoId(prevId => prevId === id ? null : id);
    setTermoBusca('');
    setMostrarDropdown(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', width: '100%' }}>
      
      {/* BARRA DE BUSCA SUPERIOR */}
      <div style={{ position: 'relative', width: '100%', maxWidth: '400px', marginBottom: '20px', zIndex: 50 }}>
        <div style={{ display: 'flex', width: '100%' }}>
          <input 
            type="text" 
            placeholder="Buscar deputado por nome..." 
            value={termoBusca}
            onChange={(e) => {
              setTermoBusca(e.target.value);
              setMostrarDropdown(true);
            }}
            onFocus={() => setMostrarDropdown(true)}
            style={{ 
              width: '100%', padding: '10px 16px', borderRadius: '8px', 
              border: '2px solid #e5e7eb', outline: 'none', fontSize: '14px', fontFamily: 'sans-serif'
            }}
          />
          {/* Botão de limpar seleção, se houver alguém selecionado */}
          {deputadoSelecionadoId && (
            <button 
              onClick={() => setDeputadoSelecionadoId(null)}
              style={{
                marginLeft: '8px', padding: '0 12px', backgroundColor: '#fef2f2', color: '#ef4444',
                border: '1px solid #fecaca', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'
              }}
              title="Limpar Destaque"
            >
              X
            </button>
          )}
        </div>

        {/* DROPDOWN DE RESULTADOS */}
        {mostrarDropdown && resultadosBusca.length > 0 && (
          <div style={{ 
            position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '4px', 
            backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', 
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)', overflow: 'hidden', fontFamily: 'sans-serif'
          }}>
            {resultadosBusca.map(dep => {
              const idSeguro = String(dep.deputado_id || dep.id);
              return (
                <div 
                  key={idSeguro}
                  onClick={() => handleSelecionarDeputado(idSeguro)}
                  style={{ 
                    padding: '10px 16px', cursor: 'pointer', borderBottom: '1px solid #f3f4f6',
                    display: 'flex', alignItems: 'center', gap: '12px',
                    backgroundColor: deputadoSelecionadoId === idSeguro ? '#f3f4f6' : '#fff'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = deputadoSelecionadoId === idSeguro ? '#f3f4f6' : '#fff'}
                >
                  <img 
                    src={dep.urlfoto} 
                    alt="foto" 
                    style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover' }} 
                  />
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#374151' }}>{dep.ultimostatus_nome}</div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>{dep.siglapartido} - {dep.siglauf}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* GRÁFICO SVG */}
      <svg width="100%" height="auto" viewBox="0 0 800 400" style={{ background: '#fff', borderRadius: '8px', maxWidth: '800px' }}>
        {posicoesFixas.map((pos, index) => {
          const deputado = deputados[index];
          const valorCriterio = deputado ? deputado[criterioAtual] : null;
          const cor = valorCriterio ? legendaCores[valorCriterio] : '#e0e0e0';
          
          const idSeguro = deputado ? String(deputado.deputado_id || deputado.id) : null;
          const isHovered = hoverInfo?.deputado === deputado;
          const isSelected = deputadoSelecionadoId === idSeguro;
          const temAlgumSelecionado = deputadoSelecionadoId !== null;

          // Lógica de visualização do destaque
          // Se houver alguém selecionado e não for esta bolinha, ela fica quase transparente
          const opacity = temAlgumSelecionado && !isSelected ? 0.6 : 1;
          
          // Se estiver selecionado, a bolinha ganha destaque enorme
          const circleRadius = isSelected ? 7 : (isHovered ? 7 : 6);
          const strokeColor = isSelected ? '#4e1e1e' : (isHovered ? '#333' : '#fff'); // A borda usa a cor da bolinha
          const strokeWidth = isSelected ? '2px' : (isHovered ? '2px' : '0.5px');

          return (
            <circle
              key={index}
              cx={pos.x}
              cy={pos.y}
              r={circleRadius}
              fill={cor}
              opacity={opacity}
              style={{ 
                transition: 'all 0.3s ease', 
                stroke: strokeColor, 
                strokeWidth: strokeWidth,
                cursor: deputado ? 'pointer' : 'default' 
              }}
              
              onClick={() => {
                if (deputado) handleSelecionarDeputado(idSeguro);
              }}
              onMouseEnter={(e) => {
                if (deputado) setHoverInfo({ deputado, valor: valorCriterio, x: e.clientX, y: e.clientY });
              }}
              onMouseMove={(e) => {
                if (deputado) setHoverInfo({ deputado, valor: valorCriterio, x: e.clientX, y: e.clientY });
              }}
              onMouseLeave={() => setHoverInfo(null)}
            />
          );
        })}
      </svg>

      {/* CARD FLUTUANTE (TOOLTIP) */}
      {hoverInfo && (
        <div style={{
          position: 'fixed', top: hoverInfo.y + 15, left: hoverInfo.x + 15, 
          backgroundColor: '#ffffff', boxShadow: '0 4px 12px rgba(0,0,0,0.2)', padding: '12px', 
          borderRadius: '8px', border: '1px solid #e5e7eb', zIndex: 9999, pointerEvents: 'none', 
          display: 'flex', gap: '12px', minWidth: '220px', fontFamily: 'sans-serif'
        }}>
          {hoverInfo.deputado.urlfoto ? (
            <img src={hoverInfo.deputado.urlfoto} alt="foto" style={{ width: '56px', height: '74px', borderRadius: '4px', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '56px', height: '74px', backgroundColor: '#e5e7eb', borderRadius: '4px' }}></div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <span style={{ fontSize: '15px', fontWeight: 'bold', color: '#1f2937', marginBottom: '2px' }}>{hoverInfo.deputado.ultimostatus_nome}</span>
            <span style={{ fontSize: '13px', color: '#6b7280', marginBottom: '6px' }}>{hoverInfo.deputado.siglapartido} - {hoverInfo.deputado.siglauf}</span>
            <span style={{ 
              fontSize: '12px', fontWeight: 'bold', color: '#ffffff', 
              backgroundColor: legendaCores[hoverInfo.valor] || '#9ca3af',
              padding: '2px 6px', borderRadius: '4px', display: 'inline-block', alignSelf: 'flex-start'
            }}>
              {criterioAtual === 'votoAtual' ? hoverInfo.valor : `${criterioAtual.toUpperCase()}: ${hoverInfo.valor}`}
            </span>
          </div>
        </div>
      )}

      {/* LEGENDA DINÂMICA */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', maxWidth: '800px', marginTop: '20px', justifyContent: 'center' }}>
        {Object.entries(legendaCores).map(([chave, cor]) => (
          <div key={chave} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '14px', color: '#555', fontFamily: 'sans-serif' }}>
            <span style={{ width: '12px', height: '12px', backgroundColor: cor, borderRadius: '50%', display: 'inline-block' }}></span>
            {chave}
          </div>
        ))}
      </div>
      
    </div>
  );
};

export default GraficoCamaraInterativo;
import React from 'react';
import './ResumoVotacao.css';

interface ResumoVotacaoProps {
  totalSim: number;
  totalNao: number;
}

export default function ResumoVotacao({ totalSim, totalNao }: ResumoVotacaoProps) {
  const totalValidos = totalSim + totalNao;
  
  // Evita divisão por zero caso a votação esteja vazia
  const percentSim = totalValidos > 0 ? ((totalSim / totalValidos) * 100).toFixed(1) : '0.0';
  const percentNao = totalValidos > 0 ? ((totalNao / totalValidos) * 100).toFixed(1) : '0.0';

  // Se não houver votos registrados ainda, não renderiza o bloco
  if (totalValidos === 0) return null;

  return (
    <div className="resumo-container">
      <div className="resumo-header">
        <h2 className="resumo-titulo">Resultado da Votação</h2>
        {/* Você pode adicionar a lógica de APROVADA/REJEITADA depois se a API fornecer */}
      </div>

      <div className="resumo-cards">
        <div className="card-voto card-sim">
          <div className="card-icone">👍</div>
          <p className="card-numero">{totalSim}</p>
          <p className="card-texto">Votos SIM</p>
        </div>

        <div className="card-voto card-nao">
          <div className="card-icone">👎</div>
          <p className="card-numero">{totalNao}</p>
          <p className="card-texto">Votos NÃO</p>
        </div>
      </div>

      <div className="barra-wrapper">
        <div className="barra-labels">
          <span className="label-sim">SIM - {percentSim}%</span>
          <span className="label-nao">NÃO - {percentNao}%</span>
        </div>
        
        <div className="barra-track">
          <div 
            className="barra-fill-sim" 
            style={{ width: `${percentSim}%` }}
          >
            {Number(percentSim) > 5 && `${percentSim}%`}
          </div>
          
          <div 
            className="barra-fill-nao" 
            style={{ width: `${percentNao}%` }}
          >
            {Number(percentNao) > 5 && `${percentNao}%`}
          </div>
        </div>
      </div>
    </div>
  );
}
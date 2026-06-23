import React from 'react';
import { ProposicaoResponse, ProposicaoVotosResponse } from '@/src/types/proposicoes';

export default function ProposicaoDetalhes({ proposicao }: { proposicao: ProposicaoResponse }) {
  return (
    <div className="quadro-grosso card-proposicao">
      
      <div className="box-pilula titulo-prop">
        {proposicao.siglaTipo} {proposicao.numero}/{proposicao.ano}
      </div>

      <div className="box-pilula ementa-prop">
        {proposicao.ementa}
      </div>

      {/* <div className="box-pilula">
        ID: {proposicao.proposicao_id}
      </div> */}

      {proposicao.link ? (
        <a 
          href={proposicao.link} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="box-pilula link-prop"
        >
          Leia a proposição completa
        </a>
      ) : (
        <span style={{color: '#9ca3af', fontSize: '14px'}}>Sem link disponível</span>
      )}
      
    </div>
  );
}
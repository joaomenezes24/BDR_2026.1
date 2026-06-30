import React from 'react';
import { DeputadoVoto } from '@/src/types/proposicoes';

interface VotosQuadroProps {
  titulo: string;
  listaVotos: DeputadoVoto[];
}

export default function VotosQuadro({
  titulo,
  listaVotos,
}: VotosQuadroProps) {
  return (
    <div className="quadro-grosso">

      <div style={{ display: 'flex' }}>
        <div className="box-pilula" style={{ fontWeight: 'bold' }}>
          {titulo}
        </div>
      </div>

      <div className="lista-votos">
        {listaVotos.length > 0 ? (
          listaVotos.map((voto, index) => (
            <div key={index} className="box-pilula">
              {voto.nome} {voto.partido ? `(${voto.partido}-${voto.uf})` : ''}
            </div>
          ))
        ) : (
          <div style={{ color: '#9ca3af', fontStyle: 'italic', padding: '8px' }}>
            Nenhum voto registrado.
          </div>
        )}
      </div>

    </div>
  );
}
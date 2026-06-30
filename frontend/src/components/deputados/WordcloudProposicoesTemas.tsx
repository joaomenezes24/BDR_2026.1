import React from 'react';  
import { TagCloud } from 'react-tagcloud';

interface TemaData {
  text: string;
  value: number;
}

interface WordCloudTemasProps {
  data: TemaData[];
}

const CORES_NUVEM = [
  "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8",
  "#82ca9d", "#ffc658", "#8dd1e1", "#a4de6c", "#d0ed57",
  "#1f4e79", "#d97706", "#10b981", "#ef4444", "#9467bd"
];

export default function WordCloudTemas({ data }: WordCloudTemasProps) {
  if (!data || data.length === 0) {
    return <p style={{ textAlign: "center", color: "#999" }}>Nenhum tema encontrado.</p>;
  }

  const dadosFormatados = data.map(item => ({
    value: item.text,
    count: Number(item.value)
  }));

  const customRenderer = (tag: any, size: number, color: string) => {
    const indiceCor = tag.count % CORES_NUVEM.length;
    
    return (
      <span
        key={tag.value}
        className="nuvem-palavra"
        data-tooltip={`Proposições: ${tag.count}`} // <-- Passamos a informação para o CSS aqui
        style={{
          fontSize: `${size}px`,
          color: CORES_NUVEM[indiceCor],
          margin: '8px 14px',
          fontWeight: 'bold',
          display: 'inline-block',
          cursor: 'pointer' // Mudamos para a "mãozinha" indicando interatividade
        }}
      >
        {tag.value}
      </span>
    );
  };

  return (
    <div style={{ width: '100%', textAlign: 'center', padding: '10px' }}>
      
      <style>{`
        .nuvem-palavra {
          position: relative;
          transition: transform 0.2s ease-in-out;
        }

        /* Efeito de aumento no hover */
        .nuvem-palavra:hover {
          transform: scale(1.1);
          z-index: 10; /* Garante que a palavra focada fique por cima das outras */
        }

        /* O balãozinho do Tooltip */
        .nuvem-palavra::after {
          content: attr(data-tooltip);
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%) translateY(-8px);
          background-color: #1f2937; /* Cor escura elegante */
          color: #ffffff;
          font-size: 13px; /* Tamanho fixo, ignorando a fonte gigante da palavra */
          font-weight: 500;
          font-family: sans-serif;
          padding: 6px 12px;
          border-radius: 6px;
          white-space: nowrap;
          opacity: 0;
          visibility: hidden;
          transition: all 0.2s ease-in-out;
          pointer-events: none;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }

        /* A setinha do balãozinho apontando para baixo */
        .nuvem-palavra::before {
          content: '';
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%) translateY(2px);
          border-width: 6px;
          border-style: solid;
          border-color: #1f2937 transparent transparent transparent;
          opacity: 0;
          visibility: hidden;
          transition: all 0.2s ease-in-out;
          pointer-events: none;
        }

        /* Mostra o Tooltip e a Setinha quando passar o mouse */
        .nuvem-palavra:hover::after,
        .nuvem-palavra:hover::before {
          opacity: 1;
          visibility: visible;
          transform: translateX(-50%) translateY(0); /* Efeito suave subindo */
        }
      `}</style>

      <TagCloud
        minSize={14}
        maxSize={42}
        tags={dadosFormatados}
        renderer={customRenderer}
      />
    </div>
  );
}
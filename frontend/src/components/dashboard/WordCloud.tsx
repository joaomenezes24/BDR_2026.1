"use client";

import { useEffect, useState } from "react";
import { TagCloud } from "react-tagcloud";
import HelpTooltip from "../HelpToolTip";
import styles from "./dashboard.module.css";

import { analyticsService } from "@/src/services/analyticsService";

const CORES_NUVEM = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#8dd1e1",
  "#a4de6c",
  "#d0ed57",
  "#1f4e79",
  "#d97706",
  "#10b981",
  "#ef4444",
  "#9467bd"
];

interface Palavra {
  text: string;
  value: number;
}

export default function WordCloud() {

  const [words, setWords] = useState<Palavra[]>([]);

  useEffect(() => {

    analyticsService
      .getWordCloud()
      .then(setWords);

  }, []);

  if (words.length === 0) {
    return <p style={{ textAlign: "center" }}>Carregando...</p>;
  }

  const tags = words.map(item => ({
    value: item.text,
    count: Number(item.value)
  }));

  const customRenderer = (tag: any, size: number) => {

    const indiceCor =
      tag.count % CORES_NUVEM.length;

    return (

      <span
        key={tag.value}
        className="nuvem-palavra"
        data-tooltip={`Ocorrências: ${tag.count}`}
        style={{
          fontSize: `${size}px`,
          color: CORES_NUVEM[indiceCor],
          margin: "8px 14px",
          fontWeight: "bold",
          display: "inline-block",
          cursor: "pointer"
        }}
      >
        {tag.value}
      </span>

    );

  };

  return (

    <>
      <div className={styles.sectionHeader}>
        <h2>Nuvem Geral de Palavras</h2>
        <HelpTooltip
            pergunta="2. Agrupar deputados por eixo de atuação"
            descricao="Eixo social, econômica, tributária, segurança, etc. A nuvem de palavras apresenta uma concepção geral da ocorrência de temas. Essa é uma resposta geral, na aba deputados essa pergunta foi respondida para cada deputado"
        />
      </div>

      <style>{`

        .nuvem-palavra{
          position:relative;
          transition:.2s;
        }

        .nuvem-palavra:hover{
          transform:scale(1.1);
          z-index:10;
        }

        .nuvem-palavra::after{

          content:attr(data-tooltip);

          position:absolute;

          bottom:100%;
          left:50%;

          transform:translateX(-50%) translateY(-8px);

          background:#1f2937;
          color:white;

          padding:6px 12px;

          border-radius:6px;

          font-size:13px;
          font-family:sans-serif;
          font-weight:500;

          white-space:nowrap;

          opacity:0;
          visibility:hidden;

          transition:.2s;

          pointer-events:none;

          box-shadow:0 4px 6px rgba(0,0,0,.15);

        }

        .nuvem-palavra::before{

          content:"";

          position:absolute;

          bottom:100%;
          left:50%;

          transform:translateX(-50%) translateY(2px);

          border-width:6px;
          border-style:solid;
          border-color:#1f2937 transparent transparent transparent;

          opacity:0;
          visibility:hidden;

          transition:.2s;

          pointer-events:none;

        }

        .nuvem-palavra:hover::after,
        .nuvem-palavra:hover::before{

          opacity:1;
          visibility:visible;

          transform:translateX(-50%) translateY(0);

        }

      `}</style>

      <div
        style={{
          width: "100%",
          textAlign: "center",
          padding: "10px"
        }}
      >

        <TagCloud
          minSize={14}
          maxSize={42}
          tags={tags}
          renderer={customRenderer}
        />

      </div>

    </>

  );

}
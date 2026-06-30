"use client";

import { useState, useRef, useEffect } from "react";

interface HelpTooltipProps {
  pergunta: string;
  descricao: string;
}

export default function HelpTooltip({ pergunta, descricao }: HelpTooltipProps) {
  const [aberto, setAberto] = useState(false);
  const [popupStyle, setPopupStyle] = useState<React.CSSProperties>({});
  const [isToque, setIsToque] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const calcularPosicao = () => {
    if (!buttonRef.current) return;

    const btn = buttonRef.current.getBoundingClientRect();
    const popupWidth = 320;
    const popupHeight = popupRef.current?.offsetHeight ?? 200;
    const margin = 8;

    let top = btn.bottom + margin;
    let left = btn.right - popupWidth;

    if (left < margin) left = margin;
    if (left + popupWidth > window.innerWidth - margin)
      left = window.innerWidth - popupWidth - margin;
    if (top + popupHeight > window.innerHeight - margin)
      top = btn.top - popupHeight - margin;

    setPopupStyle({ top: `${top}px`, left: `${left}px` });
  };

  useEffect(() => {
    if (aberto) calcularPosicao();
  }, [aberto]);

  // Fecha ao clicar fora (modo toque)
  useEffect(() => {
    if (!aberto || !isToque) return;
    const handler = (e: MouseEvent) => {
      if (
        !buttonRef.current?.contains(e.target as Node) &&
        !popupRef.current?.contains(e.target as Node)
      ) {
        setAberto(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [aberto, isToque]);

  const handleTouchStart = () => {
    setIsToque(true);
  };

  const handleClick = () => {
    if (isToque) setAberto((prev) => !prev);
  };

  const handleMouseEnter = () => {
    if (!isToque) setAberto(true);
  };

  const handleMouseLeave = () => {
    if (!isToque) setAberto(false);
  };

  return (
    <div
      className="help-tooltip"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        ref={buttonRef}
        className="help-button"
        onTouchStart={handleTouchStart}
        onClick={handleClick}
        aria-label="Ajuda"
      >
        ?
      </button>

      {aberto && (
        <div ref={popupRef} className="help-popup" style={popupStyle}>
          <strong>Pergunta respondida</strong>
          <p>{pergunta}</p>
          <strong>Objetivo</strong>
          <p>{descricao}</p>
        </div>
      )}
    </div>
  );
}
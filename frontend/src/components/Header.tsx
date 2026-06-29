interface HeaderProps {
  isExpanded: boolean;
  onToggle: () => void;
}

export default function Header({ isExpanded, onToggle }: HeaderProps) {
  return (
    <header className={`header ${isExpanded ? "expanded" : "compact"}`}>
      <button className="header-toggle" onClick={onToggle}>
        {isExpanded ? "✖" : "⤡"}
      </button>

      <div className="header-content">
        <img
          src="/logo.png"
          alt="Logo Proeza"
          className="header-logo"
        />

        <div className="header-text">
          <h1>Proeza: de Olho na Câmara</h1>
          <h2> Uma solução em Banco de Dados Relacionais</h2>

          {isExpanded && (
            <>
              <p>
                Plataforma dedicada à análise de dados públicos da Câmara dos
                Deputados no período de janeiro de 2023 a junho de 2026,
                oferecendo indicadores, rankings e visualizações interativas para
                promover transparência e facilitar a exploração das informações
                legislativas.
              </p>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
interface HeaderProps {
  isExpanded: boolean;
  onToggle: () => void;
}

export default function Header({ isExpanded, onToggle }: HeaderProps) {
  return (
    <header className={`header ${isExpanded ? "expanded" : "compact"}`}>
      <button className="header-toggle" onClick={onToggle}>
        {isExpanded ? "▲" : "▼"}
      </button>

      <div className="header-content">
        <img
          src="/logo.png"
          alt="Logo Proeza"
          className="header-logo"
        />

        <div className="header-text">
          <h2>Proeza: de Olho na Câmara</h2>

          {isExpanded && (
            <>
              <h2>Uma solução em Banco de Dados Relacionais</h2>

              <p>
                Plataforma dedicada à análise de dados públicos da Câmara dos
                Deputados, oferecendo indicadores, rankings e visualizações
                interativas para promover transparência e facilitar a exploração
                das informações legislativas.
              </p>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
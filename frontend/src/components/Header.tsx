export default function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <img
          src="/Dogma.png"
          alt="Logo Dogma"
          className="header-logo"
        />

        <div className="header-text">
          <h1>Dogma</h1>

          <h2>Deputados Ordenados por Gastos - Metric Analytics</h2>

          <p>
            Plataforma dedicada à análise de dados públicos da Câmara dos
            Deputados, oferecendo indicadores, rankings e visualizações
            interativas para promover transparência e facilitar a exploração
            das informações legislativas.
          </p>
        </div>
      </div>
    </header>
  );
}
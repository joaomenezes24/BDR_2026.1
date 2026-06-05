export default function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <img
          src="/logo.png"
          alt="Logo Proeza"
          className="header-logo"
        />

        <div className="header-text">
          <h1>Proeza</h1>

          <h2>Uma solução em Banco de Dados Relacionais</h2>

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
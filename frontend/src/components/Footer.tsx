export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">

        <div className="footer-section">
          <img src="/Proeza.png" alt="Logo Proeza" className="footer-logo" />
          <p> Deputados Ordenados por Gastos - Metric Analytics</p>
          <p> Um projeto acadêmico desenvolvido por Proeza Soluções</p>
        </div>

        <div className="footer-section">
          <h4>Tecnologias</h4>
          <ul>
            <li>Next.js</li>
            <li>FastAPI</li>
            <li>SQLite</li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Projeto Acadêmico</h4>
          <p> Desenvolvido para a disciplina de Banco de Dados Relacionais. </p>
          <p> Universidade Federal do Piauí - UFPI </p>
        </div>
      </div>

      <div className="footer-bottom">
        © 2026 Proeza - Todos os direitos reservados.
      </div>
    </footer>
  );
}
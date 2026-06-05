export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">

        <div className="footer-section">
          <h3>Proeza</h3>

          <p>
            Plataforma para análise e visualização de dados públicos da
            Câmara dos Deputados.
          </p>
        </div>

        <div className="footer-section">
          <h4>Tecnologias</h4>

          <ul>
            <li>Next.js</li>
            <li>FastAPI</li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Projeto Acadêmico</h4>

          <p>
            Desenvolvido para a disciplina de Banco de Dados Relacionais.
          </p>

          <p>
            Universidade Federal do Piauí - UFPI
          </p>
        </div>

      </div>

      <div className="footer-bottom">
        © 2026 Proeza - Todos os direitos reservados.
      </div>
    </footer>
  );
}
import styles from "./dashboard.module.css";
import OverviewCards from "./OverviewCards";
import WordCloud from "./WordCloud";
import TemasTable from "./TemasTable";
import EscolaridadeTable from "./EscolaridadeTable";
import EscolaridadeEventosChart from "./EscolaridadeEventosChart";
import EscolaridadeFidelidadeChart from "./EscolaridadeFidelidadeChart";
import EscolaridadeProposicoesChart from "./EscolaridadeProposicoesChart";
import HelpTooltip from "../HelpToolTip";

export default function Dashboard() {
  return (
    <div className={styles.dashboard}>
      <div className={styles.sectionHeader}>
        <h1>Dashboard Parlamentar</h1>
        <HelpTooltip
          pergunta="Quais os principais insights obtidos?"
          descricao="Análise gerada a partir de dados públicos da câmara dos deputados, no período de janeiro de 2023 a junho de 2026."
          />
      </div>

      <OverviewCards />

      <WordCloud />

      <div className={styles.twoColumnLayout}>
        <TemasTable />
        <EscolaridadeTable />
      </div>

      <div className={styles.sectionHeader}>
        <h1>Gráficos por Escolaridade</h1>
        <HelpTooltip
         pergunta="6. Correlacionar escolaridade com diferentes atributos"
         descricao="Os gráficos a seguir correlacionam escolaridade com (b)fidelidade partidária,
         (c)número de proposições e (d)presença em eventos."
        />
      </div>

      <div className={styles.dashboard}>
        <h2>Fidelidade Partidaria por Escolaridade</h2>
        <EscolaridadeFidelidadeChart />
      </div>

      <div className={styles.dashboard}>
        <h2>Autoria de Proposições por Escolaridade</h2>
        <EscolaridadeProposicoesChart />
      </div>

      <div className={styles.dashboard}>
        <h2>Presença em eventos por escolaridade</h2>
        <EscolaridadeEventosChart />
      </div>
    </div>
  );
}
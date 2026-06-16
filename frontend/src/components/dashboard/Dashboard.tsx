import styles from "./dashboard.module.css";
import OverviewCards from "./OverviewCards";
import WordCloud from "./WordCloud";
import TemasTable from "./TemasTable";
import EscolaridadeTable from "./EscolaridadeTable";

export default function Dashboard() {
  return (
    <div className={styles.dashboard}>
      <h1>Dashboard Parlamentar</h1>

      <OverviewCards />

      <WordCloud />

      <div className={styles.twoColumnLayout}>
        <TemasTable />
        <EscolaridadeTable />
      </div>
    </div>
  );
}
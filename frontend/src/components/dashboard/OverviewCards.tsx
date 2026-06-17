"use client";

import { useEffect, useState } from "react";
import styles from "./dashboard.module.css";
import { analyticsService } from "@/src/services/analyticsService";

export default function OverviewCards() {
  const [overview, setOverview] = useState<any>(null);

  useEffect(() => {
    analyticsService.getOverview().then(setOverview);
  }, []);

  if (!overview)
    return <p>Carregando...</p>;

  return (
    <div className={styles.overview}>
      <div className={styles.overviewCard}>
        <h3>Deputados</h3>
        <div className={styles.value}>{overview.total_deputados}</div>
        <div className={styles.description}>Total na câmara</div>
      </div>

      <div className={styles.overviewCard}>
        <h3>Despesas</h3>
        <div className={styles.value}>
          {typeof overview.total_despesas === "number"
            ? `${(overview.total_despesas / 1000000).toFixed(0)}M`
            : overview.total_despesas}
        </div>
        <div className={styles.description}>Em despesas registradas</div>
      </div>

      <div className={styles.overviewCard}>
        <h3>Proposições</h3>
        <div className={styles.value}>{overview.total_proposicoes}</div>
        <div className={styles.description}>Propostas realizadas</div>
      </div>

      <div className={styles.overviewCard}>
        <h3>Votações</h3>
        <div className={styles.value}>{overview.total_votacoes}</div>
        <div className={styles.description}>Votações registradas</div>
      </div>
    </div>
  );
}
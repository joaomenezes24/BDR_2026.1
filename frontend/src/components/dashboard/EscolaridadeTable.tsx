"use client";

import { useEffect, useState } from "react";
import styles from "./dashboard.module.css";
import { analyticsService } from "@/src/services/analyticsService";
import HelpTooltip from "../HelpToolTip";

export default function EscolaridadeTable() {
  const [dados, setDados] = useState<any[]>([]);

  useEffect(() => {
    analyticsService.getEscolaridade().then(setDados);
  }, []);

  return (
    <div className={styles.tableSection}>
      <div className={styles.sectionHeader}>
        <h2>Escolaridade dos Deputados</h2>
        <HelpTooltip
          pergunta="4. Agrupar deputados por escolaridade"
          descricao="Esta tabela apresenta a distribuição geral dos deputados pelo nível de escolaridade."
        />
      </div>

      <div className={styles.tableContainer}>
        <table>
          <thead>
            <tr>
              <th>Escolaridade</th>
              <th>Quantidade</th>
            </tr>
          </thead>

          <tbody>
            {dados.map((item) => (
              <tr key={item.escolaridade}>
                <td>{item.escolaridade}</td>
                <td>{item.qtd_total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
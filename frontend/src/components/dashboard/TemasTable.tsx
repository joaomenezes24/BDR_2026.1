"use client";

import { useEffect, useState } from "react";
import styles from "./dashboard.module.css";
import { analyticsService } from "@/src/services/analyticsService";

export default function TemasTable() {
  const [temas, setTemas] = useState<any[]>([]);

  useEffect(() => {
    analyticsService.getTemas().then(setTemas);
  }, []);

  return (
    <div className={styles.tableSection}>
      <div className={styles.sectionHeader}>
        <h2>Temas Principais</h2>
      </div>

      <div className={styles.tableContainer}>
        <table>
          <thead>
            <tr>
              <th>Tema</th>
              <th>Quantidade</th>
            </tr>
          </thead>

          <tbody>
            {temas.map((tema) => (
              <tr key={tema.tema}>
                <td>{tema.tema}</td>
                <td>{tema.qtd_total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
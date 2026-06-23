"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import styles from "./dashboard.module.css";
import { analyticsService } from "@/src/services/analyticsService";

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload || !payload.length) return null;

  const { media_presencas, total_deputados } = payload[0].payload;

  return (
    <div className={styles.tooltip}>
      <p><strong>{label}</strong></p>
      <p>Média de presenças: {media_presencas}</p>
      <p>Total de deputados: {total_deputados}</p>
    </div>
  );
}

export default function EscolaridadeEventosChart() {
  const [dados, setDados] = useState<any[]>([]);

  useEffect(() => {
    analyticsService.getEscolaridadeEventos().then(setDados);
  }, []);

  return (
    <div className={styles.tableSection}>
      <div className={styles.sectionHeader}>
      </div>

      <div className={styles.tableContainer}>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={dados}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="escolaridade" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="media_presencas" fill="#4f81bd" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

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

  const { media_gasto, quantidade_deputados } = payload[0].payload;

  const gastoFormatado = media_gasto.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return (
    <div className={styles.tooltip}>
      <p><strong>{label}</strong></p>
      <p>Média de gasto: {gastoFormatado}</p>
      <p>Quantidade de deputados: {quantidade_deputados}</p>
    </div>
  );
}

export default function EscolaridadeGastoChart() {
  const [dados, setDados] = useState<any[]>([]);

  useEffect(() => {
    analyticsService.getEscolaridadeGasto().then(setDados);
  }, []);

  return (
    <div className={styles.tableSection}>
      <div className={styles.sectionHeader}>
        <h2>Média de Gastos por Escolaridade</h2>
      </div>

      <div className={styles.tableContainer}>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={dados}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="escolaridade" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="media_gasto" fill="#4f81bd" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

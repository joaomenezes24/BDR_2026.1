"use client";

import { useEffect, useState } from "react";

import {
  analyticsService
} from "@/src/services/analyticsService";

export default function OverviewCards() {

  const [overview, setOverview] =
    useState<any>(null);

  useEffect(() => {

    analyticsService
      .getOverview()
      .then(setOverview);

  }, []);

  if (!overview)
    return <p>Carregando...</p>;

  return (

    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(4,1fr)",
        gap: "1rem"
      }}
    >

      <div>
        <h3>Deputados</h3>
        <p>{overview.total_deputados}</p>
      </div>

      <div>
        <h3>Despesas</h3>
        <p>{overview.total_despesas}</p>
      </div>

      <div>
        <h3>Proposições</h3>
        <p>{overview.total_proposicoes}</p>
      </div>

      <div>
        <h3>Votações</h3>
        <p>{overview.total_votacoes}</p>
      </div>

    </div>
  );
}
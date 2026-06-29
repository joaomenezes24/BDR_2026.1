import { apiFetch } from "../services/api";

import {
  Overview,
  Tema,
  Escolaridade,
  WordCloudItem,
  EscolaridadeEventos,
  EscolaridadeFidelidade,
  EscolaridadeProposicoes,
  EscolaridadeGastos
} from "../types/analytics";

export const analyticsService = {

  getOverview() {
    return apiFetch<Overview>(
      "/analytics/overview"
    );
  },

  getWordCloud() {
    return apiFetch<WordCloudItem[]>(
      "/analytics/wordcloud"
    );
  },

  getTemas() {
    return apiFetch<Tema[]>(
      "/analytics/temas"
    );
  },

  getEscolaridade() {
    return apiFetch<Escolaridade[]>(
      "/analytics/escolaridade"
    );
  },

  getEscolaridadeEventos() {
    return apiFetch<EscolaridadeEventos[]>(
      "/analytics/escolaridade-eventos"
    );
  },

  getEscolaridadeFidelidade() {
    return apiFetch<EscolaridadeFidelidade[]>(
      "/analytics/escolaridade-fidelidade"
    )
  },

  getEscolaridadeProposicoes() {
    return apiFetch<EscolaridadeProposicoes[]>(
      "/analytics/escolaridade-proposicoes"
    )
  },

  getEscolaridadeGasto() {
    return apiFetch<EscolaridadeGastos[]>(
      "/analytics/escolaridade-gastos"
    )
  }
};


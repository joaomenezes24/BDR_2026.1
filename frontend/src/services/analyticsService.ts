import { apiFetch } from "../services/api";

import {
  Overview,
  Tema,
  Escolaridade,
  WordCloudItem
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
  }
};
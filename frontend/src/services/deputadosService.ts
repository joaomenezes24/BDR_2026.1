import { apiFetch } from "./api";

import {
  DeputadoResumo,
  DeputadoDetalhes
} from "@/src/types/deputados";

export const deputadosService = {

  getDeputados() {
    return apiFetch<DeputadoResumo[]>(
      "/deputados"
    );
  },

  getDeputado(
    deputadoId: number
  ) {
    return apiFetch<DeputadoDetalhes>(
      `/deputados/${deputadoId}`
    );
  }

};
import { apiFetch } from "./api";

import {
  RankingGastos,
  DespesaDeputado
} from "@/src/types/gastos";

export const gastosService = {

  getRanking() {
    return apiFetch<RankingGastos[]>(
      "/gastos/ranking"
    );
  },

  getDespesasDeputado(
    deputadoId: number
  ) {
    return apiFetch<DespesaDeputado[]>(
      `/deputados/${deputadoId}/despesas`
    );
  }
};
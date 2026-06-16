export interface RankingGastos {
  deputado_id: number;
  deputado: string;
  partido: string;
  uf: string;
  total_gasto: number;
}

export interface DespesaDeputado {
  categoria: string;
  valor_total: number;
  quantidade: number;
}
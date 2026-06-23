export interface Overview {
  total_deputados: number;
  total_despesas: number;
  total_proposicoes: number;
  total_votacoes: number;
}

export interface WordCloudItem {
  text: string;
  value: number;
}

export interface Tema {
  tema: string;
  qtd_total: number;
  ano_minimo?: number;
  ano_maximo?: number;
}

export interface Escolaridade {
  escolaridade: string;
  qtd_total: number;
}

export interface EscolaridadeEventos {
  escolaridade: string;
  quantidade_deputados: number;
  media_presenca: number;
}


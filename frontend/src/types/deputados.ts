export interface DeputadoResumo {
  deputado_id: number;
  nome: string;
  siglapartido: string;
  siglauf: string;
  sexo: string;
}

export interface DeputadoDetalhes {
  deputado_id: number;
  nome: string;
  partido: string;
  uf: string;
  sexo: string;
  escolaridade: string;
  situacao: string;
  total_gasto: number;
}
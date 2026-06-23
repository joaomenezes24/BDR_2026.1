export interface DeputadoVoto {
  deputado_id: number;
  nome: string;
  partido: string;
  uf: string;
}

export interface ProposicaoResponse {
  siglaTipo: string;
  numero: number;
  ano: number;
  ementa: string;
  link: string | null;
  proposicao_id: number;
  proposicao_uri: string;
}

export interface ProposicaoVotosResponse {
  votos_sim: DeputadoVoto[];
  votos_nao: DeputadoVoto[];
  votos_outros: DeputadoVoto[];
}
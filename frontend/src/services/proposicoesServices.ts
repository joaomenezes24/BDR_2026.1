import { apiFetch } from "./api";

import { ProposicaoResponse, ProposicaoVotosResponse, DeputadoVoto } from '@/src/types/proposicoes';


export const ProposicoesService = {

  getProposicoesPorTema(tema: string, offset: number) {
    return apiFetch<ProposicaoResponse[]>(`/proposicoes/tema/${tema}?limit=1&offset=${offset}`);
  },

  getVotos(proposicaoId: number) {
    return apiFetch<ProposicaoVotosResponse>(`/proposicoes/votos/${proposicaoId}`);
  }
};


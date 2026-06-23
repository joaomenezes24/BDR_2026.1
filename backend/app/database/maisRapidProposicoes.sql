-- SQLite
-- Acelera a filtragem pelo Eixo (Saúde, Educação) e o JOIN com a tabela de Votações
CREATE INDEX idx_temas_tema_uri ON ProposicoesTemas (tema, uriproposicao);

-- Acelera a verificação do EXISTS (Impede que o banco leia todos os votos do histórico)
CREATE INDEX idx_votos_idvotacao ON VotacoesVotos (idvotacao);

-- Acelera a ponte entre as proposições e as votações
CREATE INDEX idx_vp_uri_idvotacao ON VotacoesProposicoes (proposicao_uri, idvotacao);
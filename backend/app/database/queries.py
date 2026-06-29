OVERVIEW_QUERY = """
SELECT
    (SELECT COUNT(*) FROM Deputados) AS total_deputados,
    (SELECT COALESCE(ROUND(SUM(vlrliquido), 0), 0) FROM Despesas) AS total_despesas,
    (SELECT COUNT(*) FROM Proposicoes) AS total_proposicoes,
    (SELECT COUNT(*) FROM Votacoes) AS total_votacoes
"""

TEMAS_QUERY = """
SELECT
    tema,
    COUNT(*) AS qtd_total,
    MIN(ano) AS ano_minimo,
    MAX(ano) AS ano_maximo
FROM ProposicoesTemas
GROUP BY tema
ORDER BY qtd_total DESC
"""

PARTIDOS_QUERY = """
SELECT
    siglapartido AS partido,
    COUNT(*) AS qtd_total
FROM Deputados
GROUP BY siglapartido
ORDER BY partido
"""

ESCOLARIDADE_QUERY = """
SELECT
    COALESCE(escolaridade, 'Não Informado') AS escolaridade,
    COUNT(*) AS qtd_total
FROM Deputados
GROUP BY escolaridade
ORDER BY
    CASE COALESCE(escolaridade, 'Não Informado')
        WHEN 'Primário Incompleto' THEN 1
        WHEN 'Ensino Fundamental' THEN 2
        WHEN 'Ensino Médio Incompleto' THEN 3
        WHEN 'Ensino Médio' THEN 4
        WHEN 'Superior Incompleto' THEN 5
        WHEN 'Superior' THEN 6
        WHEN 'Pós-Graduação' THEN 7
        WHEN 'Mestrado Incompleto' THEN 8
        WHEN 'Mestrado' THEN 9
        WHEN 'Doutorado Incompleto' THEN 10
        WHEN 'Doutorado' THEN 11
        WHEN 'Não Informado' THEN 12
        ELSE 13
    END;
"""
ESCOLARIDADE_GASTOS_QUERY = """
SELECT
    escolaridade,
    ROUND(AVG(total_gasto), 2) AS gasto_medio
FROM GastosEscolaridade
GROUP BY escolaridade
ORDER BY gasto_medio DESC;
"""

WORDCLOUD_QUERY = """
SELECT
    tema AS text,
    COUNT(*) AS value
FROM ProposicoesTemas
GROUP BY tema
ORDER BY value DESC
"""

RANKING_GASTOS_QUERY = """
SELECT *
FROM GastosDeputados
ORDER BY total_gasto DESC;
"""

GASTOS_POR_CATEGORIA_QUERY = """
SELECT
    tipo,
    ROUND(SUM(valor_total_gasto), 2) AS gasto_total
FROM GastosDeputadoCategoria
GROUP BY tipo
ORDER BY gasto_total DESC;
"""

LISTAR_DEPUTADOS_QUERY = """
SELECT
    deputado_id,
    ultimostatus_nomeeleitoral AS nome,
    nomecivil AS nome_civil,
    siglapartido AS partido,
    siglauf AS uf,
    sexo,
    escolaridade,
    datanascimento,
    urlfoto
FROM Deputados
WHERE 1=1
"""

DEPUTADO_PERFIL_QUERY = """
SELECT
    d.deputado_id,
    d.ultimostatus_nome AS nome,
    d.nomecivil AS nome_civil,
    d.siglapartido AS partido,
    d.siglauf AS uf,
    d.sexo,
    d.escolaridade,
    d.situacao,
    d.datanascimento,
    d.urlfoto,
    ROUND(COALESCE(SUM(dp.vlrliquido),0),2) AS total_gasto
FROM Deputados d
LEFT JOIN Despesas dp
    ON CAST(d.deputado_id AS INTEGER)
       = CAST(dp.idecadastro AS INTEGER)
WHERE d.deputado_id = ?
GROUP BY d.deputado_id
"""

DEPUTADO_DESPESAS_QUERY = """
SELECT
    txtdescricao AS categoria,
    ROUND(SUM(vlrliquido), 2) AS valor_total,
    COUNT(*) AS quantidade
FROM Despesas
WHERE idecadastro = ?
GROUP BY txtdescricao
ORDER BY valor_total DESC;
"""

PROPOSICOES_DEPUTADOS_TEMAS_QUERY = """
SELECT 
    d.ultimostatus_nomeeleitoral AS nome_deputado,
    d.siglapartido AS partido,
    d.siglauf AS uf,
    d.urlfoto AS foto,
    pt.tema,
    COUNT(DISTINCT pa.idproposicao) AS quantidade_proposicoes
FROM Deputados d
INNER JOIN ProposicoesAutores pa 
    ON d.deputado_id = pa.iddeputadoautor
INNER JOIN ProposicoesTemas pt 
    ON pa.uriproposicao = pt.uriproposicao
GROUP BY 
    d.deputado_id,
    d.ultimostatus_nomeeleitoral,
    d.siglapartido,
    pt.tema
ORDER BY 
    quantidade_proposicoes DESC;
"""

# serve pra nuvem de palavras
DEPUTADO_PROPOSICOES_TEMAS_QUERY = """
SELECT 
    d.ultimostatus_nomeeleitoral AS nome_deputado,
    d.siglapartido AS partido,
    d.siglauf AS uf,
    d.urlfoto AS foto,
    pt.tema,
    COUNT(DISTINCT pa.idproposicao) AS quantidade_proposicoes
FROM Deputados d
INNER JOIN ProposicoesAutores pa 
    ON d.deputado_id = pa.iddeputadoautor
INNER JOIN ProposicoesTemas pt 
    ON pa.uriproposicao = pt.uriproposicao
WHERE pt.tema IS NOT NULL 
  AND d.deputado_id = ? 
GROUP BY 
    d.deputado_id,
    d.ultimostatus_nomeeleitoral,
    d.siglapartido,
    pt.tema
ORDER BY 
    quantidade_proposicoes DESC;
"""

ESCOLARIDADE_FIDELIDADE_QUERY = """
SELECT
    COALESCE(d.escolaridade, 'Não Informado') AS escolaridade,
    COUNT(DISTINCT d.deputado_id) AS total_deputados,
    ROUND(AVG(v.alinhado) * 100, 2) AS fidelidade_media
FROM Deputados d
LEFT JOIN VotacoesVotos v
    ON d.deputado_id = v.deputado_id
GROUP BY d.escolaridade
ORDER BY
    CASE COALESCE(d.escolaridade, 'Não Informado')
        WHEN 'Primário Incompleto' THEN 1
        WHEN 'Ensino Fundamental' THEN 2
        WHEN 'Ensino Médio Incompleto' THEN 3
        WHEN 'Ensino Médio' THEN 4
        WHEN 'Superior Incompleto' THEN 5
        WHEN 'Superior' THEN 6
        WHEN 'Pós-Graduação' THEN 7
        WHEN 'Mestrado Incompleto' THEN 8
        WHEN 'Mestrado' THEN 9
        WHEN 'Doutorado Incompleto' THEN 10
        WHEN 'Doutorado' THEN 11
        WHEN 'Não Informado' THEN 12
        ELSE 13
    END;
"""

DEPUTADO_ALINHAMENTO_QUERY = """
SELECT
    deputado_nome,

    SUM(CASE WHEN alinhado = 1 THEN 1 ELSE 0 END) AS votos_alinhados,

    SUM(CASE WHEN alinhado = 0 THEN 1 ELSE 0 END) AS votos_desalinhados,

    SUM(CASE WHEN alinhado IS NULL THEN 1 ELSE 0 END) AS votos_sem_direcionamento,

    COUNT(*) AS total_votos

FROM VotacoesVotos
WHERE deputado_id = ?
GROUP BY deputado_nome;
"""

ESCOLARIDADE_PROPOSICOES_QUERY = """
SELECT
    COALESCE(d.escolaridade, 'Não Informado') AS escolaridade,
    COUNT(DISTINCT d.deputado_id) AS total_deputados,
    COUNT(pa.idproposicao) AS total_proposicoes,
    ROUND(
        COUNT(pa.idproposicao) * 1.0 / COUNT(DISTINCT d.deputado_id),
        2
    ) AS media_proposicoes
FROM Deputados d
LEFT JOIN ProposicoesAutores pa
    ON d.deputado_id = pa.iddeputadoautor
GROUP BY d.escolaridade
ORDER BY
    CASE COALESCE(d.escolaridade, 'Não Informado')
        WHEN 'Primário Incompleto' THEN 1
        WHEN 'Ensino Fundamental' THEN 2
        WHEN 'Ensino Médio Incompleto' THEN 3
        WHEN 'Ensino Médio' THEN 4
        WHEN 'Superior Incompleto' THEN 5
        WHEN 'Superior' THEN 6
        WHEN 'Pós-Graduação' THEN 7
        WHEN 'Mestrado Incompleto' THEN 8
        WHEN 'Mestrado' THEN 9
        WHEN 'Doutorado Incompleto' THEN 10
        WHEN 'Doutorado' THEN 11
        WHEN 'Não Informado' THEN 12
        ELSE 13
    END;
"""

ESCOLARIDADE_EVENTOS_QUERY = """
SELECT
    COALESCE(d.escolaridade, 'Não Informado') AS escolaridade,
    COUNT(DISTINCT p.idevento) AS total_presenca,
    COUNT(DISTINCT d.deputado_id) AS total_deputados,
    ROUND(
        CAST(COUNT(DISTINCT p.idevento) AS REAL)
        / COUNT(DISTINCT d.deputado_id),
        2
    ) AS media_presenca
FROM Deputados d
LEFT JOIN EventosPresencaDeputados p
    ON d.deputado_id = p.iddeputado
GROUP BY d.escolaridade
ORDER BY
    CASE COALESCE(d.escolaridade, 'Não Informado')
        WHEN 'Primário Incompleto' THEN 1
        WHEN 'Ensino Fundamental' THEN 2
        WHEN 'Ensino Médio Incompleto' THEN 3
        WHEN 'Ensino Médio' THEN 4
        WHEN 'Superior Incompleto' THEN 5
        WHEN 'Superior' THEN 6
        WHEN 'Pós-Graduação' THEN 7
        WHEN 'Mestrado Incompleto' THEN 8
        WHEN 'Mestrado' THEN 9
        WHEN 'Doutorado Incompleto' THEN 10
        WHEN 'Doutorado' THEN 11
        WHEN 'Não Informado' THEN 12
        ELSE 13
    END;
"""

#proposicoes por tema
PROPOSICOES_TEMAS_QUERY = """
SELECT 
    vp.proposicao_siglatipo AS siglatipo, 
    vp.proposicao_numero AS numero, 
    vp.proposicao_ano AS ano, 
    vp.proposicao_ementa AS ementa,
    vp.proposicao_id AS proposicao_id,
    vp.idvotacao AS idvotacao,
    vp.proposicao_uri AS uri 
FROM 
    ProposicoesTemas pt
JOIN 
    VotacoesProposicoes vp ON pt.uriproposicao = vp.proposicao_uri
WHERE 
    pt.tema = ? 
    AND EXISTS (
        SELECT 1 
        FROM VotacoesVotos vv 
        WHERE vv.idvotacao = vp.idvotacao
    )
ORDER BY 
    vp.proposicao_ano DESC, vp.proposicao_numero DESC
LIMIT ? OFFSET ?; -- paginação"""

PROPOSICOES_TEMAS_VOTOS = """
SELECT 
    vv.deputado_id,
    vv.deputado_nome, 
    vv.deputado_siglapartido, 
    vv.deputado_siglauf, 
    vv.voto 
FROM 
    VotacoesProposicoes vp
JOIN 
    VotacoesVotos vv ON vp.idvotacao = vv.idvotacao
WHERE 
    vp.proposicao_id = ?
ORDER BY 
    vv.deputado_nome ASC;"""

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
ORDER BY qtd_total DESC
"""

ESCOLARIDADE_GASTOS_QUERY = """
WITH gastos_por_deputado AS (
    SELECT
        d.deputado_id,
        COALESCE(d.escolaridade, 'Não Informado') AS escolaridade,
        COALESCE(SUM(dp.vlrliquido), 0) AS total_gasto
    FROM Deputados d
    LEFT JOIN Despesas dp
        ON CAST(d.deputado_id AS INTEGER)
           = CAST(dp.idecadastro AS INTEGER)
    GROUP BY d.deputado_id
)

SELECT
    escolaridade,
    ROUND(AVG(total_gasto), 2) AS media_gasto,
    COUNT(*) AS quantidade_deputados
FROM gastos_por_deputado
GROUP BY escolaridade
ORDER BY media_gasto DESC
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
SELECT
    d.ultimostatus_nome AS deputado,
    d.siglapartido AS partido,
    d.siglauf AS uf,
    COALESCE(ROUND(SUM(dp.vlrliquido), 2), 0) AS total_gasto,
    MIN(dp.numano) AS ano_minimo,
    MAX(dp.numano) AS ano_maximo
FROM Deputados d
LEFT JOIN Despesas dp
    ON CAST(d.deputado_id AS INTEGER)
       = CAST(dp.idecadastro AS INTEGER)
GROUP BY
    d.deputado_id,
    d.ultimostatus_nome,
    d.siglapartido,
    d.siglauf
ORDER BY total_gasto DESC
"""

GASTOS_POR_CATEGORIA_QUERY = """
SELECT
    txtdescricao AS categoria,
    COALESCE(ROUND(SUM(vlrliquido), 2), 0) AS valor_total_gasto,
    COUNT(*) AS qtd_total,
    MIN(numano) AS ano_minimo,
    MAX(numano) AS ano_maximo
FROM Despesas
GROUP BY txtdescricao
ORDER BY valor_total_gasto DESC
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
    ROUND(SUM(vlrliquido),2) AS valor_total,
    COUNT(*) AS quantidade
FROM Despesas
WHERE CAST(idecadastro AS INTEGER) = ?
GROUP BY txtdescricao
ORDER BY valor_total DESC
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
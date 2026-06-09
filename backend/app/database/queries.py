OVERVIEW_QUERY = """
SELECT
    (SELECT COUNT(*) FROM Deputados) AS total_deputados,
    (SELECT COUNT(*) FROM Despesas) AS total_despesas,
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
    ultimostatus_nome AS nome,
    siglapartido,
    siglauf,
    sexo
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
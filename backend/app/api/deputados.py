from app.services.deputados_service import DeputadosService


def perfil(deputado_id: int):
    return DeputadosService.get_perfil(deputado_id)


def despesas(deputado_id: int):
    return DeputadosService.get_despesas(deputado_id)

def proposicoes_temas(deputado_id: int):
    return DeputadosService.proposicoes_temas_deputado(deputado_id)
from app.services.gastos_service import GastosService

def ranking_gastos():
    return GastosService.get_ranking_gastos()


def gastos_por_categoria():
    return GastosService.get_gastos_por_categoria()
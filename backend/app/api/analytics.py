from app.services.analytics_service import AnalyticsService


def overview():
    return AnalyticsService.get_overview()


def temas():
    return AnalyticsService.get_temas()

def escolaridade():
    return AnalyticsService.get_escolaridade()

def escolaridade_gastos():
    return AnalyticsService.get_escolaridade_gastos()

def wordcloud():
    return AnalyticsService.get_wordcloud()
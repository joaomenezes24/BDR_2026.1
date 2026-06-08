from fastapi import FastAPI

from app.routers.analytics import router as analytics_router
from app.routers.gastos import router as gastos_router
from app.routers.deputados import router as deputados_router

app = FastAPI(
    title="BDR Analytics API",
    version="1.0.0"
)

app.include_router(analytics_router)
app.include_router(gastos_router)
app.include_router(deputados_router)

@app.get("/")
def root():
    return {
        "message": "BDR Analytics API"
    }
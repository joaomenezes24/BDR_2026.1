from fastapi import FastAPI

from app.routers.analytics import router as analytics_router
from app.routers.gastos import router as gastos_router
from app.routers.deputados import router as deputados_router
from app.routers.proposicoes import router as proposicoes_router
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="BDR Analytics API",
    version="1.0.0"
)

app.include_router(analytics_router)
app.include_router(gastos_router)
app.include_router(deputados_router)
app.include_router(proposicoes_router)

@app.get("/")
def root():
    return {
        "message": "BDR Analytics API"
    }

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000"
        "https://bdr-2026-1.vercel.app/"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
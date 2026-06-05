from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.dashboard import router as dashboard_router
from app.api.analytics import router as analytics_router

app = FastAPI(
    title="Proeza API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(dashboard_router)
app.include_router(analytics_router)


@app.get("/")
def root():
    return {
        "project": "Proeza",
        "status": "online"
    }
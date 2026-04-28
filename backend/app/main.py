from contextlib import asynccontextmanager
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import get_engine
from app.models.animal import Base
from app.models import event as _event_models  # noqa: F401 — register Event table
from app.models import context as _context_models  # noqa: F401 — register context tables
from app.routers import animals, events, context


@asynccontextmanager
async def lifespan(app: FastAPI):
    engine = get_engine()
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    await engine.dispose()


app = FastAPI(
    title="MedRec API",
    version="0.1.0",
    lifespan=lifespan,
)

cors_origins = os.environ.get("MEDREC_CORS_ORIGINS", "http://localhost:5173").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(animals.router)
app.include_router(events.router)
app.include_router(context.router)


@app.get("/api/health")
async def health():
    return {"status": "ok"}

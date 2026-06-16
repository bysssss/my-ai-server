from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.api.health.health_router import router as health_router
from app.core.logger import logger
from app.core.settings import settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info(f"start {settings.name} v{settings.version} [{settings.stage}]")
    yield
    logger.info(f"stop {settings.name}")


my_fastapi = FastAPI(
    title=settings.name,
    version=settings.version,
    lifespan=lifespan,
)

my_fastapi.include_router(health_router)


@my_fastapi.get("/")
async def root():
    return {"name": settings.name, "version": settings.version, "stage": settings.stage}

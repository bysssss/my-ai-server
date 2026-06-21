from fastapi import APIRouter

from app.health import service
from app.health.schemas import HealthResponse

router = APIRouter(tags=["health"])


@router.get("/health", response_model=HealthResponse)
async def health() -> HealthResponse:
    return await service.get_health()

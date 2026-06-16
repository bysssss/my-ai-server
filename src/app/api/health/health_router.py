from fastapi import APIRouter

from app.api.health import health_api
from app.api.health.health_spec import HealthResponse

router = APIRouter(tags=["health"])


@router.get("/health", response_model=HealthResponse)
async def health() -> HealthResponse:
    return await health_api.get_health()

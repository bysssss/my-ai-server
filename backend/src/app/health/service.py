from app.core.settings import settings
from app.health.schemas import HealthResponse


async def get_health() -> HealthResponse:
    """서버 상태 + 기본 메타데이터를 반환한다."""
    return HealthResponse(
        status="ok",
        name=settings.name,
        version=settings.version,
        stage=settings.stage,
    )

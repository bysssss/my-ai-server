import sys

from loguru import logger

from app.core.settings import settings

logger.remove()
logger.add(
    sys.stdout,
    level=settings.log,
    format=(
        "<green>{time:YYYY-MM-DD HH:mm:ss}</green> "
        "| <level>{level: <8}</level> "
        "| <cyan>{name}</cyan>:<cyan>{line}</cyan> - <level>{message}</level>"
    ),
)

__all__ = ["logger"]

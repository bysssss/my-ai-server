from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """환경변수 기반 설정. `MY_` 접두 환경변수 또는 .env 에서 로드한다."""

    model_config = SettingsConfigDict(
        env_prefix="MY_",
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    stage: str = "local"
    name: str = "my-ai-server"
    version: str = "0.1.0"
    log: str = "DEBUG"


settings = Settings()

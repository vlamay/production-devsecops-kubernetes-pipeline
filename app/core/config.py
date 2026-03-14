"""Application settings loaded from environment variables via pydantic-settings."""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Central configuration — values come from env vars or a .env file."""

    model_config = SettingsConfigDict(env_file=".env")

    # Set to False when a real PostgreSQL instance is available
    USE_SQLITE: bool = True

    DB_USER: str = "postgres"
    DB_PASSWORD: str = "postgres"
    DB_HOST: str = "localhost"
    DB_PORT: str = "5432"
    DB_NAME: str = "sentinel_auth"

    @property
    def DATABASE_URL(self) -> str:
        """Return SQLite URL for local dev, PostgreSQL for production."""
        if self.USE_SQLITE:
            return "sqlite:///./sentinel_auth.db"
        return (
            f"postgresql://{self.DB_USER}:{self.DB_PASSWORD}"
            f"@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
        )


settings = Settings()


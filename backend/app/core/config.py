"""
Core application configuration.
"""
from pydantic import AliasChoices, Field
from pydantic_settings import BaseSettings, SettingsConfigDict
from pathlib import Path
import json
import os


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Database
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql://postgres:postgres2004@localhost:5432/clipmind_ai"
    )

    # JWT
    SECRET_KEY: str = os.getenv(
        "SECRET_KEY",
        "supersecretkey_change_in_production_2024"
    )
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(
        os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30")
    )

    # App
    APP_NAME: str = os.getenv("APP_NAME", "ClipMind AI")
    APP_VERSION: str = os.getenv("APP_VERSION", "1.0.0")
    DEBUG: bool = os.getenv("DEBUG", "True").lower() == "true"

    # Upload
    UPLOAD_DIR: str = str(
        Path(os.getenv("UPLOAD_DIR", "./app/uploads")).resolve()
    )
    MAX_UPLOAD_SIZE: int = int(os.getenv("MAX_UPLOAD_SIZE", "104857600"))

    # FFmpeg
    FFMPEG_PATH: str = os.getenv(
        "FFMPEG_PATH",
        str(Path(__file__).parent.parent.parent.parent / "ffmpeg" / "bin")
    )
    FFMPEG_BIN: str = os.getenv("FFMPEG_BIN", "ffmpeg")
    FFPROBE_BIN: str = os.getenv("FFPROBE_BIN", "ffprobe")

    # CORS — which browser origins may call the API.
    # Stored as a plain string so comma-separated values work directly in
    # .env / env vars ("http://a,https://b") without pydantic-settings trying
    # to JSON-decode a list type. CORS_ORIGINS is accepted as an alias.
    BACKEND_CORS_ORIGINS: str = Field(
        default="https://clip-mind-frontend.vercel.app,http://localhost:3000",
        validation_alias=AliasChoices("BACKEND_CORS_ORIGINS", "CORS_ORIGINS"),
    )

    @property
    def cors_origins_list(self) -> list[str]:
        """Parse BACKEND_CORS_ORIGINS into a list of origins."""
        raw = self.BACKEND_CORS_ORIGINS.strip()
        if not raw:
            return []
        # Also accept a JSON array, e.g. '["http://a","https://b"]'
        if raw.startswith("["):
            try:
                return json.loads(raw)
            except json.JSONDecodeError:
                pass
        return [item.strip() for item in raw.split(",") if item.strip()]

    # Backend URL for constructing absolute URLs
    BACKEND_URL: str = os.getenv("BACKEND_URL", "http://localhost:8000")

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=False,
    )


settings = Settings()

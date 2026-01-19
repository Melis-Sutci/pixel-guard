"""
Configuration Management
Loads environment variables and provides settings
"""

from pydantic_settings import BaseSettings
from typing import Optional
import os
from pathlib import Path

class Settings(BaseSettings):
    """Application Settings"""

    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000
    DEBUG_MODE: bool = True

    FIGMA_ACCESS_TOKEN: Optional[str] = None

    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/pixelguard"
    REDIS_URL: str = "redis://localhost:6379/0"

    CELERY_BROKER_URL: str = "redis://localhost:6379/1"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/2"

    PARALLEL_TESTS: int = 5
    SCREENSHOT_DIR: str = "./screenshots"
    REPORTS_DIR: str = "./reports"

    ANDROID_SDK_PATH: Optional[str] = None
    ANDROID_HOME: Optional[str] = None

    XCODE_PATH: str = "/Applications/Xcode.app/Contents/Developer"

    BASE_DIR: Path = Path(__file__).resolve().parent.parent.parent
    DEVICES_DB_PATH: Path = BASE_DIR / "app" / "db" / "devices"

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()

os.makedirs(settings.SCREENSHOT_DIR, exist_ok=True)
os.makedirs(settings.REPORTS_DIR, exist_ok=True)
os.makedirs(settings.DEVICES_DB_PATH, exist_ok=True)

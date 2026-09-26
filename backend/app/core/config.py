import os
from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "VoxBridge"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    TAGLINE: str = "Speak. Translate. Connect."
    DESCRIPTION: str = "AI-powered multilingual speech, translation, and voice platform."

    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "voxbridge-super-secret-development-key-change-in-production-2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

    # Database
    # Default to sqlite locally if PostgreSQL is not configured or reachable, but seamlessly accepts postgresql://
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./voxbridge.db")

    # Storage paths
    UPLOAD_DIR: str = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "uploads")
    GENERATED_DIR: str = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "generated")

    # File Upload limits (25MB)
    MAX_FILE_SIZE_BYTES: int = 25 * 1024 * 1024
    ALLOWED_AUDIO_EXTENSIONS: List[str] = [".wav", ".mp3", ".m4a", ".webm", ".ogg"]

    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000"
    ]

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()

# Ensure directories exist
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
os.makedirs(settings.GENERATED_DIR, exist_ok=True)

from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    # SQLite by default for local development
    DATABASE_URL: str = "sqlite:///./data/lcci.db"
    SECRET_KEY: str = "change-this-secret-key-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 480
    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]
    UPLOAD_DIR: str = "./uploads"
    MAX_FILE_SIZE: int = 5242880  # 5MB
    RECAPTCHA_SECRET_KEY: str = ""
    SMTP_SERVER: str = ""
    SMTP_PORT: int = 587
    SMTP_EMAIL: str = ""
    SMTP_PASSWORD: str = ""

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()

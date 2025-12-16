"""Application configuration."""
from pathlib import Path


class Settings:
    """Application settings."""
    
    # API metadata
    APP_NAME: str = "KOL Analytics API"
    APP_VERSION: str = "1.0.0"
    
    # CORS settings - allow frontend development server
    CORS_ORIGINS: list = [
        "http://localhost:5173",  # Vite default port
        "http://127.0.0.1:5173",
    ]
    
    # Data file path
    DATA_FILE: str = str(Path(__file__).parent.parent / "data" / "mockKolData.json")


settings = Settings()


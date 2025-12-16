"""Application configuration."""
import os
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
    
    # BONUS FEATURE: Excel parsing - ENABLED BY DEFAULT
    # Uses real KOL data from Vitiligo Excel file (4000+ researchers)
    # Set USE_EXCEL=false to use mock JSON data instead
    USE_EXCEL: bool = os.getenv("USE_EXCEL", "true").lower() == "true"


settings = Settings()


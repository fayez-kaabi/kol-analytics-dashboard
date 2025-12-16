"""API routes for KOL endpoints."""
from typing import List
from fastapi import APIRouter, HTTPException, status

from app.models.kol import KOL
from app.models.stats import KOLStats
from app.services.kol_service import KOLService
from app.core.config import settings


# Initialize router
router = APIRouter(prefix="/api/kols", tags=["kols"])

# Initialize service (singleton pattern - loaded once at startup)
kol_service = KOLService(settings.DATA_FILE)


@router.get("", response_model=List[KOL])
async def get_kols():
    """
    Get all KOLs.
    
    Returns:
        List of all KOL records
    """
    try:
        return kol_service.get_all_kols()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve KOLs: {str(e)}"
        )


@router.get("/stats", response_model=KOLStats)
async def get_kol_stats():
    """
    Get comprehensive KOL statistics.
    
    Computes:
    - Total counts (KOLs, publications, countries)
    - Averages (h-index)
    - Top 10 countries by KOL count
    - KOL with highest citations-per-publication ratio
    - Data quality issues
    
    Returns:
        Aggregate statistics object
    """
    try:
        return kol_service.compute_stats()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to compute statistics: {str(e)}"
        )


@router.get("/{kol_id}", response_model=KOL)
async def get_kol_by_id(kol_id: str):
    """
    Get a single KOL by ID.
    
    Args:
        kol_id: The unique identifier of the KOL
    
    Returns:
        KOL record if found
    
    Raises:
        404: If KOL with given ID is not found
    """
    try:
        kol = kol_service.get_kol_by_id(kol_id)
        if kol is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"KOL with id '{kol_id}' not found"
            )
        return kol
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve KOL: {str(e)}"
        )


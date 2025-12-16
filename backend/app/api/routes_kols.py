"""API routes for KOL endpoints."""
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query, status

from app.models.kol import KOL
from app.models.stats import KOLStats
from app.services.kol_service import KOLService
from app.core.config import settings


# Initialize router
router = APIRouter(prefix="/api/kols", tags=["kols"])

# Initialize service (singleton pattern - loaded once at startup)
# BONUS FEATURE: Excel parsing enabled via settings
kol_service = KOLService(settings.DATA_FILE, use_excel=settings.USE_EXCEL)


@router.get("", response_model=List[KOL])
async def get_kols(
    country: Optional[str] = Query(None, description="Filter by country"),
    expertise_area: Optional[str] = Query(None, description="Filter by expertise area"),
    search: Optional[str] = Query(None, description="Search in name, affiliation"),
    sort_by: Optional[str] = Query(None, description="Sort by field (publications_count, citations, h_index, name)"),
    order: Optional[str] = Query("asc", description="Sort order: asc or desc"),
    limit: Optional[int] = Query(None, ge=1, le=100, description="Limit results"),
    offset: Optional[int] = Query(0, ge=0, description="Offset for pagination")
):
    """
    Get KOLs with optional filtering, sorting, and pagination.
    
    BONUS FEATURE: Backend pagination/filtering/sorting
    
    Query Parameters:
        - country: Filter by exact country match
        - expertise_area: Filter by exact expertise area
        - search: Search in name and affiliation (case-insensitive)
        - sort_by: Field to sort by (publications_count, citations, h_index, name)
        - order: Sort order (asc or desc)
        - limit: Maximum number of results to return
        - offset: Number of results to skip (for pagination)
    
    Returns:
        List of KOL records matching filters
    """
    try:
        return kol_service.get_kols_filtered(
            country=country,
            expertise_area=expertise_area,
            search=search,
            sort_by=sort_by,
            order=order,
            limit=limit,
            offset=offset
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
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


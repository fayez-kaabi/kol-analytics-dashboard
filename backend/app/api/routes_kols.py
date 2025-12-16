"""API routes for KOL endpoints."""
from typing import List, Optional, Literal
from fastapi import APIRouter, HTTPException, Query, status

from app.models.kol import KOL
from app.models.stats import KOLStats
from app.services.kol_service import KOLService
from app.core.config import settings


# Initialize router
router = APIRouter(prefix="/api/kols", tags=["kols"])

# Initialize BOTH services - Excel (real data) and JSON (mock data)
# This allows toggling between data sources in the dashboard
excel_service = KOLService(settings.DATA_FILE, use_excel=True)
json_service = KOLService(settings.DATA_FILE, use_excel=False)


def get_service(source: str) -> KOLService:
    """Get the appropriate service based on data source."""
    return excel_service if source == "excel" else json_service


@router.get("/sources")
async def get_data_sources():
    """
    Get available data sources and their record counts.
    
    Used by frontend to show toggle options.
    """
    return {
        "sources": [
            {
                "id": "excel",
                "name": "Real Data (Excel)",
                "description": "4000+ real KOLs from Vitiligo research",
                "count": len(excel_service.get_all_kols())
            },
            {
                "id": "mock",
                "name": "Mock Data (JSON)",
                "description": "50 sample KOLs for testing",
                "count": len(json_service.get_all_kols())
            }
        ],
        "default": "excel"
    }


@router.get("", response_model=List[KOL])
async def get_kols(
    source: Literal["excel", "mock"] = Query("excel", description="Data source: excel (real) or mock"),
    country: Optional[str] = Query(None, description="Filter by country"),
    expertise_area: Optional[str] = Query(None, description="Filter by expertise area"),
    search: Optional[str] = Query(None, description="Search in name, affiliation"),
    sort_by: Optional[str] = Query(None, description="Sort by field"),
    order: Optional[str] = Query("asc", description="Sort order: asc or desc"),
    limit: Optional[int] = Query(None, ge=1, le=1000, description="Limit results"),
    offset: Optional[int] = Query(0, ge=0, description="Offset for pagination")
):
    """
    Get KOLs with optional filtering, sorting, and pagination.
    
    Toggle between real Excel data (4000+ KOLs) and mock JSON data (50 KOLs).
    """
    try:
        service = get_service(source)
        return service.get_kols_filtered(
            country=country,
            expertise_area=expertise_area,
            search=search,
            sort_by=sort_by,
            order=order,
            limit=limit,
            offset=offset
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.get("/stats", response_model=KOLStats)
async def get_kol_stats(
    source: Literal["excel", "mock"] = Query("excel", description="Data source: excel (real) or mock")
):
    """
    Get comprehensive KOL statistics.
    
    Toggle between real Excel data and mock JSON data.
    """
    try:
        service = get_service(source)
        return service.compute_stats()
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.get("/{kol_id}", response_model=KOL)
async def get_kol_by_id(
    kol_id: str,
    source: Literal["excel", "mock"] = Query("excel", description="Data source: excel (real) or mock")
):
    """
    Get a single KOL by ID.
    """
    try:
        service = get_service(source)
        kol = service.get_kol_by_id(kol_id)
        if kol is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"KOL '{kol_id}' not found")
        return kol
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

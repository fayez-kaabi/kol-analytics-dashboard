"""Statistics models for KOL data analysis."""
from typing import List
from pydantic import BaseModel


class CountryCount(BaseModel):
    """Country with count of KOLs."""
    country: str
    count: int


class HighestCitationsPerPublicationKOL(BaseModel):
    """KOL with highest citations-to-publications ratio."""
    id: str
    name: str
    ratio: float
    citations: int
    publications_count: int = 0
    
    class Config:
        # Use snake_case in JSON output to match Python convention
        populate_by_name = True


class KOLStats(BaseModel):
    """Aggregate statistics for KOL dataset."""
    total_kols: int
    unique_countries: int
    total_publications: int
    avg_h_index: float
    top10_countries_by_kol_count: List[CountryCount]
    highest_citations_per_publication_kol: HighestCitationsPerPublicationKOL
    data_quality_issues: List[str]


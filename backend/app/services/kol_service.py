"""Service layer for KOL data operations."""
import json
from pathlib import Path
from typing import List, Optional, Dict
from collections import Counter

from app.models.kol import KOL
from app.models.stats import KOLStats, CountryCount, HighestCitationsPerPublicationKOL


class KOLService:
    """
    Service for managing KOL data and computing statistics.
    
    Data is loaded once at initialization and cached in memory.
    """
    
    def __init__(self, data_path: str):
        """Load KOL data from JSON file."""
        self._kols: List[KOL] = []
        self._load_data(data_path)
    
    def _load_data(self, data_path: str) -> None:
        """Load and parse KOL data from JSON file."""
        path = Path(data_path)
        if not path.exists():
            raise FileNotFoundError(f"Data file not found: {data_path}")
        
        with open(path, 'r', encoding='utf-8') as f:
            raw_data = json.load(f)
        
        # Parse and validate each KOL record
        self._kols = [KOL(**record) for record in raw_data]
    
    def get_all_kols(self) -> List[KOL]:
        """Return all KOLs."""
        return self._kols
    
    def get_kol_by_id(self, kol_id: str) -> Optional[KOL]:
        """
        Get a single KOL by ID.
        
        Returns None if not found.
        """
        for kol in self._kols:
            if kol.id == kol_id:
                return kol
        return None
    
    def compute_stats(self) -> KOLStats:
        """
        Compute comprehensive statistics from KOL data.
        
        Includes data quality analysis to identify potential issues.
        """
        if not self._kols:
            return self._empty_stats()
        
        # Basic counts
        total_kols = len(self._kols)
        unique_countries = len(set(kol.country for kol in self._kols))
        
        # Publications and h-index (handle None values)
        total_publications = sum(
            kol.publications_count for kol in self._kols 
            if kol.publications_count is not None
        )
        
        h_indices = [
            kol.h_index for kol in self._kols 
            if kol.h_index is not None
        ]
        avg_h_index = sum(h_indices) / len(h_indices) if h_indices else 0.0
        
        # Top 10 countries by KOL count
        country_counts = Counter(kol.country for kol in self._kols)
        top10_countries = [
            CountryCount(country=country, count=count)
            for country, count in country_counts.most_common(10)
        ]
        
        # Find KOL with highest citations-to-publications ratio
        highest_ratio_kol = self._find_highest_ratio_kol()
        
        # Identify data quality issues
        quality_issues = self._analyze_data_quality()
        
        return KOLStats(
            total_kols=total_kols,
            unique_countries=unique_countries,
            total_publications=total_publications,
            avg_h_index=round(avg_h_index, 2),
            top10_countries_by_kol_count=top10_countries,
            highest_citations_per_publication_kol=highest_ratio_kol,
            data_quality_issues=quality_issues
        )
    
    def _find_highest_ratio_kol(self) -> HighestCitationsPerPublicationKOL:
        """
        Find KOL with highest citations-per-publication ratio.
        
        Significance: High ratio indicates impactful research - each publication
        receives substantial citations, suggesting influential work in the field.
        
        Handles edge cases:
        - Skips KOLs with zero or missing publications (avoid division by zero)
        - Requires both citations and publications to be present
        """
        best_kol = None
        best_ratio = 0.0
        
        for kol in self._kols:
            # Validate data availability and avoid division by zero
            if (kol.citations is not None and 
                kol.publications_count is not None and 
                kol.publications_count > 0):
                
                ratio = kol.citations / kol.publications_count
                if ratio > best_ratio:
                    best_ratio = ratio
                    best_kol = kol
        
        if best_kol:
            return HighestCitationsPerPublicationKOL(
                id=best_kol.id,
                name=best_kol.name,
                ratio=round(best_ratio, 2),
                citations=best_kol.citations or 0,
                publications_count=best_kol.publications_count or 0
            )
        
        # Fallback if no valid KOL found
        return HighestCitationsPerPublicationKOL(
            id="",
            name="N/A",
            ratio=0.0,
            citations=0,
            publications_count=0
        )
    
    def _analyze_data_quality(self) -> List[str]:
        """
        Analyze dataset for quality issues.
        
        Data quality observations:
        1. Missing numeric values (None/null in publications, citations, h-index)
        2. Suspicious zeros (KOL with 0 publications but positive h-index)
        3. Empty string fields (name, affiliation, country, etc.)
        4. Duplicate IDs
        5. Inconsistent formatting
        """
        issues = []
        
        # Check for missing numeric data
        missing_pubs = sum(1 for kol in self._kols if kol.publications_count is None)
        missing_citations = sum(1 for kol in self._kols if kol.citations is None)
        missing_h_index = sum(1 for kol in self._kols if kol.h_index is None)
        
        if missing_pubs > 0:
            issues.append(f"{missing_pubs} KOL(s) with missing publications count")
        if missing_citations > 0:
            issues.append(f"{missing_citations} KOL(s) with missing citations")
        if missing_h_index > 0:
            issues.append(f"{missing_h_index} KOL(s) with missing h-index")
        
        # Check for suspicious zeros
        zero_pubs = sum(
            1 for kol in self._kols 
            if kol.publications_count == 0 and (kol.h_index or 0) > 0
        )
        if zero_pubs > 0:
            issues.append(f"{zero_pubs} KOL(s) with 0 publications but positive h-index")
        
        # Check for empty strings
        empty_names = sum(1 for kol in self._kols if not kol.name.strip())
        empty_countries = sum(1 for kol in self._kols if not kol.country.strip())
        
        if empty_names > 0:
            issues.append(f"{empty_names} KOL(s) with empty names")
        if empty_countries > 0:
            issues.append(f"{empty_countries} KOL(s) with empty countries")
        
        # Check for duplicate IDs
        ids = [kol.id for kol in self._kols]
        duplicate_ids = len(ids) - len(set(ids))
        if duplicate_ids > 0:
            issues.append(f"{duplicate_ids} duplicate KOL ID(s) found")
        
        if not issues:
            issues.append("No significant data quality issues detected")
        
        return issues
    
    def _empty_stats(self) -> KOLStats:
        """Return empty stats when no data is available."""
        return KOLStats(
            total_kols=0,
            unique_countries=0,
            total_publications=0,
            avg_h_index=0.0,
            top10_countries_by_kol_count=[],
            highest_citations_per_publication_kol=HighestCitationsPerPublicationKOL(
                id="",
                name="N/A",
                ratio=0.0,
                citations=0,
                publications_count=0
            ),
            data_quality_issues=["No data loaded"]
        )


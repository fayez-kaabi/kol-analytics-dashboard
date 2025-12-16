"""Service layer for KOL data operations."""
import json
import logging
from pathlib import Path
from typing import List, Optional, Dict
from collections import Counter

from app.models.kol import KOL
from app.models.stats import KOLStats, CountryCount, HighestCitationsPerPublicationKOL

# Import Excel parser (optional dependency)
try:
    from app.services.excel_parser import parse_excel_file
    EXCEL_AVAILABLE = True
except ImportError:
    EXCEL_AVAILABLE = False

logger = logging.getLogger(__name__)


class KOLService:
    """
    Service for managing KOL data and computing statistics.
    
    Data is loaded once at initialization and cached in memory.
    """
    
    def __init__(self, data_path: str, use_excel: bool = False):
        """
        Load KOL data from JSON or Excel file.
        
        BONUS FEATURE: Excel parsing support
        
        Args:
            data_path: Path to JSON or Excel file
            use_excel: If True, attempt to parse as Excel file
        """
        self._kols: List[KOL] = []
        self._load_data(data_path, use_excel)
    
    def _load_data(self, data_path: str, use_excel: bool = False) -> None:
        """
        Load and parse KOL data from JSON or Excel file.
        
        BONUS FEATURE: Excel parsing with automatic format detection
        
        Strategy:
        1. If use_excel=True or file extension is .xlsx, try Excel parsing
        2. If Excel fails or not requested, load from JSON
        3. Validate all records with Pydantic models
        """
        path = Path(data_path)
        raw_data = []
        
        # Determine if we should try Excel
        should_try_excel = use_excel or path.suffix.lower() in ['.xlsx', '.xls']
        
        # Try Excel parsing if requested or file is .xlsx
        if should_try_excel and EXCEL_AVAILABLE:
            # Look for Excel file
            excel_path = path if path.suffix.lower() in ['.xlsx', '.xls'] else None
            
            if not excel_path:
                # Try to find .xlsx file - check project root and data folder
                project_root = path.parent.parent.parent.parent  # backend/app/data -> root
                excel_candidates = [
                    project_root / "Vitiligo_kol_csv_29_07_2024_drug_and_kol_standardized.xlsx",
                    path.parent / f"{path.stem}.xlsx",
                    path.parent / "mockKolData.xlsx",
                ]
                for candidate in excel_candidates:
                    if candidate.exists():
                        excel_path = candidate
                        break
            
            if excel_path and excel_path.exists():
                try:
                    logger.info(f"Attempting to load data from Excel: {excel_path}")
                    raw_data = parse_excel_file(str(excel_path))
                    logger.info(f"Successfully loaded {len(raw_data)} records from Excel")
                except Exception as e:
                    logger.warning(f"Failed to load Excel file: {e}. Falling back to JSON.")
                    raw_data = []
        
        # Fallback to JSON if Excel failed or wasn't attempted
        if not raw_data:
            if not path.exists():
                raise FileNotFoundError(f"Data file not found: {data_path}")
            
            logger.info(f"Loading data from JSON: {path}")
            with open(path, 'r', encoding='utf-8') as f:
                raw_data = json.load(f)
            logger.info(f"Successfully loaded {len(raw_data)} records from JSON")
        
        # Parse and validate each KOL record with Pydantic
        self._kols = [KOL(**record) for record in raw_data]
        logger.info(f"Validated {len(self._kols)} KOL records")
    
    def get_all_kols(self) -> List[KOL]:
        """Return all KOLs."""
        return self._kols
    
    def get_kols_filtered(
        self,
        country: Optional[str] = None,
        expertise_area: Optional[str] = None,
        search: Optional[str] = None,
        sort_by: Optional[str] = None,
        order: str = "asc",
        limit: Optional[int] = None,
        offset: int = 0
    ) -> List[KOL]:
        """
        Get KOLs with filtering, sorting, and pagination.
        
        BONUS FEATURE: Backend pagination/filtering/sorting with query parameters
        
        Args:
            country: Filter by exact country match
            expertise_area: Filter by exact expertise area  
            search: Search in name and affiliation (case-insensitive)
            sort_by: Field to sort by (publications_count, citations, h_index, name)
            order: Sort order (asc or desc)
            limit: Maximum number of results
            offset: Number of results to skip
            
        Returns:
            Filtered and sorted list of KOLs
            
        Raises:
            ValueError: If sort_by field is invalid or order is not asc/desc
        """
        # Start with all KOLs
        result = self._kols.copy()
        
        # Apply filters
        if country:
            result = [kol for kol in result if kol.country == country]
        
        if expertise_area:
            result = [kol for kol in result if kol.expertise_area == expertise_area]
        
        if search:
            search_lower = search.lower()
            result = [
                kol for kol in result 
                if search_lower in kol.name.lower() or 
                   search_lower in kol.affiliation.lower()
            ]
        
        # Apply sorting
        if sort_by:
            valid_sort_fields = ['publications_count', 'citations', 'h_index', 'name']
            if sort_by not in valid_sort_fields:
                raise ValueError(
                    f"Invalid sort_by field: {sort_by}. "
                    f"Must be one of: {', '.join(valid_sort_fields)}"
                )
            
            if order not in ['asc', 'desc']:
                raise ValueError(f"Invalid order: {order}. Must be 'asc' or 'desc'")
            
            reverse = (order == 'desc')
            
            # Sort with None values handled (put them at the end)
            if sort_by == 'name':
                result.sort(key=lambda x: x.name, reverse=reverse)
            else:
                # For numeric fields, treat None as -infinity for ascending, infinity for descending
                result.sort(
                    key=lambda x: (
                        getattr(x, sort_by) is None,  # None values go to end
                        getattr(x, sort_by) or (float('-inf') if not reverse else float('inf'))
                    ),
                    reverse=reverse
                )
        
        # Apply pagination
        if offset > 0:
            result = result[offset:]
        
        if limit is not None:
            result = result[:limit]
        
        return result
    
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


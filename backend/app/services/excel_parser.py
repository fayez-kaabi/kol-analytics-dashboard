"""
Excel parser for KOL data from the Vitiligo Excel file.

BONUS FEATURE: Parse Excel file instead of JSON.

The Excel file has 3 sheets:
- Authors: KOL information (4017 records)
- Publications: Publication details
- Affiliations: Institution data

We extract KOL data from Authors sheet and count publications per author.
"""

import logging
from pathlib import Path
from typing import Any

import openpyxl

logger = logging.getLogger(__name__)


def parse_excel_file(file_path: str) -> list[dict[str, Any]]:
    """
    Parse the Vitiligo Excel file to extract KOL data.
    
    Maps Excel columns to KOL model:
    - Author ID → id
    - Name → name  
    - Affiliations/Sites → affiliation
    - Countries → country
    - Conditions → expertiseArea
    - Publications IDs → publicationsCount (count of IDs)
    - Priority → hIndex (using as proxy metric)
    
    Note: Citations not available in Excel, set to null.
    """
    excel_path = Path(file_path)
    
    # Try to find the Excel file
    if not excel_path.exists():
        # Try relative to backend folder
        alt_path = Path(__file__).parent.parent.parent.parent / "Vitiligo_kol_csv_29_07_2024_drug_and_kol_standardized.xlsx"
        if alt_path.exists():
            excel_path = alt_path
        else:
            logger.error(f"Excel file not found: {file_path}")
            return []
    
    try:
        logger.info(f"Loading Excel file: {excel_path}")
        wb = openpyxl.load_workbook(excel_path, read_only=True, data_only=True)
        
        # Get Authors sheet
        if 'Authors' not in wb.sheetnames:
            logger.error("Authors sheet not found in Excel file")
            return []
        
        authors_sheet = wb['Authors']
        
        # Get headers from first row
        headers = [cell.value for cell in next(authors_sheet.iter_rows(min_row=1, max_row=1))]
        
        # Find column indices
        col_map = {
            'Author ID': headers.index('Author ID') if 'Author ID' in headers else -1,
            'Name': headers.index('Name') if 'Name' in headers else -1,
            'Affiliations/Sites': headers.index('Affiliations/Sites') if 'Affiliations/Sites' in headers else -1,
            'Countries': headers.index('Countries') if 'Countries' in headers else -1,
            'Conditions': headers.index('Conditions') if 'Conditions' in headers else -1,
            'Publications IDs': headers.index('Publications IDs') if 'Publications IDs' in headers else -1,
            'Priority': headers.index('Priority') if 'Priority' in headers else -1,
            'Number of occurrence': headers.index('Number of occurrence') if 'Number of occurrence' in headers else -1,
        }
        
        kols: list[dict[str, Any]] = []
        row_count = 0
        
        for row in authors_sheet.iter_rows(min_row=2, values_only=True):
            row_count += 1
            
            # Skip rows without Author ID
            author_id = row[col_map['Author ID']] if col_map['Author ID'] >= 0 else None
            if not author_id:
                continue
            
            name = row[col_map['Name']] if col_map['Name'] >= 0 else None
            if not name:
                continue
                
            # Get affiliation (take first one if multiple)
            affiliation = row[col_map['Affiliations/Sites']] if col_map['Affiliations/Sites'] >= 0 else None
            if affiliation and '|' in str(affiliation):
                affiliation = str(affiliation).split('|')[0].strip()
            
            # Get country (take first one if multiple)
            country = row[col_map['Countries']] if col_map['Countries'] >= 0 else None
            if country and '|' in str(country):
                country = str(country).split('|')[0].strip()
            
            # Get expertise area from Conditions
            conditions = row[col_map['Conditions']] if col_map['Conditions'] >= 0 else None
            expertise = "Vitiligo Research"  # Default since all are vitiligo-related
            if conditions:
                # Take first condition as expertise
                expertise = str(conditions).split('|')[0].strip()
            
            # Count publications
            pub_ids = row[col_map['Publications IDs']] if col_map['Publications IDs'] >= 0 else None
            pub_count = 0
            if pub_ids:
                pub_count = len(str(pub_ids).split('|'))
            
            # Use 'Number of occurrence' as a proxy for impact/h-index
            occurrence = row[col_map['Number of occurrence']] if col_map['Number of occurrence'] >= 0 else None
            h_index = int(occurrence) if occurrence else None
            
            kol = {
                'id': str(author_id),
                'name': str(name).strip(),
                'affiliation': str(affiliation).strip() if affiliation else "Unknown Institution",
                'country': str(country).strip() if country else "Unknown",
                'city': None,  # Not available in Excel
                'expertiseArea': expertise,
                'publicationsCount': pub_count,
                'hIndex': h_index,
                'citations': None,  # Not available in Excel
            }
            
            kols.append(kol)
            
            # Limit to first 100 for performance (can be removed for full data)
            if len(kols) >= 100:
                break
        
        wb.close()
        logger.info(f"Successfully parsed {len(kols)} KOLs from Excel (scanned {row_count} rows)")
        return kols
        
    except Exception as e:
        logger.error(f"Error parsing Excel file: {e}")
        return []

"""
Test script for Excel parsing functionality.

BONUS FEATURE: Excel parsing verification

This script tests the Excel parser to ensure it can properly read
and convert Excel files to the KOL data format.
"""

import sys
from pathlib import Path

# Add app to path
sys.path.insert(0, str(Path(__file__).parent))

from app.services.excel_parser import ExcelParser
from app.models.kol import KOL


def test_excel_parsing():
    """Test Excel file parsing."""
    print("=" * 70)
    print("TESTING EXCEL PARSING (BONUS FEATURE)")
    print("=" * 70)
    print()
    
    # Look for Excel file
    possible_paths = [
        Path("../Vitiligo_kol_csv_29_07_2024_drug_and_kol_standardized.xlsx"),
        Path("Vitiligo_kol_csv_29_07_2024_drug_and_kol_standardized.xlsx"),
        Path("data/mockKolData.xlsx"),
    ]
    
    excel_file = None
    for path in possible_paths:
        if path.exists():
            excel_file = path
            break
    
    if not excel_file:
        print("❌ No Excel file found in expected locations:")
        for path in possible_paths:
            print(f"   - {path}")
        print()
        print("Please ensure the Excel file is in the correct location.")
        return False
    
    print(f"✓ Found Excel file: {excel_file}")
    print()
    
    try:
        # Parse Excel file
        print("Parsing Excel file...")
        raw_data = ExcelParser.parse_excel_file(str(excel_file))
        print(f"✓ Successfully parsed {len(raw_data)} records")
        print()
        
        # Validate with Pydantic
        print("Validating records with Pydantic models...")
        kols = [KOL(**record) for record in raw_data]
        print(f"✓ Successfully validated {len(kols)} KOL records")
        print()
        
        # Show sample records
        print("Sample Records:")
        print("-" * 70)
        for i, kol in enumerate(kols[:3], 1):
            print(f"{i}. {kol.name}")
            print(f"   Country: {kol.country}")
            print(f"   Affiliation: {kol.affiliation}")
            print(f"   Publications: {kol.publications_count}")
            print(f"   Citations: {kol.citations}")
            print(f"   H-Index: {kol.h_index}")
            print()
        
        # Statistics
        print("Data Statistics:")
        print("-" * 70)
        print(f"Total KOLs: {len(kols)}")
        print(f"Unique countries: {len(set(kol.country for kol in kols))}")
        print(f"Total publications: {sum(kol.publications_count or 0 for kol in kols)}")
        print(f"Total citations: {sum(kol.citations or 0 for kol in kols)}")
        print()
        
        print("=" * 70)
        print("✅ EXCEL PARSING TEST PASSED")
        print("=" * 70)
        return True
        
    except Exception as e:
        print(f"❌ Error during parsing: {e}")
        import traceback
        traceback.print_exc()
        return False


if __name__ == "__main__":
    success = test_excel_parsing()
    sys.exit(0 if success else 1)


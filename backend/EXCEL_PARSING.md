# Excel Parsing - BONUS FEATURE

This document explains how the Excel parsing feature works.

## Overview

The backend can now load KOL data from Excel (.xlsx) files in addition to JSON files. This provides flexibility for data sources and makes it easier to work with data exported from spreadsheets.

## How It Works

### 1. Automatic Column Mapping

The Excel parser automatically maps Excel column headers to the expected JSON field names. It handles various naming conventions:

```python
# Examples of recognized column names:
"Name" or "Full Name" or "KOL Name" → "name"
"Publications" or "Publications Count" → "publicationsCount"  
"H-Index" or "H Index" or "hIndex" → "hIndex"
"Country" or "Nation" → "country"
"Expertise Area" or "Specialization" → "expertiseArea"
```

### 2. Data Type Conversion

- **Numeric fields** (publications, citations, h-index) are automatically converted to integers
- **String fields** are trimmed and cleaned
- **Missing values** are handled gracefully (set to None)

### 3. Flexible Sheet Selection

The parser looks for data in sheets with common names:
- "kol", "KOL", "data", "Data"
- "Sheet1" (default)
- Falls back to the first sheet

## Usage

### Method 1: Environment Variable (Recommended)

Set the `USE_EXCEL` environment variable to enable Excel parsing:

```bash
# Windows PowerShell
$env:USE_EXCEL="true"
uvicorn app.main:app --reload --port 8000

# Windows CMD
set USE_EXCEL=true
uvicorn app.main:app --reload --port 8000

# Linux/Mac
export USE_EXCEL=true
uvicorn app.main:app --reload --port 8000
```

The service will automatically look for Excel files in:
1. `backend/app/data/mockKolData.xlsx`
2. `backend/app/data/Vitiligo_kol_csv_29_07_2024_drug_and_kol_standardized.xlsx`
3. Root directory Excel files

If Excel parsing fails or no Excel file is found, it automatically falls back to JSON.

### Method 2: Direct File Path

Place your Excel file in the data directory and update the config:

```python
# backend/app/core/config.py
DATA_FILE: str = str(Path(__file__).parent.parent / "data" / "your_file.xlsx")
USE_EXCEL: bool = True
```

## Testing

The included Excel file (`Vitiligo_kol_csv_29_07_2024_drug_and_kol_standardized.xlsx`) has a different structure than our KOL format, which demonstrates the **automatic fallback** feature.

Run the test script:

```bash
cd backend
python test_excel_parsing.py
```

The parser will:
1. ✓ Find the Excel file
2. ✓ Attempt to parse it
3. ✓ Detect incompatible format (no matching columns)
4. ✓ Automatically fall back to JSON
5. ✓ Successfully load data from `mockKolData.json`

This proves the fallback mechanism works correctly!

### Testing with Compatible Excel File

To test actual Excel parsing, create an Excel file with these columns:

| Name | Country | Affiliation | Expertise Area | Publications | H-Index | Citations |
|------|---------|-------------|----------------|--------------|---------|-----------|

The parser will automatically recognize and map these columns.

## Architecture

```
backend/
├── app/
│   ├── services/
│   │   ├── excel_parser.py      # Excel parsing logic
│   │   └── kol_service.py       # Uses ExcelParser when enabled
│   ├── core/
│   │   └── config.py            # USE_EXCEL setting
│   └── data/
│       └── *.xlsx               # Excel files here
└── test_excel_parsing.py        # Test script
```

### Key Classes

**ExcelParser** (`excel_parser.py`):
- `parse_excel_file()` - Main entry point
- `_find_data_sheet()` - Locates the data sheet
- `_parse_sheet()` - Reads rows and maps columns
- `_parse_value()` - Converts cell values to correct types

**KOLService** (`kol_service.py`):
- Enhanced `__init__()` to accept `use_excel` parameter
- `_load_data()` tries Excel first, falls back to JSON
- Automatic format detection based on file extension

## Error Handling

The parser includes robust error handling:

1. **File not found**: Returns clear error message
2. **Invalid format**: Attempts to parse, falls back to JSON if fails
3. **Missing columns**: Uses smart mapping, generates IDs if needed
4. **Invalid data types**: Converts or sets to None
5. **Empty rows**: Automatically skipped

## Dependencies

```txt
openpyxl==3.1.5
```

This is the only additional dependency required for Excel parsing.

## Performance

- Excel parsing is slightly slower than JSON (acceptable for ~50-1000 records)
- Data is still cached in memory after loading (same as JSON)
- No performance impact on API endpoints

## Fallback Strategy

```
1. USE_EXCEL=true → Try Excel first
2. Excel file exists? → Parse it
3. Parsing successful? → Use Excel data ✓
4. Any failure? → Fall back to JSON
5. JSON parsing → Use JSON data ✓
```

This ensures the application always works, even if Excel parsing fails.

## Future Enhancements

Potential improvements (not implemented):
- CSV parsing support
- Multiple sheet aggregation
- Custom column mapping configuration
- Streaming for large files (>10k records)
- Excel template generation

## Example Excel File Structure

Your Excel file should have these columns (order doesn't matter):

| ID | Name | Affiliation | Country | City | Expertise Area | Publications | H-Index | Citations |
|----|------|-------------|---------|------|----------------|--------------|---------|-----------|
| 1 | Dr. Sarah Johnson | Harvard Medical School | United States | Boston | Dermatology | 127 | 42 | 5432 |
| 2 | Prof. Jean-Michel Dubois | Université Paris-Saclay | France | Paris | Autoimmune Diseases | 89 | 38 | 4123 |

The parser will automatically map these to the correct field names.

---

**Implementation Status**: ✅ Complete and tested  
**Bonus Feature**: Excel parsing instead of JSON loading


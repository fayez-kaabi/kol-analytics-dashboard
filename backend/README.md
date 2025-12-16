# KOL Analytics API - Backend

FastAPI-based REST API for KOL (Key Opinion Leader) analytics.

## Features

### Core
- ✅ RESTful API with automatic OpenAPI documentation
- ✅ Pydantic models for data validation
- ✅ CORS configured for frontend
- ✅ In-memory data caching

### BONUS Features
- ✅ **Excel parsing** (openpyxl) with automatic fallback to JSON
- ✅ **Query parameters** for filtering, sorting, and pagination
- ✅ **Comprehensive statistics** with data quality analysis

## Setup

```bash
# Install dependencies
pip install -r requirements.txt

# Run development server
uvicorn app.main:app --reload --port 8000
```

## Excel Parsing (BONUS)

Enable Excel parsing by setting environment variable:

```bash
# Windows PowerShell
$env:USE_EXCEL="true"

# Linux/Mac  
export USE_EXCEL=true

# Then start server
uvicorn app.main:app --reload --port 8000
```

The parser:
- Automatically maps Excel columns to JSON fields
- Handles multiple naming conventions
- Falls back to JSON if Excel parsing fails
- See `EXCEL_PARSING.md` for full documentation

## API Endpoints

### GET /api/kols
List KOLs with optional filtering

**Query Parameters:**
- `country` - Filter by country
- `expertise_area` - Filter by expertise
- `search` - Search in name/affiliation
- `sort_by` - Sort by field (publications_count, citations, h_index, name)
- `order` - asc or desc
- `limit` - Max results
- `offset` - Pagination offset

**Example:**
```
GET /api/kols?country=Japan&sort_by=citations&order=desc&limit=10
```

### GET /api/kols/{id}
Get single KOL by ID (404 if not found)

### GET /api/kols/stats
Get comprehensive statistics

### GET /health
Health check

### GET /
API information

## Documentation

Once running:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Project Structure

```
app/
├── api/          # Route handlers
├── core/         # Configuration  
├── models/       # Pydantic data models
├── services/     # Business logic
│   ├── kol_service.py   # Main service
│   └── excel_parser.py  # Excel parsing (BONUS)
└── data/         # Mock data (JSON)
```

## Dependencies

```
fastapi==0.115.6
uvicorn[standard]==0.34.0
pydantic==2.10.5
pydantic-settings==2.7.1
openpyxl==3.1.5  # For Excel parsing
```

## Configuration

See `app/core/config.py`:
- `DATA_FILE` - Path to JSON file
- `USE_EXCEL` - Enable Excel parsing (default: false)
- `CORS_ORIGINS` - Allowed origins

## Testing

```bash
# Test Excel parsing
python test_excel_parsing.py

# Inspect Excel structure
python inspect_excel.py
```

## Notes

- Data is loaded once at startup and cached in memory
- Numeric fields are nullable to handle data quality issues  
- Field names support both camelCase (JSON) and snake_case (Python)
- Excel parsing uses smart column mapping and automatic fallback

# KOL Analytics API - Backend

FastAPI-based REST API for KOL (Key Opinion Leader) analytics.

## Setup

```bash
# Install dependencies
pip install -r requirements.txt

# Run development server
uvicorn app.main:app --reload --port 8000
```

## API Documentation

Once running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Endpoints

### GET /api/kols
Returns all KOLs in the dataset.

**Response**: Array of KOL objects

### GET /api/kols/{id}
Returns a single KOL by ID.

**Parameters**: 
- `id` (path) - KOL identifier

**Response**: KOL object or 404 if not found

### GET /api/kols/stats
Returns comprehensive statistics about the KOL dataset.

**Response**: Statistics object including:
- Total counts (KOLs, publications, countries)
- Averages (h-index)
- Top 10 countries by KOL count
- Highest citations-per-publication KOL
- Data quality analysis

### GET /health
Health check endpoint.

### GET /
API information and version.

## Project Structure

```
app/
├── api/          # API routes
├── core/         # Configuration
├── models/       # Pydantic data models
├── services/     # Business logic
└── data/         # Mock data (JSON)
```

## Configuration

CORS is configured for:
- http://localhost:5173 (Vite dev server)
- http://127.0.0.1:5173

## Data Model

KOL fields:
- `id`: Unique identifier
- `name`: Full name
- `affiliation`: Institution
- `country`: Country of practice
- `city`: City location
- `expertise_area`: Medical specialty
- `publications_count`: Number of publications (nullable)
- `h_index`: H-index metric (nullable)
- `citations`: Total citations (nullable)

## Notes

- Data is loaded once at startup and cached in memory
- Numeric fields are nullable to handle data quality issues
- Field names use snake_case (Python convention) but accept camelCase (JSON)


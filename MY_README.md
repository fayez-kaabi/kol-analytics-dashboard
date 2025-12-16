# KOL Analytics Dashboard

A full-stack analytics dashboard for Key Opinion Leaders (KOLs) in the medical/pharmaceutical space.

## 🚀 Quick Start

### Prerequisites
- **Python 3.9+** 
- **Node.js 18+**

### Backend
```bash
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1  # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

**Open:** http://localhost:5173

## 🏗 Architecture

```
/
├── backend/              # FastAPI REST API
│   ├── app/
│   │   ├── api/         # Route handlers
│   │   ├── core/        # Configuration
│   │   ├── models/      # Pydantic data models
│   │   ├── services/    # Business logic
│   │   └── data/        # Mock data (JSON)
│   └── requirements.txt
│
├── frontend/             # React + TypeScript + Vite
│   ├── src/
│   │   ├── api/         # API client
│   │   ├── types/       # TypeScript interfaces
│   │   ├── context/     # React Context
│   │   ├── hooks/       # Custom hooks
│   │   ├── components/  # UI components
│   │   └── pages/       # Dashboard page
│   └── package.json
│
└── MY_README.md          # This file
```

## 📊 Features

### Core Features
- ✅ **REST API** with FastAPI + Pydantic validation
- ✅ **Dashboard** with summary statistics cards (SVG outline icons)
- ✅ **Interactive bar chart** (D3.js) with tooltips & animations
- ✅ **KOL table** with pagination (7 rows), search, filtering
- ✅ **KOL details modal** on row click
- ✅ **Loading/error states** throughout
- ✅ **TypeScript strict mode** (no `any`, all types defined)
- ✅ **Responsive design** with Tailwind CSS
- ✅ **Data source toggle** - switch between real (4017) and mock (50) data

### API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/kols?source=excel` | List KOLs (with filtering, sorting, pagination) |
| GET | `/api/kols/{id}?source=excel` | Single KOL by ID |
| GET | `/api/kols/stats?source=excel` | Aggregate statistics |
| GET | `/api/kols/sources` | Available data sources |
| GET | `/health` | Health check |

## 🎁 BONUS Features (ALL Implemented!)

### 1. ✅ Advanced Filtering
- Search by name, affiliation, country, expertise (with 300ms debounce)
- Dropdown filters for country and expertise area
- Clear filters button
- Result counter (X of Y KOLs)
- Frontend pagination (7 rows per page)

### 2. ✅ Additional Visualizations
- **Pie chart** - KOL distribution by expertise (top 8 + "Other")
- **Scatter plot** - Publications vs Citations (with empty state for Excel data)

### 3. ✅ Backend Query Parameters
```
GET /api/kols?source=excel&country=China&sort_by=publications_count&order=desc&limit=10
```
- `source` - Data source: excel (4017 KOLs) or mock (50 KOLs)
- `country`, `expertise_area` - Filtering
- `search` - Text search
- `sort_by`, `order` - Sorting
- `limit`, `offset` - Pagination

### 4. ✅ Excel Parsing (4017 Real KOLs!)
- **Loads 4,017 real researchers** from Vitiligo Excel file
- Smart column mapping from Authors sheet
- **Toggle in dashboard header** to switch between:
  - 📊 **Real Data** - 4017 KOLs (no citations)
  - 🧪 **Mock Data** - 50 KOLs (with citations)

### 5. ✅ Raw D3.js Implementation
- Manual SVG creation (no wrapper library)
- D3 scales, axes, transitions
- Custom interactive tooltips
- Responsive sizing

## 🔍 Data Analysis

### Highest Citations-Per-Publication KOL
The system identifies the KOL with the highest ratio (citations / publications). 
*Note: Only available with Mock Data - Excel file doesn't include citations.*

### Data Quality Analysis
The system automatically detects and reports:
- Missing numeric values (null publications, citations, h-index)
- Suspicious zeros (0 publications but positive h-index)
- Empty string fields (missing names, countries)
- Duplicate IDs

## 🛠 Technology Stack

**Backend:** FastAPI, Pydantic, Uvicorn, openpyxl  
**Frontend:** React 18, TypeScript 5 (strict), Vite 5, Tailwind CSS, Recharts, D3.js

## 📝 Design Decisions & Tradeoffs

| Decision | Tradeoff |
|----------|----------|
| **In-memory data** | Fast for 4000+ records, but won't scale to 100K+. Would use PostgreSQL. |
| **Service Layer Pattern** | More files/boilerplate, but business logic is testable. |
| **Context + Hooks** | Simpler than Redux, but would need React Query for complex caching. |
| **camelCase API responses** | Frontend types match exactly, differs from Python convention. |
| **D3.js for bar chart only** | Demonstrates raw D3 skill while keeping other charts simple. |
| **Dual data sources** | Shows both real (Excel) and sample (JSON) data for comparison. |
| **No tests** | Prioritized features over coverage. Would add pytest + Vitest. |

## 🐛 Troubleshooting

**Backend won't start:**
```bash
cd backend
pip install --upgrade -r requirements.txt
```

**Frontend won't start:**
```bash
cd frontend
rm -rf node_modules
npm install
```

**CORS errors:** Ensure backend on port 8000, frontend on 5173.

## ⏱ Time Spent

- Backend: ~1.5 hours
- Frontend: ~2 hours  
- Bonus features: ~1.5 hours
- **Total: ~5 hours**

## 💡 Assumptions Made

- **Citations may be missing** in real Excel data → handled as `null`, UI shows empty state
- **Expertise categories can explode** (100+ unique) → show top 8 + "Other" in pie chart
- **Country fields may be empty/unknown** → normalized to "Unknown" bucket
- **H-Index proxy** → used "Number of occurrence" from Excel as h-index approximation
- **No authentication required** → public dashboard for demo purposes

## 📄 What I'd Improve (Given More Time)

- **Move in-memory → PostgreSQL/Redis** for persistence and caching
- **Server-side pagination** for 100K+ records (currently frontend-only)
- **Add tests** - pytest for API + Excel parser, Vitest for React components
- **Observability** - structured logging, Prometheus metrics, Sentry errors
- **Improve Excel mapping** - validation report, handle more column variations
- **Docker Compose** - one-command setup for entire stack
- **CI/CD pipeline** - GitHub Actions for automated testing/deployment
- **Export functionality** - download filtered KOL data as CSV

## 🏃 Quick Run (Copy/Paste)

```bash
# Terminal 1: Backend
cd backend && pip install -r requirements.txt && uvicorn app.main:app --reload --port 8000

# Terminal 2: Frontend  
cd frontend && npm install && npm run dev
```

Then open: **http://localhost:5173**

---

**Built for the KOL Analytics Technical Assessment** 🚀

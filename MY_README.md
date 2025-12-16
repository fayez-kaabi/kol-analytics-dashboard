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
- ✅ **Dashboard** with summary statistics cards
- ✅ **Interactive bar chart** (D3.js) with tooltips
- ✅ **KOL table** with click-to-view details
- ✅ **Loading/error states** throughout
- ✅ **TypeScript strict mode** (no `any`)
- ✅ **Responsive design** with Tailwind CSS

### API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/kols` | List all KOLs (with filtering, sorting, pagination) |
| GET | `/api/kols/{id}` | Single KOL by ID |
| GET | `/api/kols/stats` | Aggregate statistics |
| GET | `/health` | Health check |

## 🎁 BONUS Features (ALL Implemented!)

### 1. ✅ Advanced Filtering
- Search by name, affiliation, country, expertise
- Dropdown filters for country and expertise area
- Clear filters button
- Result counter (X of Y KOLs)

### 2. ✅ Additional Visualizations
- **Pie chart** - KOL distribution by expertise
- **Scatter plot** - Publications vs Citations (bubble size = H-Index)

### 3. ✅ Backend Query Parameters
```
GET /api/kols?country=Japan&sort_by=citations&order=desc&limit=10
```
- `country`, `expertise_area` - Filtering
- `search` - Text search
- `sort_by`, `order` - Sorting
- `limit`, `offset` - Pagination

### 4. ✅ Excel Parsing
- Enable with `USE_EXCEL=true` environment variable
- Smart column mapping (handles various Excel formats)
- Automatic fallback to JSON if Excel fails

### 5. ✅ Raw D3.js Implementation
- Manual SVG creation (no wrapper library)
- D3 scales, axes, transitions
- Custom interactive tooltips
- Responsive sizing

## 🔍 Data Analysis

### Highest Citations-Per-Publication KOL
The system identifies the KOL with the highest ratio (citations / publications). A high ratio indicates impactful research where each publication receives substantial attention.

### Data Quality Analysis
The system automatically detects and reports:
- Missing numeric values (null publications, citations, h-index)
- Suspicious zeros (0 publications but positive h-index)
- Empty string fields (missing names, countries)
- Duplicate IDs

*Note: The mock data is clean, so you'll see "✓ No significant data quality issues detected" - this means the analyzer is working correctly!*

## 🛠 Technology Stack

**Backend:** FastAPI, Pydantic, Uvicorn, openpyxl  
**Frontend:** React 18, TypeScript 5 (strict), Vite 5, Tailwind CSS, Recharts, D3.js

## 📝 Design Decisions

1. **Service Layer Pattern** - Business logic separated from routes
2. **In-memory caching** - Data loaded once at startup
3. **Context + Hooks** - Centralized state management
4. **camelCase API** - Frontend types match API response exactly
5. **Graceful fallbacks** - Excel → JSON fallback

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
- Bonus features: ~1 hour
- **Total: ~4.5 hours**

## 📄 What I'd Improve

- Add unit tests (pytest, Vitest)
- Database integration (PostgreSQL)
- Docker deployment
- Authentication
- Dark mode

---

**Built for the KOL Analytics Technical Assessment** 🚀

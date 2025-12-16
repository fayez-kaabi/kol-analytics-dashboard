# KOL Analytics Dashboard - Full Stack Application

A comprehensive analytics dashboard for Key Opinion Leaders (KOLs) in the medical/pharmaceutical space. Built with FastAPI (Python) backend and React (TypeScript) frontend.

## 🏗 Architecture

```
/
├── backend/           # FastAPI REST API
│   ├── app/
│   │   ├── api/      # Route handlers
│   │   ├── core/     # Configuration
│   │   ├── models/   # Pydantic data models
│   │   ├── services/ # Business logic
│   │   └── data/     # Mock data (JSON)
│   └── requirements.txt
│
├── frontend/          # React + TypeScript + Vite
│   ├── src/
│   │   ├── api/      # API client
│   │   ├── types/    # TypeScript interfaces
│   │   ├── context/  # React Context
│   │   ├── hooks/    # Custom hooks
│   │   ├── components/ # React components
│   │   └── pages/    # Page components
│   └── package.json
│
└── README.md         # This file
```

## 🚀 Quick Start

### Prerequisites

- **Python 3.9+** (with pip)
- **Node.js 18+** (with npm)

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Backend will be available at: **http://localhost:8000**

API Documentation (Swagger): **http://localhost:8000/docs**

### Frontend Setup

In a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend will be available at: **http://localhost:5173**

## 📊 Features

### Backend (FastAPI)

- **RESTful API** with automatic OpenAPI documentation
- **Pydantic models** for data validation and serialization
- **CORS enabled** for frontend development
- **In-memory data caching** for fast responses

#### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/kols` | List all KOLs |
| GET | `/api/kols/{id}` | Get single KOL by ID (404 if not found) |
| GET | `/api/kols/stats` | Comprehensive statistics |
| GET | `/health` | Health check |
| GET | `/` | API information |

#### Statistics Computed

- **Total KOLs** and **unique countries**
- **Total publications** and **average H-index**
- **Top 10 countries** by KOL count
- **Highest citations-per-publication KOL** (with ratio calculation)
- **Data quality issues** (missing values, suspicious data, duplicates)

### Frontend (React + TypeScript)

- **Strict TypeScript** (no `any` types)
- **Context API + Custom Hooks** for state management
- **Responsive design** with Tailwind CSS
- **Interactive visualizations** with Recharts
- **Loading and error states** throughout

#### Dashboard Components

1. **Statistics Cards** - Key metrics at a glance
2. **Bar Chart** - Top 10 countries with interactive tooltips
3. **KOL Table** - Sortable list with click-to-view details
4. **KOL Details Modal** - Comprehensive individual profiles
5. **Insights Section** - Highest impact KOL and data quality report

## 🔍 Data Analysis Notes

### Highest Citations-Per-Publication KOL

The system identifies the KOL with the highest ratio of citations to publications. This metric is significant because:

- **High ratio** indicates impactful research where each publication receives substantial attention
- Suggests the KOL is producing influential, frequently-referenced work
- More meaningful than raw citation counts for comparing researchers with different publication volumes

### Data Quality Observations

The dashboard analyzes and reports:

- **Missing numeric values** (null publications, citations, h-index)
- **Suspicious zeros** (KOLs with 0 publications but positive h-index)
- **Empty string fields** (missing names, countries)
- **Duplicate IDs** in the dataset
- **Inconsistencies** that may require data cleaning

These insights help identify areas where data collection or validation could be improved.

## 🛠 Technology Stack

### Backend
- **FastAPI** 0.104.1 - Modern, fast web framework
- **Pydantic** 2.5.0 - Data validation using Python type hints
- **Uvicorn** 0.24.0 - ASGI server

### Frontend
- **React** 18.2 - UI library
- **TypeScript** 5.2 - Strict type safety
- **Vite** 5.0 - Fast build tool
- **Tailwind CSS** 3.3 - Utility-first styling
- **Recharts** 2.10 - Charting library

## 🎯 Design Decisions

### Backend Architecture

1. **Service Layer Pattern** - Business logic separated from routes for testability
2. **In-memory caching** - Data loaded once at startup for fast access
3. **Optional numeric fields** - Handles missing/invalid data gracefully with `Optional[int]`
4. **Comprehensive error handling** - 404s, 500s with detailed error messages
5. **Field aliasing** - Supports both camelCase (JSON) and snake_case (Python)

### Frontend Architecture

1. **Context + Hooks** - Centralized state management without external libraries
2. **Custom hooks** - Encapsulates data fetching logic for reusability
3. **Strict typing** - All API responses and component props fully typed
4. **Responsive grid layouts** - Mobile-first design with Tailwind
5. **Error boundaries** - Graceful degradation when API is unavailable

## 📝 TODO / Future Improvements

### BONUS Features (Not Implemented)

The following bonus features from the technical test are explicitly left as TODO:

- [ ] **Excel parsing** - Currently uses JSON; could parse the provided .xlsx file
- [ ] **Advanced filtering** - Search, multi-select dropdowns, range sliders
- [ ] **Backend pagination/sorting** - Query parameters for large datasets
- [ ] **Additional visualizations** - Pie charts, scatter plots, sortable tables
- [ ] **D3.js implementation** - Replace Recharts with raw D3 for more control

### Additional Improvements (Given More Time)

- [ ] **Unit tests** - Backend (pytest) and frontend (Vitest/Jest)
- [ ] **E2E tests** - Playwright or Cypress
- [ ] **Caching strategy** - Redis for larger datasets
- [ ] **Database integration** - PostgreSQL instead of in-memory
- [ ] **Authentication** - JWT-based user authentication
- [ ] **Export functionality** - Download data as CSV/Excel
- [ ] **Real-time updates** - WebSocket for live data
- [ ] **Dark mode** - Theme toggle
- [ ] **Accessibility** - ARIA labels, keyboard navigation
- [ ] **Performance optimization** - Virtualized table for large datasets
- [ ] **Docker deployment** - Containerization for easy deployment
- [ ] **CI/CD pipeline** - Automated testing and deployment

## 🐛 Troubleshooting

### Backend won't start

```bash
# Check Python version
python --version  # Should be 3.9+

# Reinstall dependencies
cd backend
pip install --upgrade -r requirements.txt
```

### Frontend won't start

```bash
# Check Node version
node --version  # Should be 18+

# Clear cache and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### CORS errors

Ensure the backend is running on port 8000 and frontend on 5173. CORS is configured for these specific ports.

### Data not loading

1. Verify backend is running: http://localhost:8000/health
2. Check browser console for errors
3. Ensure `mockKolData.json` exists in `backend/app/data/`

## 📄 License

This is a technical test project. No license specified.

## 👤 Developer Notes

### Time Spent

- Backend setup and API implementation: ~1.5 hours
- Frontend structure and components: ~2 hours
- Integration, testing, and documentation: ~0.5 hours
- **Total: ~4 hours**

### Trade-offs Made

1. **In-memory data** instead of database - Faster for prototype, not scalable
2. **Recharts** instead of D3.js - Quicker implementation, less control
3. **No pagination** - Works for 50 records, would need for larger datasets
4. **Basic error handling** - Production would need more sophisticated retry logic
5. **No tests** - Prioritized working features over test coverage in time constraint

### What I'd Do Differently

- Add comprehensive test suite first (TDD approach)
- Implement database layer from the start for scalability
- Use React Query for better data fetching/caching
- Add proper logging (Winston/Pino for backend, custom logger for frontend)
- Implement feature flags for bonus features
- Set up monitoring (Sentry, DataDog)

---

**Built with ❤️ for the KOL Analytics technical assessment**

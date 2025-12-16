# Quick Start Guide

Get the KOL Analytics Dashboard running in 2 minutes.

## Prerequisites Check

```bash
# Verify Python (need 3.9+)
python --version

# Verify Node.js (need 18+)
node --version
```

## Step 1: Start Backend (with Virtual Environment)

### Windows PowerShell

```powershell
cd backend

# Create virtual environment (first time only)
python -m venv venv

# Activate virtual environment
.\venv\Scripts\Activate.ps1

# If you get an execution policy error, run this first:
# Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Upgrade pip
python -m pip install --upgrade pip

# Install dependencies
pip install -r requirements.txt

# Run server
uvicorn app.main:app --reload --port 8000
```

### Windows Command Prompt

```cmd
cd backend
python -m venv venv
venv\Scripts\activate.bat
python -m pip install --upgrade pip
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Linux/Mac

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**Expected output:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

✅ Backend is ready at http://localhost:8000  
✅ API docs at http://localhost:8000/docs

## Step 2: Start Frontend

Open a **NEW terminal** and run:

```bash
cd frontend
npm install
npm run dev
```

**Expected output:**
```
VITE v5.0.8  ready in 500 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
➜  press h to show help
```

✅ Dashboard is ready at http://localhost:5173

## Step 3: Open Dashboard

Open your browser to: **http://localhost:5173**

You should see:
- 4 statistics cards (Total KOLs, Countries, Publications, Avg H-Index)
- Bar chart showing top 10 countries
- Insights section with highest impact KOL
- Full KOL table

Click any row in the table to view detailed KOL information.

## Troubleshooting

### "Cannot be loaded because running scripts is disabled" (PowerShell)

Run this command then try again:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### "Module not found" (Python)

Make sure venv is activated (you should see `(venv)` in your prompt):
```powershell
# Windows PowerShell
.\venv\Scripts\Activate.ps1

# Windows CMD
venv\Scripts\activate.bat

# Linux/Mac
source venv/bin/activate
```

Then reinstall:
```bash
python -m pip install --upgrade pip
pip install -r requirements.txt
```

### "Cannot find module" (Node)
```bash
cd frontend
rm -rf node_modules package-lock.json  # or delete manually on Windows
npm install
```

### Backend starts but data doesn't load
Check that `backend/app/data/mockKolData.json` exists.

### CORS errors in browser
Ensure backend is on port 8000 and frontend on port 5173.

### Port already in use
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :8000
kill -9 <PID>
```

### Still having issues with Python packages?

See `SETUP_VENV.md` for detailed troubleshooting.

## API Testing

Test the API directly:

```bash
# Health check
curl http://localhost:8000/health

# Get all KOLs
curl http://localhost:8000/api/kols

# Get statistics
curl http://localhost:8000/api/kols/stats

# Get specific KOL
curl http://localhost:8000/api/kols/1
```

## Project Structure

```
/
├── backend/              ← FastAPI REST API
│   ├── venv/            ← Virtual environment (after setup)
│   ├── app/
│   │   ├── api/         ← Routes
│   │   ├── models/      ← Pydantic models
│   │   ├── services/    ← Business logic
│   │   └── data/        ← mockKolData.json
│   └── requirements.txt
│
├── frontend/            ← React + TypeScript
│   ├── src/
│   │   ├── components/  ← UI components
│   │   ├── hooks/       ← Custom hooks
│   │   ├── context/     ← State management
│   │   └── pages/       ← Dashboard page
│   └── package.json
│
└── README.md            ← Original technical test description
```

## Next Steps

- Read `MY_README.md` for detailed architecture documentation
- Check `backend/README.md` for API endpoint details
- Check `frontend/README.md` for component architecture
- Visit http://localhost:8000/docs for interactive API documentation
- Read `SETUP_VENV.md` for virtual environment details

---

**Need help?** Check SETUP_VENV.md for detailed virtual environment setup and troubleshooting.

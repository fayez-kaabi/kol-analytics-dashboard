# Testing Guide

Quick verification that everything works correctly.

## 1. Test Backend API

### Start Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Test Endpoints

**Health Check:**
```bash
curl http://localhost:8000/health
```
Expected: `{"status":"healthy","service":"KOL Analytics API","version":"1.0.0"}`

**Get All KOLs:**
```bash
curl http://localhost:8000/api/kols
```
Expected: JSON array with 50 KOL objects

**Get Single KOL:**
```bash
curl http://localhost:8000/api/kols/1
```
Expected: JSON object for Dr. Sarah Johnson

**Get Statistics:**
```bash
curl http://localhost:8000/api/kols/stats
```
Expected: JSON with statistics including top10_countries, avg_h_index, etc.

**Test 404:**
```bash
curl http://localhost:8000/api/kols/999
```
Expected: `{"detail":"KOL with id '999' not found"}` (404 status)

**API Documentation:**
Open in browser: http://localhost:8000/docs

## 2. Test Frontend

### Start Frontend
```bash
cd frontend
npm install
npm run dev
```

### Visual Tests

**1. Dashboard Loads:**
- Open http://localhost:5173
- Should see 4 stat cards with numbers
- Should see bar chart with country bars
- Should see insights section
- Should see KOL table with 50 rows

**2. Statistics Cards:**
- Total KOLs: 50
- Countries: Should be 26-30
- Total Publications: Should be ~4,500+
- Avg H-Index: Should be ~34

**3. Bar Chart:**
- Hover over bars → tooltip appears
- Should show United States at top (most KOLs)
- Bars should be color-coded
- X-axis labels should be angled

**4. Insights Section:**
- "Highest Research Impact" card present
- Shows KOL name and ratio
- "Data Quality Report" card present
- Shows quality issues or "No significant issues"

**5. KOL Table:**
- 50 rows visible
- Columns: Name, Country, Expertise, Publications, Citations, H-Index
- Rows show institution names below KOL names

**6. KOL Details Modal:**
- Click any table row
- Modal opens with KOL details
- Shows name, affiliation, country, city, expertise
- Shows metric cards (publications, citations, h-index)
- Shows "Citations per publication" calculation
- Click "Close" or "×" to close modal

**7. Loading States:**
- Refresh page → should see spinner briefly
- No console errors

**8. Error Handling:**
- Stop backend server
- Refresh frontend
- Should see red error message
- "Error Loading Data" with helpful message

**9. Responsive Design:**
- Resize browser window
- On mobile (<768px): cards stack vertically
- Chart remains readable
- Table scrolls horizontally if needed

## 3. TypeScript Verification

```bash
cd frontend
npx tsc --noEmit
```

Expected: No errors (strict mode passes)

## 4. Expected Console Output

### Backend Console (when running):
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Started reloader process
INFO:     Application startup complete.
```

When frontend makes requests:
```
INFO:     127.0.0.1 - "GET /api/kols HTTP/1.1" 200 OK
INFO:     127.0.0.1 - "GET /api/kols/stats HTTP/1.1" 200 OK
```

### Frontend Console (browser):
Should be **empty** or only show Vite HMR messages.

**No errors should appear.**

## 5. Data Validation Tests

### Test Data Quality Detection:

The stats endpoint should detect and report:
- Missing publications count (if any)
- Missing citations (if any)
- Missing h-index (if any)

Since mockKolData.json is complete, you should see:
```json
"data_quality_issues": [
  "No significant data quality issues detected"
]
```

### Test Citations-Per-Publication:

Check the insights section on dashboard. Should show:
- A KOL name
- A ratio (typically 40-50)
- Total citations and publications

This KOL should have the highest citations/publications ratio in the dataset.

## 6. Cross-Origin (CORS) Test

With both servers running:
1. Open browser DevTools (F12)
2. Go to Network tab
3. Refresh frontend
4. Check API requests to localhost:8000
5. Should **NOT** see CORS errors

## 7. Edge Cases

**Test empty selection:**
- Load dashboard
- Don't click any table row
- KOL details modal should NOT be visible

**Test multiple selections:**
- Click row 1 → modal opens
- Close modal
- Click row 2 → modal opens with different data

**Test rapid clicks:**
- Click different rows quickly
- Modal should update with correct data each time

## 8. Performance Checks

**API Response Times:**
- All endpoints should respond in <100ms
- Data is cached in memory (fast)

**UI Responsiveness:**
- Table should render smoothly with 50 rows
- Chart should render without lag
- Modal should open/close smoothly

## 9. Browser Compatibility

Test in:
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (14+)

## 10. Known Good Data Points

Use these to verify data integrity:

**KOL ID 1:**
- Name: Dr. Sarah Johnson
- Country: United States
- Publications: 127
- Citations: 5432
- H-Index: 42

**KOL ID 3:**
- Name: Dr. Yuki Tanaka
- Country: Japan
- Publications: 156
- Citations: 7234
- H-Index: 51

**Statistics (approximate):**
- Total KOLs: 50
- Unique Countries: ~26
- Total Publications: ~4,500
- Avg H-Index: ~34

## Troubleshooting

### "Cannot connect to backend"
- Verify backend is running on port 8000
- Check `curl http://localhost:8000/health`

### "CORS policy error"
- Backend must be on port 8000
- Frontend must be on port 5173
- Restart both if ports were changed

### "Module not found"
- Backend: `pip install -r requirements.txt`
- Frontend: `npm install`

### "Data doesn't appear"
- Check browser console for errors
- Verify `backend/app/data/mockKolData.json` exists
- Check Network tab in DevTools

### TypeScript errors
- Ensure TypeScript 5.2+ installed
- Run `npm install` to get correct versions

---

## ✅ Success Criteria

All tests pass if:
- ✅ Backend starts without errors
- ✅ Frontend starts without errors
- ✅ All API endpoints return data
- ✅ Dashboard displays correctly
- ✅ Chart is interactive
- ✅ KOL details modal works
- ✅ No console errors
- ✅ TypeScript compiles without errors
- ✅ Responsive on mobile

**If all above are ✅, the application is working correctly!**


# KOL Analytics Dashboard - Frontend

React + TypeScript dashboard for KOL analytics visualization.

## Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Technology Stack

- **React 18** - UI library
- **TypeScript 5** - Type safety (strict mode)
- **Vite 5** - Build tool and dev server
- **Tailwind CSS 3** - Utility-first styling
- **Recharts 2** - Chart library

## Project Structure

```
src/
├── api/          # API client and fetch utilities
├── types/        # TypeScript type definitions
├── context/      # React Context providers
├── hooks/        # Custom React hooks
├── components/   # Reusable UI components
├── pages/        # Page components
├── App.tsx       # Root component
└── main.tsx      # Entry point
```

## Architecture

### State Management
Uses React Context API with custom hooks for data fetching and state management.

**Context**: `KolContext`
- Provides: kols, stats, loading, error states
- Methods: fetchKols, fetchStats, refresh

**Custom Hooks**:
- `useKols()` - Fetches and manages KOL list
- `useKolStats()` - Fetches and manages statistics
- `useKolById(id)` - Fetches single KOL by ID

### Components

**StatCards** - Dashboard statistics cards  
**CountriesBarChart** - Interactive bar chart with tooltips  
**KolTable** - Sortable table with row selection  
**KolDetails** - Modal for detailed KOL view  

### Pages

**Dashboard** - Main dashboard page orchestrating all components

## API Integration

Backend API expected at: `http://localhost:8000`

Endpoints consumed:
- `GET /api/kols` - All KOLs
- `GET /api/kols/{id}` - Single KOL
- `GET /api/kols/stats` - Statistics

## TypeScript

Project uses **strict mode** with:
- No implicit any
- Strict null checks
- Strict function types
- All compiler strictness flags enabled

## Styling

Tailwind CSS with custom configuration:
- Responsive design (mobile-first)
- Custom color palette
- Utility classes for rapid development

## Development

```bash
# Development server (with HMR)
npm run dev

# Type checking
npx tsc --noEmit

# Linting
npm run lint
```

## Build

```bash
# Production build
npm run build

# Output: dist/
```

## Browser Support

Modern browsers supporting ES2020:
- Chrome/Edge 88+
- Firefox 87+
- Safari 14+




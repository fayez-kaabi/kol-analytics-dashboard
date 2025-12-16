/**
 * Main dashboard page component.
 * Orchestrates all dashboard elements: stats, charts, and KOL list.
 */

import { useKols } from '../hooks/useKols';
import { useKolStats } from '../hooks/useKolStats';
import { useKolContext } from '../context/KolContext';
import { StatCards } from '../components/StatCards';
import { CountriesBarChartD3 } from '../components/CountriesBarChartD3';
import { ExpertisePieChart } from '../components/ExpertisePieChart';
import { ScatterPlotChart } from '../components/ScatterPlotChart';
import { KolTableWithSearch } from '../components/KolTableWithSearch';
import { KolDetails } from '../components/KolDetails';

// SVG Icons for section headers
const TrophyIcon = (): JSX.Element => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
  </svg>
);

const ClipboardIcon = (): JSX.Element => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
  </svg>
);

export function Dashboard(): JSX.Element {
  const { kols, loading: kolsLoading, error: kolsError } = useKols();
  const { stats, loading: statsLoading, error: statsError } = useKolStats();
  const { selectedKolId, setSelectedKolId } = useKolContext();

  const loading = kolsLoading || statsLoading;
  const error = kolsError || statsError;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-slate-800 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-semibold tracking-tight">KOL Analytics Dashboard</h1>
          <p className="text-slate-400 mt-1 text-sm">
            Key Opinion Leaders in Medical Research
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Loading State */}
        {loading && !stats && !kols.length && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-slate-300 border-t-slate-600 mx-auto"></div>
              <p className="text-gray-500 mt-4">Loading data...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-white border border-red-200 p-6 rounded-lg shadow-sm">
            <div className="flex items-start">
              <div className="flex-shrink-0 text-red-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error Loading Data</h3>
                <p className="text-sm text-red-600 mt-1">{error}</p>
                <p className="text-xs text-gray-500 mt-2">
                  Please ensure the backend API is running at http://localhost:8000
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard Content */}
        {!error && stats && (
          <>
            {/* Statistics Cards */}
            <StatCards stats={stats} />

            {/* Visualizations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Top Countries Bar Chart (BONUS: Raw D3.js implementation) */}
              {stats.top10_countries_by_kol_count.length > 0 && (
                <CountriesBarChartD3 data={stats.top10_countries_by_kol_count} />
              )}
              
              {/* Expertise Pie Chart (BONUS: Second visualization) */}
              {kols.length > 0 && (
                <ExpertisePieChart kols={kols} />
              )}
            </div>

            {/* Scatter Plot (BONUS: Third visualization) */}
            {kols.length > 0 && (
              <ScatterPlotChart kols={kols} />
            )}

            {/* Insights Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 mt-8">
              {/* Highest Impact KOL */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="text-slate-500"><TrophyIcon /></span>
                  Highest Research Impact
                </h3>
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                  <p className="font-medium text-gray-800">
                    {stats.highest_citations_per_publication_kol.name}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Citations per publication:{' '}
                    <span className="font-semibold text-slate-700">
                      {stats.highest_citations_per_publication_kol.ratio.toFixed(2)}
                    </span>
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {stats.highest_citations_per_publication_kol.citations.toLocaleString()}{' '}
                    citations / {stats.highest_citations_per_publication_kol.publications_count}{' '}
                    publications
                  </p>
                  <p className="text-xs text-gray-500 mt-3">
                    This KOL's work receives exceptional attention, indicating
                    highly influential research in their field.
                  </p>
                </div>
              </div>

              {/* Data Quality */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="text-slate-500"><ClipboardIcon /></span>
                  Data Quality Report
                </h3>
                <div className="space-y-2">
                  {stats.data_quality_issues.map((issue, index) => (
                    <div
                      key={index}
                      className={`text-sm p-3 rounded border ${
                        issue.includes('No significant')
                          ? 'bg-green-50 text-green-700 border-green-100'
                          : 'bg-amber-50 text-amber-700 border-amber-100'
                      }`}
                    >
                      {issue.includes('No significant') ? '✓' : '!'} {issue}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* KOL Table with Search (BONUS: Advanced Filtering) */}
        {kols.length > 0 && (
          <KolTableWithSearch
            kols={kols}
            onSelectKol={setSelectedKolId}
            selectedKolId={selectedKolId}
          />
        )}

        {/* KOL Details Modal */}
        <KolDetails
          kolId={selectedKolId}
          onClose={() => setSelectedKolId(null)}
        />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="container mx-auto px-4 py-4 text-center text-gray-400 text-xs">
          KOL Analytics Dashboard • React + TypeScript + FastAPI
        </div>
      </footer>
    </div>
  );
}

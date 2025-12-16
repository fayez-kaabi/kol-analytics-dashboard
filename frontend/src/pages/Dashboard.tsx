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

export function Dashboard(): JSX.Element {
  const { kols, loading: kolsLoading, error: kolsError } = useKols();
  const { stats, loading: statsLoading, error: statsError } = useKolStats();
  const { selectedKolId, setSelectedKolId } = useKolContext();

  const loading = kolsLoading || statsLoading;
  const error = kolsError || statsError;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">KOL Analytics Dashboard</h1>
          <p className="text-blue-100 mt-2">
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
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-4 text-lg">Loading data...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg shadow-md">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <span className="text-2xl">⚠️</span>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-semibold text-red-800">
                  Error Loading Data
                </h3>
                <p className="text-red-700 mt-2">{error}</p>
                <p className="text-sm text-red-600 mt-2">
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Highest Impact KOL */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  🏆 Highest Research Impact
                </h3>
                <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg p-4">
                  <p className="font-semibold text-gray-800 text-lg">
                    {stats.highest_citations_per_publication_kol.name}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Citations per publication:{' '}
                    <span className="font-bold text-amber-700">
                      {stats.highest_citations_per_publication_kol.ratio.toFixed(2)}
                    </span>
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {stats.highest_citations_per_publication_kol.citations.toLocaleString()}{' '}
                    citations /{' '}
                    {stats.highest_citations_per_publication_kol.publications_count}{' '}
                    publications
                  </p>
                  <p className="text-xs text-gray-600 mt-3 italic">
                    This KOL's work receives exceptional attention, indicating
                    highly influential research in their field.
                  </p>
                </div>
              </div>

              {/* Data Quality */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  🔍 Data Quality Report
                </h3>
                <div className="space-y-2">
                  {stats.data_quality_issues.map((issue, index) => (
                    <div
                      key={index}
                      className={`text-sm p-3 rounded ${
                        issue.includes('No significant')
                          ? 'bg-green-50 text-green-800'
                          : 'bg-yellow-50 text-yellow-800'
                      }`}
                    >
                      {issue.includes('No significant') ? '✓' : '⚠'} {issue}
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
        <div className="container mx-auto px-4 py-6 text-center text-gray-600 text-sm">
          <p>KOL Analytics Dashboard • Built with React, TypeScript, and FastAPI</p>
        </div>
      </footer>
    </div>
  );
}


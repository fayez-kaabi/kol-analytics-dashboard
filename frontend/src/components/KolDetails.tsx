/**
 * Detailed view component for a single KOL.
 * Fetches and displays comprehensive information.
 */

import { useKolById } from '../hooks/useKolById';

interface KolDetailsProps {
  kolId: string | null;
  onClose: () => void;
}

export function KolDetails({ kolId, onClose }: KolDetailsProps): JSX.Element | null {
  const { kol, loading, error } = useKolById(kolId);

  if (!kolId) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">KOL Details</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors text-2xl font-bold"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
              <p className="font-semibold">Error loading KOL details</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          )}

          {kol && !loading && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">{kol.name}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoItem label="Affiliation" value={kol.affiliation} />
                  <InfoItem label="Country" value={kol.country} />
                  <InfoItem label="City" value={kol.city} />
                  <InfoItem label="Expertise Area" value={kol.expertiseArea} />
                </div>
              </div>

              {/* Metrics */}
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-3">
                  Research Metrics
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <MetricCard
                    label="Publications"
                    value={kol.publicationsCount ?? 'N/A'}
                    icon="📚"
                    color="bg-blue-500"
                  />
                  <MetricCard
                    label="Citations"
                    value={kol.citations?.toLocaleString() ?? 'N/A'}
                    icon="📝"
                    color="bg-green-500"
                  />
                  <MetricCard
                    label="H-Index"
                    value={kol.hIndex ?? 'N/A'}
                    icon="📊"
                    color="bg-purple-500"
                  />
                </div>
              </div>

              {/* Calculated Impact */}
              {kol.publicationsCount && kol.publicationsCount > 0 && kol.citations && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">
                    Impact Analysis
                  </h4>
                  <p className="text-sm text-gray-600">
                    Citations per publication:{' '}
                    <span className="font-bold text-blue-600">
                      {(kol.citations / kol.publicationsCount).toFixed(2)}
                    </span>
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    This metric indicates the average impact of each publication.
                    Higher values suggest more influential research.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

interface InfoItemProps {
  label: string;
  value: string | number;
}

function InfoItem({ label, value }: InfoItemProps): JSX.Element {
  return (
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-base text-gray-900 mt-1">{value}</p>
    </div>
  );
}

interface MetricCardProps {
  label: string;
  value: string | number;
  icon: string;
  color: string;
}

function MetricCard({ label, value, icon, color }: MetricCardProps): JSX.Element {
  return (
    <div className={`${color} text-white rounded-lg p-4 text-center`}>
      <div className="text-3xl mb-2">{icon}</div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm opacity-90 mt-1">{label}</p>
    </div>
  );
}




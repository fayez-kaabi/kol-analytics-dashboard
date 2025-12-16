/**
 * Table component displaying list of KOLs.
 * Supports row selection for viewing details.
 */

import type { KOL } from '../types/kol';

interface KolTableProps {
  kols: KOL[];
  onSelectKol: (id: string) => void;
  selectedKolId: string | null;
}

export function KolTable({ kols, onSelectKol, selectedKolId }: KolTableProps): JSX.Element {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800">KOL Directory</h2>
        <p className="text-sm text-gray-600 mt-1">
          Click on a row to view detailed information
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Country
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Expertise
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Publications
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Citations
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                H-Index
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {kols.map((kol) => (
              <tr
                key={kol.id}
                onClick={() => onSelectKol(kol.id)}
                className={`cursor-pointer transition-colors ${
                  selectedKolId === kol.id
                    ? 'bg-blue-50 hover:bg-blue-100'
                    : 'hover:bg-gray-50'
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{kol.name}</div>
                  <div className="text-sm text-gray-500 truncate max-w-xs">
                    {kol.affiliation}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {kol.country}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {kol.expertiseArea}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  {kol.publicationsCount ?? 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  {kol.citations?.toLocaleString() ?? 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  {kol.hIndex ?? 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {kols.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No KOLs found
        </div>
      )}
    </div>
  );
}




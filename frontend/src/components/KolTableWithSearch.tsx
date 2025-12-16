/**
 * Enhanced KOL table with search and filtering capabilities.
 * BONUS FEATURE: Advanced filtering
 */

import { useState, useMemo } from 'react';
import type { KOL } from '../types/kol';

interface KolTableWithSearchProps {
  kols: KOL[];
  onSelectKol: (id: string) => void;
  selectedKolId: string | null;
}

export function KolTableWithSearch({ 
  kols, 
  onSelectKol, 
  selectedKolId 
}: KolTableWithSearchProps): JSX.Element {
  const [searchTerm, setSearchTerm] = useState('');
  const [countryFilter, setCountryFilter] = useState<string>('');
  const [expertiseFilter, setExpertiseFilter] = useState<string>('');

  // Get unique countries and expertise areas for filters
  const uniqueCountries = useMemo(() => {
    const countries = new Set(kols.map(kol => kol.country));
    return Array.from(countries).sort();
  }, [kols]);

  const uniqueExpertiseAreas = useMemo(() => {
    const areas = new Set(kols.map(kol => kol.expertiseArea));
    return Array.from(areas).sort();
  }, [kols]);

  // Filter KOLs based on search and filters
  const filteredKols = useMemo(() => {
    return kols.filter(kol => {
      // Search filter (name, affiliation, country, expertise)
      const matchesSearch = searchTerm === '' || 
        kol.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        kol.affiliation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        kol.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        kol.expertiseArea.toLowerCase().includes(searchTerm.toLowerCase());

      // Country filter
      const matchesCountry = countryFilter === '' || kol.country === countryFilter;

      // Expertise filter
      const matchesExpertise = expertiseFilter === '' || kol.expertiseArea === expertiseFilter;

      return matchesSearch && matchesCountry && matchesExpertise;
    });
  }, [kols, searchTerm, countryFilter, expertiseFilter]);

  const clearFilters = (): void => {
    setSearchTerm('');
    setCountryFilter('');
    setExpertiseFilter('');
  };

  const hasActiveFilters = searchTerm !== '' || countryFilter !== '' || expertiseFilter !== '';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header with Search and Filters */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">KOL Directory</h2>
            <p className="text-sm text-gray-600 mt-1">
              {filteredKols.length} of {kols.length} KOLs
              {hasActiveFilters && ' (filtered)'}
            </p>
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Search and Filter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name, affiliation, country..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>

          {/* Country Filter */}
          <select
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Countries</option>
            {uniqueCountries.map(country => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>

          {/* Expertise Filter */}
          <select
            value={expertiseFilter}
            onChange={(e) => setExpertiseFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Expertise Areas</option>
            {uniqueExpertiseAreas.map(area => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
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
            {filteredKols.map((kol) => (
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

      {/* Empty State */}
      {filteredKols.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No KOLs found</p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="mt-4 px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}




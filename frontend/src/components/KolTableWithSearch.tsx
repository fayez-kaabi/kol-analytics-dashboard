/**
 * Enhanced KOL table with search, filtering, and pagination.
 * BONUS FEATURE: Advanced filtering + Pagination
 */

import { useState, useMemo, useEffect } from 'react';
import type { KOL } from '../types/kol';

// Custom hook for debouncing values (better performance on search)
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer); // Cleanup on value change
  }, [value, delay]);

  return debouncedValue;
}

const ITEMS_PER_PAGE = 10;

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
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [countryFilter, setCountryFilter] = useState<string>('');
  const [expertiseFilter, setExpertiseFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);

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
      const matchesSearch = debouncedSearchTerm === '' || 
        kol.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        kol.affiliation.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        kol.country.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        kol.expertiseArea.toLowerCase().includes(debouncedSearchTerm.toLowerCase());

      const matchesCountry = countryFilter === '' || kol.country === countryFilter;
      const matchesExpertise = expertiseFilter === '' || kol.expertiseArea === expertiseFilter;

      return matchesSearch && matchesCountry && matchesExpertise;
    });
  }, [kols, debouncedSearchTerm, countryFilter, expertiseFilter]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, countryFilter, expertiseFilter]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredKols.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedKols = filteredKols.slice(startIndex, endIndex);

  const clearFilters = (): void => {
    setSearchTerm('');
    setCountryFilter('');
    setExpertiseFilter('');
    setCurrentPage(1);
  };

  const hasActiveFilters = debouncedSearchTerm !== '' || countryFilter !== '' || expertiseFilter !== '';

  // Generate page numbers to display
  const getPageNumbers = (): number[] => {
    const pages: number[] = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push(-1); // ellipsis
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push(-1);
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push(-1);
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push(-1);
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header with Search and Filters */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">KOL Directory</h2>
            <p className="text-sm text-gray-600 mt-1">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredKols.length)} of {filteredKols.length} KOLs
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

          <select
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Countries</option>
            {uniqueCountries.map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>

          <select
            value={expertiseFilter}
            onChange={(e) => setExpertiseFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Expertise Areas</option>
            {uniqueExpertiseAreas.map(area => (
              <option key={area} value={area}>{area}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expertise</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Publications</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Citations</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">H-Index</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedKols.map((kol) => (
              <tr
                key={kol.id}
                onClick={() => onSelectKol(kol.id)}
                className={`cursor-pointer transition-colors ${
                  selectedKolId === kol.id ? 'bg-blue-50 hover:bg-blue-100' : 'hover:bg-gray-50'
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{kol.name}</div>
                  <div className="text-sm text-gray-500 truncate max-w-xs">{kol.affiliation}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{kol.country}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{kol.expertiseArea}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{kol.publicationsCount ?? 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{kol.citations?.toLocaleString() ?? 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{kol.hIndex ?? 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center gap-1">
            {/* Previous Button */}
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Prev
            </button>

            {/* Page Numbers */}
            {getPageNumbers().map((page, idx) => (
              page === -1 ? (
                <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">...</span>
              ) : (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              )
            ))}

            {/* Next Button */}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>
        </div>
      )}

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

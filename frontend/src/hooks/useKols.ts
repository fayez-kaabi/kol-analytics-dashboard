/**
 * Custom hook for fetching and managing KOL list data.
 * Re-fetches when data source changes.
 */

import { useEffect } from 'react';
import { useKolContext } from '../context/KolContext';
import type { KOL } from '../types/kol';

interface UseKolsReturn {
  kols: KOL[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useKols(): UseKolsReturn {
  const { kols, loading, error, fetchKols, refresh, dataSource } = useKolContext();

  useEffect(() => {
    // Fetch KOLs on mount and when data source changes
    fetchKols();
  }, [fetchKols, dataSource]);

  return {
    kols,
    loading,
    error,
    refresh,
  };
}

/**
 * Custom hook for fetching and managing KOL list data.
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
  const { kols, loading, error, fetchKols, refresh } = useKolContext();

  useEffect(() => {
    // Fetch KOLs on mount if not already loaded
    if (kols.length === 0 && !loading && !error) {
      fetchKols();
    }
  }, [kols.length, loading, error, fetchKols]);

  return {
    kols,
    loading,
    error,
    refresh,
  };
}




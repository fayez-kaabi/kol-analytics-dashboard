/**
 * Custom hook for fetching and managing KOL statistics.
 */

import { useEffect } from 'react';
import { useKolContext } from '../context/KolContext';
import type { KOLStats } from '../types/kol';

interface UseKolStatsReturn {
  stats: KOLStats | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useKolStats(): UseKolStatsReturn {
  const { stats, loading, error, fetchStats, refresh } = useKolContext();

  useEffect(() => {
    // Fetch stats on mount if not already loaded
    if (stats === null && !loading && !error) {
      fetchStats();
    }
  }, [stats, loading, error, fetchStats]);

  return {
    stats,
    loading,
    error,
    refresh,
  };
}




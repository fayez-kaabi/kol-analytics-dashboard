/**
 * Custom hook for fetching and managing KOL statistics.
 * Re-fetches when data source changes.
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
  const { stats, loading, error, fetchStats, refresh, dataSource } = useKolContext();

  useEffect(() => {
    // Fetch stats on mount and when data source changes
    fetchStats();
  }, [fetchStats, dataSource]);

  return {
    stats,
    loading,
    error,
    refresh,
  };
}

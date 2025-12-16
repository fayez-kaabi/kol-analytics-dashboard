/**
 * Global context for KOL data management.
 * Provides centralized state and data fetching logic.
 */

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { KOL, KOLStats } from '../types/kol';
import { getAllKOLs, getKOLStats } from '../api/client';
import { APIClientError } from '../api/client';

interface KolContextState {
  kols: KOL[];
  stats: KOLStats | null;
  selectedKolId: string | null;
  loading: boolean;
  error: string | null;
  fetchKols: () => Promise<void>;
  fetchStats: () => Promise<void>;
  refresh: () => Promise<void>;
  setSelectedKolId: (id: string | null) => void;
}

const KolContext = createContext<KolContextState | undefined>(undefined);

interface KolProviderProps {
  children: ReactNode;
}

export function KolProvider({ children }: KolProviderProps): JSX.Element {
  const [kols, setKols] = useState<KOL[]>([]);
  const [stats, setStats] = useState<KOLStats | null>(null);
  const [selectedKolId, setSelectedKolId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchKols = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllKOLs();
      setKols(data);
    } catch (err) {
      const errorMessage =
        err instanceof APIClientError
          ? err.detail || err.message
          : 'Failed to fetch KOLs';
      setError(errorMessage);
      console.error('Error fetching KOLs:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getKOLStats();
      setStats(data);
    } catch (err) {
      const errorMessage =
        err instanceof APIClientError
          ? err.detail || err.message
          : 'Failed to fetch statistics';
      setError(errorMessage);
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    await Promise.all([fetchKols(), fetchStats()]);
  }, [fetchKols, fetchStats]);

  const value: KolContextState = {
    kols,
    stats,
    selectedKolId,
    loading,
    error,
    fetchKols,
    fetchStats,
    refresh,
    setSelectedKolId,
  };

  return <KolContext.Provider value={value}>{children}</KolContext.Provider>;
}

/**
 * Custom hook to access KOL context
 */
export function useKolContext(): KolContextState {
  const context = useContext(KolContext);
  if (context === undefined) {
    throw new Error('useKolContext must be used within a KolProvider');
  }
  return context;
}


/**
 * Global context for KOL data management.
 * Provides centralized state and data fetching logic.
 * 
 * BONUS: Supports toggling between Excel (real) and Mock (sample) data.
 */

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { KOL, KOLStats } from '../types/kol';
import { getAllKOLs, getKOLStats, getDataSources, APIClientError } from '../api/client';
import type { DataSource, DataSourceInfo } from '../api/client';

interface KolContextState {
  kols: KOL[];
  stats: KOLStats | null;
  selectedKolId: string | null;
  loading: boolean;
  error: string | null;
  dataSource: DataSource;
  dataSources: DataSourceInfo[];
  fetchKols: () => Promise<void>;
  fetchStats: () => Promise<void>;
  refresh: () => Promise<void>;
  setSelectedKolId: (id: string | null) => void;
  setDataSource: (source: DataSource) => void;
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
  const [dataSource, setDataSourceState] = useState<DataSource>('excel');
  const [dataSources, setDataSources] = useState<DataSourceInfo[]>([]);

  const fetchKols = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllKOLs(dataSource);
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
  }, [dataSource]);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getKOLStats(dataSource);
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
  }, [dataSource]);

  const fetchDataSources = useCallback(async () => {
    try {
      const response = await getDataSources();
      setDataSources(response.sources);
    } catch (err) {
      console.error('Error fetching data sources:', err);
    }
  }, []);

  const refresh = useCallback(async () => {
    await Promise.all([fetchKols(), fetchStats(), fetchDataSources()]);
  }, [fetchKols, fetchStats, fetchDataSources]);

  const setDataSource = useCallback((source: DataSource) => {
    setDataSourceState(source);
    setSelectedKolId(null); // Clear selection when switching sources
  }, []);

  const value: KolContextState = {
    kols,
    stats,
    selectedKolId,
    loading,
    error,
    dataSource,
    dataSources,
    fetchKols,
    fetchStats,
    refresh,
    setSelectedKolId,
    setDataSource,
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

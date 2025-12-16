/**
 * Custom hook for fetching a single KOL by ID.
 * Uses the current data source from context.
 */

import { useState, useEffect, useCallback } from 'react';
import { getKOLById, APIClientError } from '../api/client';
import { useKolContext } from '../context/KolContext';
import type { KOL } from '../types/kol';

interface UseKolByIdReturn {
  kol: KOL | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useKolById(id: string | null): UseKolByIdReturn {
  const [kol, setKol] = useState<KOL | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { dataSource } = useKolContext();

  const fetchKol = useCallback(async (kolId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getKOLById(kolId, dataSource);
      setKol(data);
    } catch (err) {
      const errorMessage =
        err instanceof APIClientError
          ? err.detail || err.message
          : 'Failed to fetch KOL details';
      setError(errorMessage);
      setKol(null);
      console.error('Error fetching KOL by ID:', err);
    } finally {
      setLoading(false);
    }
  }, [dataSource]);

  useEffect(() => {
    if (id) {
      fetchKol(id);
    } else {
      setKol(null);
      setError(null);
    }
  }, [id, fetchKol]);

  const refetch = useCallback(async () => {
    if (id) {
      await fetchKol(id);
    }
  }, [id, fetchKol]);

  return {
    kol,
    loading,
    error,
    refetch,
  };
}

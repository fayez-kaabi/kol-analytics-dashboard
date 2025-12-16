/**
 * API client for backend communication.
 * Provides typed fetch wrappers for all KOL endpoints.
 */

import type { KOL, KOLStats, APIError } from '../types/kol';

const API_BASE_URL = 'http://localhost:8000';

// Data source type - excel (real) or mock (sample)
export type DataSource = 'excel' | 'mock';

// Data source info from backend
export interface DataSourceInfo {
  id: DataSource;
  name: string;
  description: string;
  count: number;
}

export interface DataSourcesResponse {
  sources: DataSourceInfo[];
  default: DataSource;
}

/**
 * Custom error class for API errors
 */
export class APIClientError extends Error {
  constructor(
    message: string,
    public status?: number,
    public detail?: string
  ) {
    super(message);
    this.name = 'APIClientError';
  }
}

/**
 * Generic fetch wrapper with error handling
 */
async function fetchJSON<T>(endpoint: string): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);

    if (!response.ok) {
      let errorDetail = `HTTP ${response.status}: ${response.statusText}`;
      try {
        const errorData: APIError = await response.json();
        errorDetail = errorData.detail || errorDetail;
      } catch {
        // If JSON parsing fails, use default error message
      }

      throw new APIClientError(
        `Failed to fetch ${endpoint}`,
        response.status,
        errorDetail
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof APIClientError) {
      throw error;
    }

    throw new APIClientError(
      `Network error while fetching ${endpoint}: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
}

/**
 * Fetch available data sources
 */
export async function getDataSources(): Promise<DataSourcesResponse> {
  return fetchJSON<DataSourcesResponse>('/api/kols/sources');
}

/**
 * Fetch all KOLs from specified data source
 */
export async function getAllKOLs(source: DataSource = 'excel'): Promise<KOL[]> {
  return fetchJSON<KOL[]>(`/api/kols?source=${source}`);
}

/**
 * Fetch a single KOL by ID from specified data source
 */
export async function getKOLById(id: string, source: DataSource = 'excel'): Promise<KOL> {
  return fetchJSON<KOL>(`/api/kols/${id}?source=${source}`);
}

/**
 * Fetch comprehensive KOL statistics from specified data source
 */
export async function getKOLStats(source: DataSource = 'excel'): Promise<KOLStats> {
  return fetchJSON<KOLStats>(`/api/kols/stats?source=${source}`);
}

/**
 * Health check endpoint
 */
export async function checkHealth(): Promise<{ status: string }> {
  return fetchJSON<{ status: string }>('/health');
}

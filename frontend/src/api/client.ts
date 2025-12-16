/**
 * API client for backend communication.
 * Provides typed fetch wrappers for all KOL endpoints.
 */

import type { KOL, KOLStats, APIError } from '../types/kol';

const API_BASE_URL = 'http://localhost:8000';

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
      // Try to parse error detail from response
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

    // Network or other errors
    throw new APIClientError(
      `Network error while fetching ${endpoint}: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
}

/**
 * Fetch all KOLs
 */
export async function getAllKOLs(): Promise<KOL[]> {
  return fetchJSON<KOL[]>('/api/kols');
}

/**
 * Fetch a single KOL by ID
 */
export async function getKOLById(id: string): Promise<KOL> {
  return fetchJSON<KOL>(`/api/kols/${id}`);
}

/**
 * Fetch comprehensive KOL statistics
 */
export async function getKOLStats(): Promise<KOLStats> {
  return fetchJSON<KOLStats>('/api/kols/stats');
}

/**
 * Health check endpoint
 */
export async function checkHealth(): Promise<{ status: string }> {
  return fetchJSON<{ status: string }>('/health');
}


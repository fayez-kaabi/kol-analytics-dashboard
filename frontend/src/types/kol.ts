/**
 * Type definitions for KOL (Key Opinion Leader) data.
 * Mirrors backend Pydantic models with strict TypeScript typing.
 */

export interface KOL {
  id: string;
  name: string;
  affiliation: string;
  country: string;
  city: string;
  expertise_area: string;
  publications_count: number | null;
  h_index: number | null;
  citations: number | null;
}

export interface CountryCount {
  country: string;
  count: number;
}

export interface HighestCitationsPerPublicationKOL {
  id: string;
  name: string;
  ratio: number;
  citations: number;
  publications_count: number;
}

export interface KOLStats {
  total_kols: number;
  unique_countries: number;
  total_publications: number;
  avg_h_index: number;
  top10_countries_by_kol_count: CountryCount[];
  highest_citations_per_publication_kol: HighestCitationsPerPublicationKOL;
  data_quality_issues: string[];
}

/**
 * API error response structure
 */
export interface APIError {
  detail: string;
}


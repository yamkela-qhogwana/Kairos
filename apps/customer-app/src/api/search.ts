import { API_BASE_URL } from './config';
import { Product } from './products';

export type SearchResult = {
  interpretation: string | null;
  products: Product[];
};

export type SearchSuggestion = {
  text: string;
  type: 'category' | 'product';
};

export async function fetchSearch(query: string): Promise<SearchResult> {
  const response = await fetch(`${API_BASE_URL}/api/search?q=${encodeURIComponent(query)}`);
  if (!response.ok) {
    throw new Error('Search failed.');
  }
  return response.json();
}

// Fast, AI-free typeahead for live suggestions while the user is typing —
// every suggestion is a real category name or real product title.
export async function fetchSuggestions(query: string): Promise<SearchSuggestion[]> {
  const response = await fetch(`${API_BASE_URL}/api/search/suggest?q=${encodeURIComponent(query)}`);
  if (!response.ok) {
    throw new Error('Suggestions failed.');
  }
  return response.json();
}

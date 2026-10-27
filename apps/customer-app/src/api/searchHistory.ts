import * as SecureStore from 'expo-secure-store';

const RECENT_SEARCHES_KEY = 'kairos_recent_searches';
const MAX_RECENT = 6;

export async function getRecentSearches(): Promise<string[]> {
  const raw = await SecureStore.getItemAsync(RECENT_SEARCHES_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function addRecentSearch(term: string): Promise<string[]> {
  const trimmed = term.trim();
  const existing = await getRecentSearches();
  if (!trimmed) return existing;

  const next = [trimmed, ...existing.filter((t) => t.toLowerCase() !== trimmed.toLowerCase())].slice(
    0,
    MAX_RECENT,
  );
  await SecureStore.setItemAsync(RECENT_SEARCHES_KEY, JSON.stringify(next));
  return next;
}

export async function removeRecentSearch(term: string): Promise<string[]> {
  const existing = await getRecentSearches();
  const next = existing.filter((t) => t.toLowerCase() !== term.toLowerCase());
  await SecureStore.setItemAsync(RECENT_SEARCHES_KEY, JSON.stringify(next));
  return next;
}

export async function clearRecentSearches(): Promise<string[]> {
  await SecureStore.deleteItemAsync(RECENT_SEARCHES_KEY);
  return [];
}

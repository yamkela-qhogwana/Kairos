import { API_BASE_URL } from './config';

export type Collection = {
  collectionId: number;
  slug: string;
  name: string;
  icon: string;
};

export async function fetchCollections(): Promise<Collection[]> {
  const response = await fetch(`${API_BASE_URL}/api/collections`);
  if (!response.ok) {
    throw new Error('Failed to load collections.');
  }
  return response.json();
}

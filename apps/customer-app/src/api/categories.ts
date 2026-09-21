import { API_BASE_URL } from './config';

export type Category = {
  categoryId: number;
  slug: string;
  name: string;
};

export async function fetchCategories(): Promise<Category[]> {
  const response = await fetch(`${API_BASE_URL}/api/categories`);
  if (!response.ok) {
    throw new Error('Failed to load categories.');
  }
  return response.json();
}

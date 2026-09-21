import { API_BASE_URL } from './config';

export type Product = {
  productId: number;
  title: string;
  description: string | null;
  categoryId: number;
  categorySlug: string;
  categoryName: string;
  originalPrice: number;
  salePrice: number | null;
  discountPercentage: number | null;
  isOnSale: boolean;
  rating: number;
  images: string[];
  storeId: number;
  storeName: string;
};

export async function fetchProducts(categorySlug?: string): Promise<Product[]> {
  const url = categorySlug
    ? `${API_BASE_URL}/api/products?category=${encodeURIComponent(categorySlug)}`
    : `${API_BASE_URL}/api/products`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to load products.');
  }
  return response.json();
}

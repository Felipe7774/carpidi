import { api } from './api';

export type Category = { id: string; name: string; slug: string };
export type ProductVariant = {
  id: string;
  sku: string;
  size: string | null;
  color: string | null;
  price: number;
  available: number;
};
export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  basePrice: number;
  active: boolean;
  category: Category;
  variants: ProductVariant[];
};
export type ProductPage = { content: Product[]; totalElements: number };
export type CatalogFilters = { q?: string; category?: string; size?: string; color?: string };

export async function getCategories(): Promise<Category[]> {
  const { data } = await api.get<Category[]>('/categories');
  return data;
}

export async function getProducts(filters: CatalogFilters): Promise<ProductPage> {
  const { data } = await api.get<ProductPage>('/products', {
    params: { ...filters, page: 0, pageSize: 20 },
  });
  return data;
}

export async function getProduct(id: string): Promise<Product> {
  const { data } = await api.get<Product>(`/products/${id}`);
  return data;
}
export async function createProduct(payload: { categoryId: string; slug: string; name: string; description: string; basePrice: number; active: boolean; variants: Array<{ sku: string; size: string; color: string; price: number; available: number }> }) { const { data } = await api.post<Product>('/products', payload); return data; }
export async function deactivateProduct(id: string) { await api.delete(`/products/${id}`); }

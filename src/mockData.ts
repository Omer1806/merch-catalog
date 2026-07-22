import type { Product } from './types/product';

export type ArtistProduct = Product;

// Products are managed in Supabase. Keep this export for the optional import script.
export const MOCK_PRODUCTS: ArtistProduct[] = [];

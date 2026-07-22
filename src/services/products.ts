import { supabase } from "../lib/supabase";
import type { Product } from "../types/product";

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*");

  if (error) throw new Error(error.message);

  return data as Product[];
}

export async function addProduct(product: Product) {
  const { error } = await supabase
    .from("products")
    .insert([product]);

  if (error) throw new Error(error.message);
}

export async function updateProduct(product: Product) {
  const { error } = await supabase
    .from("products")
    .update(product)
    .eq("id", product.id);

  if (error) throw new Error(error.message);
}

export async function deleteProduct(id: string) {
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
}
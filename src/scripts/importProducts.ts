import { supabase } from "./supabaseScript";
import { MOCK_PRODUCTS } from "../mockData";

export async function importProducts() {
  const { error } = await supabase
    .from("products")
    .insert(MOCK_PRODUCTS);

  if (error) {
    console.error(error);
    return;
  }

  console.log("✅ Імпорт завершено!");
}

importProducts();
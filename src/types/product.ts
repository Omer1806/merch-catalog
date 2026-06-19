export interface Product {
  id: string;          // Унікальний ідентифікатор (наприклад, "prod-1")
  title: string;       // Назва товару (наприклад, "Худі з принтом")
  price: number;       // Ціна товару (наприклад, 1200)
  image: string;       // Посилання на зображення
  category: string;    // Категорія (наприклад, "одяг", "аксесуари")
  description: string; // Короткий опис для картки товару
}
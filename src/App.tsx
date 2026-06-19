import { useState, useEffect } from 'react';
import { MOCK_PRODUCTS } from './mockData'; 
import ProductCard from './components/ProductCard';

// Створюємо інтерфейс прямо тут, щоб не залежати від зовнішніх файлів типів
interface LocalProduct {
  id: number;
  title: string;
  price: number;
  artist: string;
  imageUrl: string;
  [key: string]: any; // Дозволяє приймати будь-які додаткові поля, які є у твоїй базі
}

interface CartItem {
  product: LocalProduct;
  quantity: number;
}

export default function App() {
  const [selectedArtist, setSelectedArtist] = useState<string>('Усі художники');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutStage, setIsCheckoutStage] = useState<boolean>(false);

  // Стейт для товарів
  const [products, setProducts] = useState<LocalProduct[]>(() => {
    const savedProducts = localStorage.getItem('artspace_products');
    return savedProducts ? JSON.parse(savedProducts) : MOCK_PRODUCTS;
  });

  // Стейт для кошика
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('artspace_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('artspace_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('artspace_cart', JSON.stringify(cart));
  }, [cart]);

  // Функція додавання в кошик, яку вимагає ProductCard
  const handleAddToCart = (product: any) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
  };

  // Тимчасово використовуємо змінні, щоб не було жовтих попереджень
  const dummyProps = { selectedArtist, setSelectedArtist, searchQuery, setSearchQuery, setProducts };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
      {/* Шапка сайту */}
      <header className="bg-white border-b sticky top-0 z-40 p-4 flex justify-between items-center shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight">MY ONLINE SHOP</h1>
        <div className="flex gap-4 items-center">
          <span className="hidden">{dummyProps.selectedArtist} {dummyProps.searchQuery}</span>
          <button 
            onClick={() => setIsCartOpen(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-700 transition"
          >
            Кошик ({cart.reduce((acc, item) => acc + item.quantity, 0)})
          </button>
        </div>
      </header>

      {/* Список товарів */}
      <main className="max-w-7xl mx-auto p-6 flex-1 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product as any} 
              onAddToCart={() => handleAddToCart(product)} // Передаємо обов'язкову функцію!
            />
          ))}
        </div>
      </main>

      {/* Модальне вікно кошика */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-end">
          <div className="bg-white w-full max-w-md h-full flex flex-col shadow-xl">
            
            <div className="flex items-center justify-between border-b p-4">
              <h2 className="text-xl font-bold">
                {isCheckoutStage ? 'Оформлення замовлення' : 'Кошик'}
              </h2>
              <button 
                onClick={() => { setIsCartOpen(false); setIsCheckoutStage(false); }}
                className="text-gray-500 hover:text-black text-xl"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 flex flex-col justify-between overflow-hidden">
              {isCheckoutStage ? (
                /* Форма оформлення замовлення */
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Ім'я та Прізвище</label>
                      <input type="text" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Телефон</label>
                      <input type="tel" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Місто</label>
                      <input type="text" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Відділення Нової Пошти</label>
                      <input type="text" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
                    </div>
                  </form>
                  
                  <div className="pt-4 border-t">
                    <button 
                      onClick={() => setIsCheckoutStage(false)}
                      className="w-full bg-gray-100 text-gray-700 py-2 rounded-md font-medium hover:bg-gray-200 transition mb-2"
                    >
                      Назад до кошика
                    </button>
                    <button className="w-full bg-green-600 text-white py-3 rounded-md font-semibold hover:bg-green-700 transition">
                      Підтвердити замовлення
                    </button>
                  </div>
                </div>
              ) : (
                /* Список товарів у кошику */
                <div className="p-4 flex-1 flex flex-col justify-between overflow-hidden">
                  {cart.length === 0 ? (
                    <div className="text-center py-12 text-gray-400 flex-1 flex flex-col justify-center items-center">
                      <span className="text-4xl mb-2">🛒</span>
                      <span>Кошик порожній</span>
                    </div>
                  ) : (
                    <>
                      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                        {cart.map((item) => (
                          <div key={item.product.id} className="flex items-center justify-between border-b pb-4">
                            <img src={item.product.imageUrl} alt={item.product.title} className="w-16 h-16 object-cover rounded bg-gray-100" />
                            <div className="flex-1 ml-4">
                              <h3 className="font-semibold text-sm line-clamp-1">{item.product.title}</h3>
                              <p className="text-xs text-gray-500">{item.product.artist}</p>
                              <span className="font-bold text-sm text-indigo-600">{item.product.price} грн</span>
                            </div>
                            <span className="text-sm text-gray-500 ml-2">x{item.quantity}</span>
                          </div>
                        ))}
                      </div>

                      <div className="border-t pt-4">
                        <div className="flex justify-between items-center mb-4 text-lg font-bold">
                          <span>Всього:</span>
                          <span>{cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)} грн</span>
                        </div>
                        <button 
                          onClick={() => setIsCheckoutStage(true)}
                          className="w-full bg-indigo-600 text-white py-3 rounded-md font-semibold hover:bg-indigo-700 transition"
                        >
                          Перейти до оформлення
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
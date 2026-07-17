import { supabase } from './lib/supabase';
import { useState, useEffect } from 'react';
import { MOCK_PRODUCTS } from './mockData';
import ProductCard from './components/ProductCard';
import AdminPanel from './components/AdminPanel';
import { AuthorCard } from './components/AuthorCard';
import type { Author } from './components/AuthorCard';
import type { ArtistProduct } from './mockData';
import { AUTHORS } from './authorsData';
import logo from './assets/kurisu-fixed.png';
import FloatingImageLink from "./components/FloatingImageLink";

// Константи
const TELEGRAM_TOKEN = '8775088762:AAGamPabFInSAulH9dPH7oTdrjYH7lQm8qU';
const TELEGRAM_CHAT_ID = '422278955';

interface CartItem {
  product: ArtistProduct;
  quantity: number;
}

interface OrderForm {
  name: string;
  phone: string;
  city: string;
  nova_poshta: string;
}

export default function App() {
  // Стан
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutStage, setIsCheckoutStage] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [orderSent, setOrderSent] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState('Всі');
  const [selectedArtist, setSelectedArtist] = useState('Всі');
  const [sortOption, setSortOption] = useState<'default' | 'price-asc' | 'price-desc' | 'newest'>('default');
  const [currentPage, setCurrentPage] = useState(1);
  const PRODUCTS_PER_PAGE = 8;

 const [products, setProducts] = useState<ArtistProduct[]>([]);
  const [authors, setAuthors] = useState<Author[]>(AUTHORS);
  const [formErrors, setFormErrors] = useState<Partial<OrderForm>>({});
  const [form, setForm] = useState<OrderForm>({
    name: '', phone: '', city: '', nova_poshta: ''
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Ефекти
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedArtist, sortOption]);
// Імпорт товарів у Supabase (тимчасово)
useEffect(() => {
  async function fetchProducts() {
    const { data, error } = await supabase
      .from("products")
      .select("*");

    if (error) {
      console.error("Помилка завантаження товарів:", error);
      return;
    }

    setProducts(data);
  }

  fetchProducts();
}, []);
  // Фільтри
  const categories = ['Всі', ...Array.from(new Set(products.map((p) => p.category)))];
  const artists = ['Всі', ...Array.from(new Set(products.map((p) => p.artist)))];

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.artist.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'Всі' || product.category === selectedCategory;
    const matchesArtist = selectedArtist === 'Всі' || product.artist === selectedArtist;

    return matchesSearch && matchesCategory && matchesArtist;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === 'price-asc') return a.price - b.price;
    if (sortOption === 'price-desc') return b.price - a.price;
    if (sortOption === 'newest') {
      return products.indexOf(b) - products.indexOf(a);
    }
    return 0;
  });

  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / PRODUCTS_PER_PAGE));
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  // Обробники
  const handleAddToCart = (product: ArtistProduct) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      return existing
        ? prev.map((i) => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)
        : [...prev, { product, quantity: 1 }];
    });
  };

  const handleIncreaseQuantity = (productId: string | number) => {
    setCart((prev) =>
      prev.map((i) =>
        i.product.id === productId ? { ...i, quantity: i.quantity + 1 } : i
      )
    );
  };

  const handleDecreaseQuantity = (productId: string | number) => {
    setCart((prev) =>
      prev.map((i) =>
        i.product.id === productId ? { ...i, quantity: Math.max(1, i.quantity - 1) } : i
      )
    );
  };

  const handleRemoveFromCart = (productId: string | number) => {
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
  };

  const closeCart = () => {
    setIsCartOpen(false);
    setIsCheckoutStage(false);
    setOrderSent(false);
  };

  useEffect(() => {
    if (!isCartOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeCart();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen]);

  // Повернення каталогу до початкового стану (клік по логотипу)
  const handleLogoClick = () => {
    setSearchQuery('');
    setSelectedCategory('Всі');
    setSelectedArtist('Всі');
    setSortOption('default');
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmitOrder = async () => {
    const errors: Partial<OrderForm> = {};
    if (!form.name.trim()) errors.name = "Введіть ім'я";
    if (!/^\+380\d{9}$/.test(form.phone)) errors.phone = 'Формат: +380XXXXXXXXX';
    if (!form.city.trim()) errors.city = 'Введіть місто';
    if (!form.nova_poshta.trim()) errors.nova_poshta = 'Введіть відділення';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSending(true);
    const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const itemsList = cart.map(i => `• ${i.product.title} x${i.quantity} — ${i.product.price * i.quantity} грн`).join('\n');
    const message = `🛒 *Замовлення!*\n\n👤 ${form.name}\n📞 ${form.phone}\n🏙 ${form.city}\n📦 ${form.nova_poshta}\n\n${itemsList}\n\n💰 *Всього: ${total} грн*`;

    try {
      const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: message, parse_mode: 'Markdown' }),
      });
      if (res.ok) {
        setOrderSent(true);
        setCart([]);
        setForm({ name: '', phone: '', city: '', nova_poshta: '' });
      }
    } catch {
      alert('Помилка мережі.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF0] text-gray-900 font-sans flex flex-col">
      <style>{`
        @keyframes modalFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes modalScaleUp { 
          from { opacity: 0; transform: scale(0.95) translateY(10px); } 
          to { opacity: 1; transform: scale(1) translateY(0); } 
        }
        @keyframes kurisuFloat {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }

  25% {
    transform: translateY(-3px) rotate(-2deg);
  }

  50% {
    transform: translateY(0px) rotate(0deg);
  }

  75% {
    transform: translateY(-2px) rotate(2deg);
  }
}
      `}</style>

      {/* Шапка */}
      <header className="bg-gradient-to-r from-[#FF4FA3] to-[#FF6FAE] py-3 px-3 sm:px-4 shadow-[0_4px_20px_rgba(255,79,163,0.35)]">
        <div className="max-w-7xl mx-auto grid grid-cols-[auto_1fr] gap-3 items-center sm:flex sm:flex-wrap sm:gap-4 sm:justify-between">
          <button
            type="button"
            onClick={handleLogoClick}
            className="flex items-center gap-3 shrink-0 cursor-pointer rounded-lg transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="На головну — скинути фільтри каталогу"
          >
            <img
              src={logo}
              alt=""
              className="w-12 h-12 rounded-full ring-2 ring-white/80 object-cover shadow-md shrink-0"
            />
            <span className="text-white font-black text-xl tracking-wide drop-shadow-[1px_1px_0px_rgba(0,0,0,0.2)] hidden sm:inline">
              KURISU.SHOP
            </span>
          </button>

          <div className="relative col-span-2 order-3 w-full sm:order-none sm:flex-1 sm:min-w-[180px] sm:max-w-md">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
            <input
              type="text"
              placeholder="Пошук..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full pl-10 pr-4 py-2.5 bg-white/95 text-black text-sm placeholder-gray-400 border-none outline-none focus:ring-2 focus:ring-white transition"
            />
          </div>

          <button
            onClick={() => setIsCartOpen(true)}
            className="justify-self-end flex items-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white border border-white/40 px-3 sm:px-5 py-2.5 rounded-full font-bold text-sm transition"
          >
            🛍 Кошик <span className="bg-white text-[#FF4FA3] rounded-full px-2 py-0.5 text-xs font-black">{cart.reduce((a, i) => a + i.quantity, 0)}</span>
          </button>
        </div>
      </header>

      {/* Hero-банер */}
      <section className="bg-gradient-to-r from-[#FFD9C2] to-[#FFB37B] border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-7 sm:py-10 text-center sm:text-left">
          <h2 className="text-2xl sm:text-4xl font-black text-black drop-shadow-[2px_2px_0px_rgba(255,255,255,0.6)]">
            Авторський мерч від українських художників
          </h2>
          <p className="mt-2 text-sm sm:text-base font-bold text-gray-800 max-w-2xl mx-auto sm:mx-0">
            Стікери, набори та фентезійні ілюстрації — кожна робота створена з любов'ю та підтримує наших творців.
          </p>
        </div>
      </section>

      {/* Блок категорій та авторів */}
      <div className="bg-white border-b-2 border-black py-4 px-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex flex-col gap-3 flex-1">
            <div className="flex flex-nowrap overflow-x-auto items-center gap-2 justify-start lg:justify-start w-full pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <span className="text-xs font-black uppercase tracking-wider text-gray-500 mr-1">Категорії:</span>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold border-2 border-black transition whitespace-nowrap ${
                    selectedCategory === category
                      ? 'bg-[#FF4FA3] text-white shadow-[2px_2px_0px_rgba(0,0,0,1)]'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="flex flex-nowrap overflow-x-auto items-center gap-2 justify-start lg:justify-start border-t border-dashed border-gray-300 pt-3 w-full pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <span className="text-xs font-black uppercase tracking-wider text-gray-500 mr-1">Автори:</span>
              {artists.map((artist) => (
                <button
                  key={artist}
                  onClick={() => setSelectedArtist(artist)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold border-2 border-black transition whitespace-nowrap ${
                    selectedArtist === artist
                      ? 'bg-[#FFB37B] text-black shadow-[2px_2px_0px_rgba(0,0,0,1)]'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {artist}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col min-[380px]:flex-row items-center justify-center gap-2 shrink-0 border-t border-dashed border-gray-300 pt-3 lg:border-t-0 lg:pt-0 lg:border-l-2 lg:border-dashed lg:border-gray-300 lg:pl-6">
            <span className="text-xs font-black uppercase tracking-wider text-gray-500 whitespace-nowrap">Сортування:</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as typeof sortOption)}
              className="px-3 py-1.5 rounded-full text-xs font-bold border-2 border-black bg-gray-50 text-gray-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FF4FA3]"
            >
              <option value="default">За замовчуванням</option>
              <option value="newest">Спочатку нові</option>
              <option value="price-asc">Дешевші спочатку</option>
              <option value="price-desc">Дорожчі спочатку</option>
            </select>
          </div>
        </div>
      </div>

      {/* Секція карток авторів */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full">
        <h2 className="text-xl sm:text-3xl font-black tracking-wide sm:tracking-wider text-black mb-6 sm:mb-8 uppercase bg-[#FFB37B] inline-block px-3 sm:px-4 py-1 border-2 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)]">
          🎨 Наші автори та творці
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
          {authors.map((author) => (
            <AuthorCard
              key={author.id}
              author={author}
              onSelect={(selectedAuthor) => setSelectedArtist(selectedAuthor.productArtist ?? selectedAuthor.name)}
            />
          ))}
        </div>
      </section>

      {/* Сітка товарів */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6 flex-1 w-full border-t-4 border-black border-dashed">
        {sortedProducts.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <span className="text-4xl mb-3 block">🔍</span>
            <span className="text-lg font-bold text-gray-600">Нічого не знайдено</span>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
              {paginatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} onAddToCart={() => handleAddToCart(p)} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10 flex-wrap">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg border-2 border-black bg-white font-bold text-sm shadow-[2px_2px_0px_rgba(0,0,0,1)] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 active:translate-y-0.5 active:translate-x-0.5 active:shadow-none transition"
                >
                  ← Назад
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-lg border-2 border-black font-black text-sm transition ${
                      currentPage === page
                        ? 'bg-[#FF4FA3] text-white shadow-[2px_2px_0px_rgba(0,0,0,1)]'
                        : 'bg-white hover:bg-gray-50 shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:translate-x-0.5 active:shadow-none'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg border-2 border-black bg-white font-bold text-sm shadow-[2px_2px_0px_rgba(0,0,0,1)] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 active:translate-y-0.5 active:translate-x-0.5 active:shadow-none transition"
                >
                  Далі →
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Модальне вікно кошика */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Закрити кошик"
            onClick={closeCart}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            style={{ animation: 'modalFadeIn 0.2s ease-out forwards' }}
          />

          <div
            className="bg-white w-full max-w-lg max-h-[calc(100dvh-2rem)] sm:max-h-[85vh] flex flex-col border-4 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative z-10 overflow-hidden"
            style={{ animation: 'modalScaleUp 0.25s ease-out forwards' }}
          >
            <div className="flex items-center justify-between border-b-4 border-black p-4 bg-[#FF4FA3]">
              <h2 className="text-2xl font-black text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                {orderSent ? '✅ Прийнято' : isCheckoutStage ? 'Оформлення' : 'Твій Кошик'}
              </h2>
              <button
                type="button"
                aria-label="Закрити кошик"
                onClick={closeCart}
                className="text-white hover:text-[#FFB37B] font-black text-xl bg-black bg-opacity-20 w-11 h-11 rounded-full flex items-center justify-center transition border border-black"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 flex flex-col overflow-hidden bg-[#FFFDF0]">
              {orderSent ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#FFFDF0]">
                  <span className="text-6xl mb-4">🎉</span>
                  <h3 className="text-2xl font-black mb-2 text-black">Дякуємо за замовлення!</h3>
                  <p className="text-gray-700 text-sm font-medium">Зв'яжемось з вами найближчим часом.</p>
                  <button
                    onClick={closeCart}
                    className="mt-6 bg-[#FF4FA3] text-white border-2 border-black px-6 py-2 rounded-lg font-bold shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:opacity-90 active:translate-y-0.5 active:translate-x-0.5 active:shadow-none"
                  >
                    Закрити
                  </button>
                </div>
              ) : isCheckoutStage ? (
                <div className="p-5 flex-1 flex flex-col justify-between overflow-y-auto">
                  <div className="space-y-4">
                    {[
                      { label: "Ім'я та Прізвище", key: 'name', type: 'text', placeholder: 'Іван Іваненко' },
                      { label: 'Телефон', key: 'phone', type: 'tel', placeholder: '+380XXXXXXXXX' },
                      { label: 'Місто', key: 'city', type: 'text', placeholder: 'Ужгород' },
                      { label: 'Відділення Нової Пошти', key: 'nova_poshta', type: 'text', placeholder: '№ 1' },
                    ].map(({ label, key, type, placeholder }) => (
                      <div key={key}>
                        <label className="block text-sm font-black text-gray-800">{label}</label>
                        <input
                          type={type}
                          placeholder={placeholder}
                          value={form[key as keyof OrderForm]}
                          onChange={(e) => {
                            setForm({ ...form, [key]: e.target.value });
                            setFormErrors({ ...formErrors, [key]: '' });
                          }}
                          className={`mt-1 block w-full rounded-lg border-2 p-2.5 focus:outline-none focus:ring-2 focus:ring-[#FF4FA3] text-black font-medium ${
                            formErrors[key as keyof OrderForm] ? 'border-red-500 bg-red-50' : 'border-black bg-white'
                          }`}
                        />
                        {formErrors[key as keyof OrderForm] && (
                          <p className="text-red-500 text-xs mt-1 font-bold">{formErrors[key as keyof OrderForm]}</p>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="pt-4 border-t-4 border-dashed border-black space-y-2 mt-6">
                    <button
                      onClick={() => setIsCheckoutStage(false)}
                      className="w-full bg-white text-black border-2 border-black py-2 rounded-lg font-bold hover:bg-gray-100 transition shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:translate-x-0.5 active:shadow-none"
                    >
                      Назад до кошика
                    </button>
                    <button
                      onClick={handleSubmitOrder}
                      disabled={isSending}
                      className={`w-full py-3 rounded-lg font-black border-2 border-black transition text-black shadow-[4px_4px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:translate-x-0.5 active:shadow-none ${
                        isSending ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#FFB37B] hover:opacity-90'
                      }`}
                    >
                      {isSending ? 'Надсилаємо...' : 'Підтвердити замовлення'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-5 flex-1 flex flex-col justify-between overflow-hidden">
                  {cart.length === 0 ? (
                    <div className="text-center py-12 text-gray-400 flex flex-col items-center justify-center flex-1">
                      <span className="text-6xl mb-3">🛒</span>
                      <span className="font-black text-gray-600 text-lg">Кошик порожній</span>
                    </div>
                  ) : (
                    <>
                      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                        {cart.map((item) => (
                          <div key={item.product.id} className="flex items-center gap-4 border-b-2 border-black pb-4">
                            <img
                              src={item.product.image}
                              alt={item.product.title}
                              className="w-20 h-20 object-cover rounded-xl border-2 border-black bg-white shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                            />
                            <div className="flex-1">
                              <h3 className="font-black text-base text-black line-clamp-1">{item.product.title}</h3>
                              <p className="text-xs text-gray-600 font-bold uppercase tracking-wider">{item.product.artist}</p>
                              <span className="font-black text-base text-[#FF4FA3] drop-shadow-[1px_1px_0px_rgba(0,0,0,1)]">
                                {item.product.price} грн
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                aria-label={`Зменшити кількість товару «${item.product.title}»`}
                                onClick={() => handleDecreaseQuantity(item.product.id)}
                                className="w-11 h-11 rounded-lg border-2 border-black bg-white hover:bg-gray-100 text-base font-black flex items-center justify-center shadow-[1px_1px_0px_rgba(0,0,0,1)]"
                              >
                                −
                              </button>
                              <span className="text-base font-black w-5 text-center text-black">{item.quantity}</span>
                              <button
                                type="button"
                                aria-label={`Збільшити кількість товару «${item.product.title}»`}
                                onClick={() => handleIncreaseQuantity(item.product.id)}
                                className="w-11 h-11 rounded-lg border-2 border-black bg-white hover:bg-gray-100 text-base font-black flex items-center justify-center shadow-[1px_1px_0px_rgba(0,0,0,1)]"
                              >
                                +
                              </button>
                              <button
                                type="button"
                                aria-label={`Видалити товар «${item.product.title}» з кошика`}
                                onClick={() => handleRemoveFromCart(item.product.id)}
                                className="w-11 h-11 text-red-500 hover:text-red-700 font-black text-lg ml-2 flex items-center justify-center"
                              >
                                🗑
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="border-t-4 border-black pt-4 mt-2">
                        <div className="flex justify-between items-center mb-4 text-2xl font-black text-black">
                          <span>Всього:</span>
                          <span className="text-[#FF4FA3] drop-shadow-[1px_1px_0px_rgba(0,0,0,1)]">
                            {cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)} грн
                          </span>
                        </div>
                        <button
                          onClick={() => setIsCheckoutStage(true)}
                          className="w-full bg-[#FFB37B] text-black border-2 border-black py-3 rounded-xl font-black text-lg shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:opacity-90 transition active:translate-y-0.5 active:translate-x-0.5 active:shadow-none"
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

      {isAdminOpen && (
        <AdminPanel
          products={products}
          authors={authors}
          onAddProduct={(p) => setProducts([...products, p])}
          onAddAuthor={(a) => setAuthors([...authors, a])}
          onUpdateProduct={(updatedProduct) => setProducts(products.map((product) => product.id === updatedProduct.id ? updatedProduct : product))}
          onUpdateAuthor={(updatedAuthor) => setAuthors(authors.map((author) => author.id === updatedAuthor.id ? updatedAuthor : author))}
          onClose={() => setIsAdminOpen(false)}
        />
      )}

      {/* CTA — підписка на Telegram */}
      <section className="bg-black border-t-4 border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Хочеш дізнаватись про нові дропи першим?
            </h2>
            <p className="mt-2 text-sm text-gray-300 font-medium">
              Підпишись на наш Telegram-канал — новини, розіграші та ексклюзивні знижки.
            </p>
          </div>
          <a
            href="https://t.me/kurisushoop"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 bg-[#FF4FA3] text-white border-2 border-white px-8 py-3 rounded-xl font-black text-lg shadow-[4px_4px_0px_rgba(255,255,255,0.3)] hover:opacity-90 transition active:translate-y-0.5 active:translate-x-0.5 active:shadow-none"
          >
            📩 Підписатись
          </a>
        </div>
      </section>

      {/* Підвал */}
      <footer className="bg-[#FF4FA3] border-t-4 border-black mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 grid grid-cols-1 sm:grid-cols-3 gap-8 text-white">
          <div className="flex flex-col items-center sm:items-start gap-3">
            <img
              src={logo}
              alt="KURISU.SHOP"
              className="w-14 h-14 rounded-full border-2 border-black object-cover shadow-[2px_2px_0px_rgba(0,0,0,1)]"
            />
            <p className="text-sm font-bold text-center sm:text-left">
              Авторський мерч від українських художників — з любов'ю і турботою про кожну деталь.
            </p>
          </div>

          <div className="text-center sm:text-left">
            <h3 className="font-black uppercase tracking-wider text-xs mb-3 text-black">Наші автори</h3>
            <ul className="space-y-1 text-sm font-bold">
              {authors.map((author) => (
                <li key={author.id}>{author.name}</li>
              ))}
            </ul>
          </div>

          <div className="text-center sm:text-left">
            <h3 className="font-black uppercase tracking-wider text-xs mb-3 text-black">Доставка та оплата</h3>
            <ul className="space-y-1 text-sm font-bold">
              <li>📦 Нова Пошта по всій Україні</li>
              <li>💳 Оплата при оформленні замовлення</li>
              <li>💬 Зв'язок через Telegram</li>
            </ul>
          </div>
        </div>

        <div className="border-t-2 border-black py-4 text-center text-xs font-bold text-black bg-[#FFB37B] flex items-center justify-center gap-3">
          <span>© {new Date().getFullYear()} KURISU.SHOP — усі права захищено</span>
          <button
            type="button"
            aria-label="Відкрити адмін-панель"
            onClick={() => setIsAdminOpen(true)}
            className="w-11 h-11 opacity-40 hover:opacity-100 transition text-black"
            title="Адмін-панель"
          >
            ⚙
          </button>
        </div>
      </footer>

            <FloatingImageLink />

    </div>
  );
}

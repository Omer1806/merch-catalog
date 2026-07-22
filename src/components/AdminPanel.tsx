import { useEffect, useState } from 'react';
import type { Product } from '../types/product';
import type { Author } from '../types/author';

interface AdminPanelProps {
  products: Product[];
  authors: Author[];
  onAddProduct: (product: Product) => void;
  onAddAuthor: (author: Author) => void;
  onUpdateProduct: (product: Product) => void;
  onUpdateAuthor: (author: Author) => void;
  onClose: () => void;
}

const ADMIN_PASSWORD = 'admin123';

type Tab = 'product' | 'author';

export default function AdminPanel({ products, authors, onAddProduct, onAddAuthor, onUpdateProduct, onUpdateAuthor, onClose }: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('product');

  const [productForm, setProductForm] = useState({
    title: '',
    price: '',
    image: '',
    category: '',
    description: '',
    artist: '',
  });

  const [authorForm, setAuthorForm] = useState({
    name: '',
    location: '',
    bio: '',
    philosophy: '',
    avatarUrl: '',
    instagram: '',
    twitter: '',
    threads: '',
    orderForm: '',
    extraLinkLabel: '',
    extraLinkUrl: '',
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editingAuthorId, setEditingAuthorId] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleLogin = () => {
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setPasswordError('');
    } else {
      setPasswordError('Невірний пароль');
    }
  };

  const handleProductChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProductForm({ ...productForm, [e.target.name]: e.target.value });
  };

  const handleAuthorChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setAuthorForm({ ...authorForm, [e.target.name]: e.target.value });
  };

  const resetProductForm = () => {
    setEditingProductId(null);
    setProductForm({ title: '', price: '', image: '', category: '', description: '', artist: '' });
  };

  const resetAuthorForm = () => {
    setEditingAuthorId(null);
    setAuthorForm({ name: '', location: '', bio: '', philosophy: '', avatarUrl: '', instagram: '', twitter: '', threads: '', orderForm: '', extraLinkLabel: '', extraLinkUrl: '' });
  };

  const selectProductForEdit = (id: string) => {
    const product = products.find((item) => item.id === id);
    if (!product) return;
    setEditingProductId(id);
    setProductForm({ title: product.title, price: String(product.price), image: product.image, category: product.category, description: product.description, artist: product.artist });
  };

  const selectAuthorForEdit = (id: string) => {
    const author = authors.find((item) => item.id === id);
    if (!author) return;
    setEditingAuthorId(id);
    setAuthorForm({ name: author.name, location: author.location, bio: author.bio, philosophy: author.philosophy, avatarUrl: author.avatarUrl, instagram: author.socials.instagram ?? '', twitter: author.socials.twitter ?? '', threads: author.socials.threads ?? '', orderForm: author.socials.orderForm ?? '', extraLinkLabel: author.extraLinks?.[0]?.label ?? '', extraLinkUrl: author.extraLinks?.[0]?.url ?? '' });
  };

  const handleSubmitProduct = () => {
    if (!productForm.title || !productForm.price || !productForm.image || !productForm.category || !productForm.artist) {
      alert('Заповніть всі обов\'язкові поля!');
      return;
    }

    const newProduct: Product = {
      id: editingProductId ?? 'prod-' + Date.now(),
      title: productForm.title,
      price: Number(productForm.price),
      image: productForm.image,
      category: productForm.category,
      description: productForm.description,
      artist: productForm.artist,
    };

    if (editingProductId) onUpdateProduct(newProduct); else onAddProduct(newProduct);
    setSuccessMessage(`Товар "${productForm.title}" успішно додано!`);
    resetProductForm();

    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleSubmitAuthor = () => {
    if (!authorForm.name || !authorForm.location || !authorForm.bio || !authorForm.philosophy || !authorForm.avatarUrl) {
      alert('Заповніть всі обов\'язкові поля (позначені *)!');
      return;
    }

    const newAuthor: Author = {
      id: editingAuthorId ?? 'author-' + Date.now(),
      name: authorForm.name,
      location: authorForm.location,
      bio: authorForm.bio,
      philosophy: authorForm.philosophy,
      avatarUrl: authorForm.avatarUrl,
      socials: {
        instagram: authorForm.instagram || undefined,
        twitter: authorForm.twitter || undefined,
        threads: authorForm.threads || undefined,
        orderForm: authorForm.orderForm || undefined,
      },
      extraLinks: authorForm.extraLinkLabel && authorForm.extraLinkUrl
        ? [{ label: authorForm.extraLinkLabel, url: authorForm.extraLinkUrl }]
        : undefined,
    };

    const existingAuthor = authors.find((author) => author.id === editingAuthorId);
    const authorToSave = { ...newAuthor, productArtist: existingAuthor?.productArtist ?? authorForm.name };
    if (editingAuthorId) onUpdateAuthor(authorToSave); else onAddAuthor(authorToSave);
    setSuccessMessage(`Автора "${authorForm.name}" успішно додано!`);
    resetAuthorForm();

    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[calc(100dvh-2rem)] flex flex-col overflow-hidden">

        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-xl font-bold">🔧 Адмін панель</h2>
          <button type="button" aria-label="Закрити адмін-панель" onClick={onClose} className="w-11 h-11 text-gray-500 hover:text-black text-xl flex items-center justify-center">✕</button>
        </div>

        {!isAuthenticated ? (
          /* Форма входу */
          <div className="p-6 space-y-4">
            <p className="text-gray-600 text-sm">Введіть пароль для доступу до адмін панелі</p>
            <input
              type="password"
              placeholder="Пароль"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
            <button
              onClick={handleLogin}
              className="w-full bg-indigo-600 text-white py-2 rounded-md font-semibold hover:bg-indigo-700 transition"
            >
              Увійти
            </button>
          </div>
        ) : (
          <>
            {/* Перемикач вкладок */}
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab('product')}
                className={`flex-1 py-3 text-sm font-semibold transition ${
                  activeTab === 'product'
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                📦 Товар
              </button>
              <button
                onClick={() => setActiveTab('author')}
                className={`flex-1 py-3 text-sm font-semibold transition ${
                  activeTab === 'author'
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                🎨 Автор
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-3 overflow-y-auto max-h-[calc(100dvh-9rem)] sm:max-h-[70vh]">
              {successMessage && (
                <div className="bg-green-100 text-green-700 px-4 py-2 rounded-md text-sm font-medium">
                  ✅ {successMessage}
                </div>
              )}

              {activeTab === 'product' ? (
                /* Форма додавання товару */
                <>
                  <div className="rounded-md bg-indigo-50 p-3 space-y-2">
                    <label className="block text-sm font-semibold text-indigo-900">Редагувати наявний товар</label>
                    <select
                      value={editingProductId ?? ''}
                      onChange={(e) => e.target.value ? selectProductForEdit(e.target.value) : resetProductForm()}
                      className="w-full border border-indigo-200 rounded-md px-3 py-2 text-sm bg-white"
                    >
                      <option value="">Новий товар</option>
                      {products.map((product) => <option key={product.id} value={product.id}>{product.title}</option>)}
                    </select>
                  </div>
                  {[
                    { name: 'title', label: 'Назва товару *', placeholder: 'Худі з принтом' },
                    { name: 'price', label: 'Ціна (грн) *', placeholder: '1200' },
                    { name: 'image', label: 'Посилання на фото *', placeholder: 'https://...' },
                    { name: 'category', label: 'Категорія *', placeholder: 'Одяг' },
                    { name: 'artist', label: 'Автор *', placeholder: 'Макс (Кібер-арт)' },
                  ].map(({ name, label, placeholder }) => (
                    <div key={name}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                      <input
                        type={name === 'price' ? 'number' : 'text'}
                        name={name}
                        placeholder={placeholder}
                        value={productForm[name as keyof typeof productForm]}
                        onChange={handleProductChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      />
                    </div>
                  ))}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Опис</label>
                    <textarea
                      name="description"
                      placeholder="Короткий опис товару..."
                      value={productForm.description}
                      onChange={handleProductChange}
                      rows={3}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
                    />
                  </div>

                  <button
                    onClick={handleSubmitProduct}
                    className="w-full bg-green-600 text-white py-3 rounded-md font-semibold hover:bg-green-700 transition mt-2"
                  >
                    Додати товар
                  </button>
                </>
              ) : (
                /* Форма додавання автора */
                <>
                  <div className="rounded-md bg-indigo-50 p-3 space-y-2">
                    <label className="block text-sm font-semibold text-indigo-900">Редагувати наявного автора</label>
                    <select
                      value={editingAuthorId ?? ''}
                      onChange={(e) => e.target.value ? selectAuthorForEdit(e.target.value) : resetAuthorForm()}
                      className="w-full border border-indigo-200 rounded-md px-3 py-2 text-sm bg-white"
                    >
                      <option value="">Новий автор</option>
                      {authors.map((author) => <option key={author.id} value={author.id}>{author.name}</option>)}
                    </select>
                  </div>
                  {[
                    { name: 'name', label: "Ім'я автора *", placeholder: 'Madred' },
                    { name: 'location', label: 'Локація *', placeholder: 'Херсон, Україна' },
                    { name: 'avatarUrl', label: 'Посилання на фото *', placeholder: 'https://...' },
                  ].map(({ name, label, placeholder }) => (
                    <div key={name}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                      <input
                        type="text"
                        name={name}
                        placeholder={placeholder}
                        value={authorForm[name as keyof typeof authorForm]}
                        onChange={handleAuthorChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      />
                    </div>
                  ))}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Про автора *</label>
                    <textarea
                      name="bio"
                      placeholder="Короткий опис художника..."
                      value={authorForm.bio}
                      onChange={handleAuthorChange}
                      rows={2}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Філософія творчості *</label>
                    <textarea
                      name="philosophy"
                      placeholder="Що надихає автора..."
                      value={authorForm.philosophy}
                      onChange={handleAuthorChange}
                      rows={2}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
                    />
                  </div>

                  <p className="text-xs text-gray-400 pt-2 border-t">Соціальні мережі (необов'язково)</p>

                  {[
                    { name: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/...' },
                    { name: 'twitter', label: 'X (Twitter)', placeholder: 'https://x.com/...' },
                    { name: 'threads', label: 'Threads', placeholder: 'https://threads.com/...' },
                    { name: 'orderForm', label: 'Форма замовлення', placeholder: 'https://forms.gle/...' },
                  ].map(({ name, label, placeholder }) => (
                    <div key={name}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                      <input
                        type="text"
                        name={name}
                        placeholder={placeholder}
                        value={authorForm[name as keyof typeof authorForm]}
                        onChange={handleAuthorChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      />
                    </div>
                  ))}

                  <p className="text-xs text-gray-400 pt-2 border-t">Додаткове посилання (необов'язково)</p>

                  <div className="flex flex-col min-[380px]:flex-row gap-2">
                    <input
                      type="text"
                      name="extraLinkLabel"
                      placeholder="Назва (напр. Другий Instagram)"
                      value={authorForm.extraLinkLabel}
                      onChange={handleAuthorChange}
                      className="w-full min-[380px]:w-1/2 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                    <input
                      type="text"
                      name="extraLinkUrl"
                      placeholder="https://..."
                      value={authorForm.extraLinkUrl}
                      onChange={handleAuthorChange}
                      className="w-full min-[380px]:w-1/2 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                  </div>

                  <button
                    onClick={handleSubmitAuthor}
                    className="w-full bg-green-600 text-white py-3 rounded-md font-semibold hover:bg-green-700 transition mt-2"
                  >
                    Додати автора
                  </button>
                </>
              )}
            </div>
          </>
        )}

      </div>
    </div>
  );
}

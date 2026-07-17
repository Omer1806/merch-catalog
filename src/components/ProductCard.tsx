import { useEffect, useRef, useState } from 'react';
import type { ArtistProduct } from '../mockData';

interface ProductCardProps {
  product: ArtistProduct;
  onAddToCart: () => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const resetFeedbackTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Очищення таймерів при розмонтуванні компонента
  useEffect(() => {
    return () => {
      if (resetFeedbackTimeout.current) {
        clearTimeout(resetFeedbackTimeout.current);
      }
    };
  }, []);

  // Обробка натискання клавіші Escape для закриття модалки
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Обробник додавання товару в кошик із візуальним фідбеком
  const handleAddToCart = () => {
    onAddToCart();
    setIsAdded(true);

    if (resetFeedbackTimeout.current) {
      clearTimeout(resetFeedbackTimeout.current);
    }

    resetFeedbackTimeout.current = setTimeout(() => {
      setIsAdded(false);
      resetFeedbackTimeout.current = null;
      
      // Якщо товар додали зсередини модалки, плавно закриваємо її після показу успішного статусу
      if (isOpen) {
        setIsOpen(false);
      }
    }, 1800); // 1.8 секунди цілком достатньо для зчитування статусу «Додано!»
  };

  // Ефект нахилу картки (3D tilt)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const target = e.target as HTMLElement;
    if (target.closest('button')) {
      setTilt({ x: 0, y: 0 });
      return;
    }

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -4;
    const rotateY = ((x - centerX) / centerX) * 4;
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovering(false);
  };

  return (
    <>
      {/* Картка-«трейдінг-карта» у сітці */}
      <div
        ref={cardRef}
        onClick={() => setIsOpen(true)}
        onKeyDown={(event) => {
          if (event.target !== event.currentTarget) return;
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            setIsOpen(true);
          }
        }}
        role="button"
        tabIndex={0}
        aria-label={`Переглянути деталі товару: ${product.title}`}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          transformOrigin: '100% 100%',
          transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${isHovering ? 1.03 : 1})`,
          transition: isHovering ? 'transform 0.05s linear' : 'transform 0.4s ease-out',
        }}
        className="group relative bg-white border-4 border-black rounded-2xl overflow-hidden shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] flex flex-col h-full cursor-pointer"
      >
        {/* Верхня «іменна» панель — назва + ціна як HP */}
        <div className="flex items-center justify-between gap-2 px-3 py-2 border-b-4 border-black bg-white">
          <h3 className="font-black text-sm text-black leading-tight line-clamp-1 flex-1">
            {product.title}
          </h3>
          <span className="shrink-0 bg-[#FF4FA3] text-white text-xs font-black px-2.5 py-1 rounded-full border-2 border-black shadow-[1px_1px_0px_rgba(0,0,0,1)]">
            {product.price} ₴
          </span>
        </div>

        {/* Панель ілюстрації з внутрішньою рамкою */}
        <div className="relative p-2 bg-[#FFDCC2]">
          <div className="relative overflow-hidden rounded-lg border-2 border-black">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-52 object-cover bg-gray-50"
              loading="lazy" // Оптимізація CLS / Швидкості завантаження
            />
            {/* Голографічний відблиск при наведенні */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute inset-y-0 -left-1/2 w-1/2 bg-gradient-to-r from-transparent via-white/50 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-[400%] transition-transform duration-700 ease-out" />
            </div>
          </div>

          {/* Значок категорії */}
          <span className="absolute -bottom-1 left-4 bg-white text-black text-[10px] font-black px-2.5 py-1 rounded-full border-2 border-black shadow-[1px_1px_0px_rgba(0,0,0,1)] uppercase tracking-wide">
            {product.category}
          </span>
        </div>

        {/* Опис */}
        <div className="px-3 pt-3 pb-2 flex-1">
          <p className="text-[11px] text-gray-600 italic leading-snug line-clamp-2">
            {product.description}
          </p>
        </div>

        {/* Нижній «стат-рядок» */}
        <div className="flex items-center justify-between px-3 py-2 border-t-2 border-dashed border-black">
          <span className="flex items-center gap-1 text-[10px] font-black uppercase text-[#FF4FA3] tracking-wide">
            🖌️ {product.artist}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation(); // Зупиняємо відкриття модалки при кліку на кнопку
              handleAddToCart();
            }}
            className={`border-2 border-black font-black text-[10px] px-3 py-1.5 rounded-lg transition shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:translate-x-0.5 active:shadow-none ${
              isAdded 
                ? 'bg-emerald-500 text-white animate-pulse shadow-none' 
                : 'bg-[#FFB37B] hover:bg-opacity-90 text-black'
            }`}
            disabled={isAdded} // Запобігає спам-клікам під час анімації успіху
          >
            {isAdded ? 'Додано! ✓' : 'У кошик'}
          </button>
        </div>
      </div>

      {/* Модальне вікно перегляду товару */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Бекдроп (Задній фон) */}
          <button
            type="button"
            aria-label="Закрити перегляд товару"
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-default"
            style={{ animation: 'modalFadeIn 0.2s ease-out forwards' }}
          />

          {/* Контент модалки */}
          <div
            className="bg-white w-full max-w-2xl max-h-[calc(100dvh-2rem)] sm:max-h-[85vh] flex flex-col border-4 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative z-10 overflow-hidden"
            style={{ animation: 'modalScaleUp 0.25s ease-out forwards' }}
          >
            {/* Шапка модалки */}
            <div className="flex items-center justify-between border-b-4 border-black p-4 bg-[#FF4FA3]">
              <h2 className="text-lg sm:text-2xl font-black text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] line-clamp-1 pr-2">
                {product.title}
              </h2>
              <button
                type="button"
                aria-label="Закрити модальне вікно"
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-[#FFB37B] font-black text-xl bg-black bg-opacity-20 w-11 h-11 rounded-full flex items-center justify-center transition border border-black"
              >
                ✕
              </button>
            </div>

            {/* Тіло модалки */}
            <div className="flex-1 overflow-y-auto bg-[#FFFDF0]">
              <div className="p-4 bg-[#FFDCC2] border-b-4 border-black flex justify-center">
                <div className="relative overflow-hidden rounded-xl border-2 border-black inline-block">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="block max-h-[40dvh] sm:max-h-[50vh] max-w-full w-auto object-contain bg-white"
                  />
                </div>
              </div>

              <div className="p-4 sm:p-6 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs font-black uppercase text-[#FF4FA3] tracking-wider">
                    🖌️ {product.artist}
                  </span>
                  <span className="bg-white text-black text-xs font-black px-2.5 py-1 rounded-full border-2 border-black">
                    {product.category}
                  </span>
                </div>

                <p className="text-sm text-gray-800 leading-relaxed italic">
                  {product.description}
                </p>

                {/* Низ модалки з кнопкою покупки */}
                <div className="flex flex-col min-[380px]:flex-row items-stretch min-[380px]:items-center justify-between gap-3 pt-4 border-t-2 border-dashed border-black">
                  <span className="text-2xl font-black text-black">
                    {product.price} <span className="text-base font-bold">грн</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className={`border-2 border-black font-black px-4 sm:px-6 py-3 rounded-xl transition shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:translate-x-0.5 active:shadow-none ${
                      isAdded 
                        ? 'bg-emerald-500 text-white animate-pulse shadow-none' 
                        : 'bg-[#FFB37B] text-black hover:opacity-90'
                    }`}
                    disabled={isAdded}
                  >
                    {isAdded ? 'Додано! ✓' : 'Додати в кошик'}
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
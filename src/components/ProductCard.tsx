import { useState, useRef } from 'react';
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
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });

  const handleZoomMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomOrigin({ x, y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -5; // нахил вгору/вниз
    const rotateY = ((x - centerX) / centerX) * 5;  // нахил вліво/вправо
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovering(false);
  };

  return (
    <>
      {/* Картка-«тредінг-карта» у сітці */}
      <div
        ref={cardRef}
        onClick={() => setIsOpen(true)}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={handleMouseLeave}
        style={{
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

        {/* Панель ілюстрації з внутрішньою рамкою, як «артворк» на карті */}
        <div className="relative p-2 bg-[#FFDCC2]">
          <div className="relative overflow-hidden rounded-lg border-2 border-black">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-52 object-cover bg-gray-50"
            />
            {/* Голографічний відблиск при наведенні */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute inset-y-0 -left-1/2 w-1/2 bg-gradient-to-r from-transparent via-white/50 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-[400%] transition-transform duration-700 ease-out" />
            </div>
          </div>

          {/* Значок категорії — «тип» картки */}
          <span className="absolute -bottom-1 left-4 bg-white text-black text-[10px] font-black px-2.5 py-1 rounded-full border-2 border-black shadow-[1px_1px_0px_rgba(0,0,0,1)] uppercase tracking-wide">
            {product.category}
          </span>
        </div>

        {/* Опис — «текст Pokédex» */}
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
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart();
            }}
            className="bg-[#FFB37B] hover:bg-[#FFA65C] text-black border-2 border-black font-black text-[12px] sm:text-sm px-5 py-2.5 rounded-2xl transition-all duration-200 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:translate-x-0.5 active:shadow-[2px_2px_0px_rgba(0,0,0,1)]"
          >
            У кошик
          </button>
        </div>
      </div>

      {/* Модальне вікно перегляду товару */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            style={{ animation: 'modalFadeIn 0.2s ease-out forwards' }}
          />

          <div
            className="bg-white w-full max-w-2xl max-h-[85vh] flex flex-col border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative z-10 overflow-hidden"
            style={{ animation: 'modalScaleUp 0.25s ease-out forwards' }}
          >
            <div className="flex items-center justify-between border-b-4 border-black p-4 bg-[#FF4FA3]">
              <h2 className="text-2xl font-black text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                {product.title}
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-[#FFB37B] font-black text-xl bg-black bg-opacity-20 w-8 h-8 rounded-full flex items-center justify-center transition border border-black"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto bg-[#FFFDF0]">
              <div className="p-4 bg-[#FFDCC2] border-b-4 border-black flex justify-center">
                <div
                  className="relative overflow-hidden rounded-xl border-2 border-black inline-block cursor-zoom-in"
                  onMouseEnter={() => setIsZoomed(true)}
                  onMouseLeave={() => setIsZoomed(false)}
                  onMouseMove={handleZoomMove}
                >
                  <img
                    src={product.image}
                    alt={product.title}
                    className="block max-h-[50vh] w-auto object-contain bg-white transition-transform duration-150 ease-out"
                    style={{
                      transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
                      transform: isZoomed ? 'scale(2.2)' : 'scale(1)',
                    }}
                  />
                </div>
              </div>

              <div className="p-6 space-y-4">
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

                <div className="flex items-center justify-between pt-4 border-t-2 border-dashed border-black">
                  <span className="text-2xl font-black text-black">
                    {product.price} <span className="text-base font-bold">грн</span>
                  </span>
                  <button
                    onClick={() => {
                      onAddToCart();
                      setIsOpen(false);
                    }}
                    className="bg-[#FFB37B] text-black border-2 border-black font-black px-6 py-3 rounded-xl transition shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:opacity-90 active:translate-y-0.5 active:translate-x-0.5 active:shadow-none"
                  >
                    Додати в кошик
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

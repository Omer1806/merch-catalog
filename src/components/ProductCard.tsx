import { type ArtistProduct } from '../mockData';

interface ProductCardProps {
  product: ArtistProduct;
  onAddToCart: () => void; // Кажемо картці, що вона отримає функцію кліку
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 flex flex-col h-full hover:shadow-lg transition-all duration-300">
      
      {/* Картинка товару */}
      <div className="h-48 w-full overflow-hidden bg-gray-200 relative">
        <img 
          src={product.image} 
          alt={product.title} 
          className="w-full h-full object-cover hover:scale-105 transition-all duration-300"
        />
        <span className="absolute top-2 right-2 bg-white bg-opacity-90 text-xs px-2 py-1 rounded-md text-gray-600 font-medium shadow-sm">
          {product.category}
        </span>
      </div>

      {/* Контент картки */}
      <div className="p-5 flex flex-col flex-grow">
        <span className="text-xs font-semibold text-purple-600 mb-1 uppercase tracking-wider">
          {product.artist}
        </span>
        <h3 className="text-base font-bold text-gray-800 mb-2 line-clamp-1">
          {product.title}
        </h3>
        <p className="text-gray-500 text-xs mb-4 line-clamp-2 flex-grow">
          {product.description}
        </p>

        {/* Нижня частина: Ціна + Кнопка */}
        <div className="flex items-center justify-between mt-auto pt-2">
          <span className="text-lg font-black text-gray-900">
            {product.price} <span className="text-sm font-normal text-gray-500">грн</span>
          </span>
          <button 
            onClick={onAddToCart} // Тепер при кліку викликається додавання в кошик!
            className="bg-purple-600 text-white text-xs px-4 py-2.5 rounded-xl font-bold hover:bg-purple-700 shadow-sm transition-all active:scale-95"
          >
            У кошик
          </button>
        </div>
      </div>

    </div>
  );
}
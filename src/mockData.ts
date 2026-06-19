import { type Product } from './types/product';

// Розширимо інтерфейс прямо тут, щоб не ламати інші файли
export interface ArtistProduct extends Product {
  artist: string;
}

export const MOCK_PRODUCTS: ArtistProduct[] = [
  {
    id: 'prod-1',
    title: 'Худі "Код працює — не чіпай"',
    price: 1250,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7',
    category: 'Одяг',
    description: 'Тепле, затишне худі для довгих нічних сесій кодингу. Мерч від Макса.',
    artist: 'Макс (Кібер-арт)'
  },
  {
    id: 'prod-2',
    title: 'Механічна клавіатура CyberClick',
    price: 3400,
   image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3',
    category: 'Гаджети',
    description: 'Зручні сині світчі, яскраве RGB підсвічування та кастомний принт від Макса.',
    artist: 'Макс (Кібер-арт)'
  },
  {
    id: 'prod-3',
    title: 'Термокухоль "Кава Еспресо-Доза"',
    price: 650,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd',
    category: 'Аксесуари',
    description: 'Тримає тепло до 8 годин. Дизайн розроблено Алісою.',
    artist: 'Аліса (Абстракція)'
  },
  {
    id: 'prod-4',
    title: 'Рюкзак розробника Anti-Theft',
    price: 1850,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62',
    category: 'Аксесуари',
    description: 'Стильний міський рюкзак із захистом від крадіжок та фірмовим патчем від Аліси.',
    artist: 'Аліса (Абстракція)'
  }
];
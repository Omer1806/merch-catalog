export interface ArtistProduct {
  id: string;
  title: string;
  price: number;
  image: string;
  category: string;
  description: string;
  artist: string;
}

export const MOCK_PRODUCTS: ArtistProduct[] = [
  // --- Товари автора Архімаг ---
  {
    id: 'kurisu-1',
    title: 'Листівка А6 (Варіант 1)',
    price: 60,
    image: '/images/arhimag/photo_1_2026-07-07_00-47-28.jpg',
    category: 'Листівки',
    description: 'Ексклюзивний художній принт високої якості, створений Архімаг.',
    artist: 'Архімаг'
  },
  {
    id: 'kurisu-2',
    title: 'Листівка А6 (Варіант 2)',
    price: 60,
    image: '/images/arhimag/photo_2_2026-07-07_00-47-28.jpg',
    category: 'Листівки',
    description: 'Ексклюзивний художній принт високої якості, створений Kurisu.',
    artist: 'Архімаг'
  },
  {
    id: 'kurisu-3',
    title: 'Листівка А6 (Варіант 3)',
    price: 60,
    image: '/images/arhimag/photo_3_2026-07-07_00-47-28.jpg',
    category: 'Листівки',
    description: 'Набір вінілових стікерів, стійких до подряпин.',
    artist: 'Архімаг'
  },
  {
    id: 'kurisu-4',
    title: 'Листівка А6 (Варіант 4)',
    price: 60,
    image: '/images/arhimag/photo_4_2026-07-07_00-47-28.jpg',
    category: 'Листівки',
    description: 'Збірка найкращих ілюстрацій та скетчів автора.',
    artist: 'Архімаг'
  },
  {
    id: 'kurisu-5',
    title: 'Листівка А6 (Варіант 5)',
    price: 60,
    image: '/images/arhimag/photo_5_2026-07-07_00-47-28.jpg',
    category: 'Листівки',
    description: 'Ексклюзивний художній принт високої якості, створений Kurisu.',
    artist: 'Архімаг'
  },
  {
    id: 'kurisu-6',
    title: 'Листівка А6 (Варіант 6)',
    price: 60,
    image: '/images/arhimag/photo_6_2026-07-07_00-47-28.jpg',
    category: 'Листівки',
    description: 'Ексклюзивний художній принт високої якості, створений Архімаг.',
    artist: 'Архімаг'
  },
  {
    id: 'kurisu-7',
    title: 'Листівка А6 (Варіант 7)',
    price: 60,
    image: '/images/arhimag/photo_7_2026-07-07_00-47-28.jpg',
    category: 'Листівки',
    description: 'Мила листівка з автографом на звороті.',
    artist: 'Архімаг'
  },
  {
    id: 'kurisu-8',
    title: 'Стікери',
    price: 30,
    image: '/images/arhimag/photo_8_2026-07-07_00-47-28.jpg',
    category: 'Стікери',
    description: 'Прикольні стікєри',
    artist: 'Архімаг'
  },
  {
    id: 'kurisu-9',
    title: 'Дармовіси',
    price: 250,
    image: '/images/arhimag/photo_9_2026-07-07_00-47-28.jpg',
    category: 'Дармовіси',
    description: 'Приємні дрібнички для фанатів',
    artist: 'Архімаг'
  },

  // --- Нові товари з папки teka (колишня Teka) ---
  {
    id: 'teka-1',
    title: 'Брелки Динозаврікі',
    price: 250,
    image: '/images/teka/photo_1_2026-07-07_01-40-10.jpg',
    category: 'Дармовіси',
    description: 'Динозаврікі',
    artist: 'Тека'
  },
  {
    id: 'teka-2',
    title: 'Піни з кришечок',
    price: 180,
    image: '/images/teka/photo_2_2026-07-07_01-40-10.jpg',
    category: 'Піни',
    description: 'Прикольні піни з кришечок для рюкзаків та одягу.',
    artist: 'Тека'
  },
  {
    id: 'teka-3',
    title: 'Піни з кришечок',
    price: 180,
    image: '/images/teka/photo_3_2026-07-07_01-40-10.jpg',
    category: 'Піни',
    description: 'Прикольні піни з кришечок для рюкзаків та одягу.',
    artist: 'Тека'
  },
  {
    id: 'teka-4',
    title: 'Піни з кришечок',
    price: 180,
    image: '/images/teka/photo_4_2026-07-07_01-40-10.jpg',
    category: 'Піни',
    description: 'Прикольні піни з кришечок для рюкзаків та одягу.',
    artist: 'Тека'
  },
  {
    id: 'teka-5',
    title: 'Брелки my little pony',
    price: 300,
    image: '/images/teka/photo_5_2026-07-07_01-40-10.jpg',
    category: 'Дармовіси',
    description: 'My little pony',
    artist: 'Тека'
  },
  // --- Товари автора Madred ---
  {
    id: 'madred-1',
    title: 'Друїдські стікери',
    price: 150,
    image: '/images/madred/photo_1_2026-07-07_02-07-31.jpg',
    category: 'Стікери',
    description: 'Набір друїдських стікерів, ламінація «зоряний пил».',
    artist: 'Madred'
  },
  {
    id: 'madred-2',
    title: 'Некромантські стікери',
    price: 150,
    image: '/images/madred/photo_2_2026-07-07_02-07-31.jpg',
    category: 'Стікери',
    description: 'Голографічні некромантські стікери розміром 6.5 см.',
    artist: 'Madred'
  },
  {
    id: 'madred-3',
    title: 'Стікери «Відьомські гриби»',
    price: 150,
    image: '/images/madred/photo_3_2026-07-07_02-07-31.jpg',
    category: 'Стікери',
    description: 'Матовий стікерпак формату А5 з магічними грибами.',
    artist: 'Madred'
  },
  {
    id: 'madred-4',
    title: 'Стікери «Дурні жаби»',
    price: 150,
    image: '/images/madred/photo_4_2026-07-07_02-07-31.jpg',
    category: 'Стікери',
    description: 'Кумедні матові жабки формату А5 для гарного настрою.',
    artist: 'Madred'
  },
  {
    id: 'madred-5',
    title: 'Дармовіс «Мертва голова»',
    price: 300,
    image: '/images/madred/photo_5_2026-07-07_02-07-31.jpg',
    category: 'Аксесуари',
    description: 'Двосторонній акриловий дармовіс із голографічним ефектом, ~8.5 см.',
    artist: 'Madred'
  },
  {
    id: 'madred-6',
    title: 'Дармовіс «Котики»',
    price: 60,
    image: '/images/madred/photo_6_2026-07-07_02-07-31.jpg',
    category: 'Аксесуари',
    description: 'Акриловий дармовіс поштучно з милим котиком, розмір до 4 см.',
    artist: 'Madred'
  },
  {
    id: 'madred-7',
    title: 'Листівка «Квіточки»',
    price: 80,
    image: '/images/madred/photo_7_2026-07-07_02-07-31.jpg',
    category: 'Листівки',
    description: 'Яскрава художня листівка формату А6 з квітковим мотивом.',
    artist: 'Madred'
  },
  {
    id: 'madred-8',
    title: 'Листівка «Корівка»',
    price: 80,
    image: '/images/madred/photo_8_2026-07-07_02-07-31.jpg',
    category: 'Листівки',
    description: 'Мила листівка формату А6 із затишним принтом корівки.',
    artist: 'Madred'
  },
  {
    id: 'madred-9',
    title: 'Дармовіс «Забудькувата жаба»',
    price: 280,
    image: '/images/madred/photo_9_2026-07-07_02-07-31.jpg',
    category: 'Аксесуари',
    description: 'Оригінальний акриловий дармовіс із написом «цейво забув», 5.5 см.',
    artist: 'Madred'
  },
  {
    id: 'madred-10',
    title: 'Листівка «Перелесник-Бард»',
    price: 120,
    image: '/images/madred/photo_10_2026-07-07_02-07-31.jpg',
    category: 'Листівки',
    description: 'Колекційна магічна листівка формату А6 з елементами фольгування.',
    artist: 'Madred'
  },
  {
    id: 'madred-11',
    title: 'Дармовіс «Свиня в джакузі»',
    price: 280,
    image: '/images/madred/photo_11_2026-07-07_02-07-31.jpg',
    category: 'Аксесуари',
    description: 'Двосторонній акриловий дармовіс із кумедною свинкою, орієнтовно 5.5 см.',
    artist: 'Madred'
  },
  {
    id: 'madred-12',
    title: 'Листівка «Гуси»',
    price: 80,
    image: '/images/madred/photo_12_2026-07-07_02-07-31.jpg',
    category: 'Листівки',
    description: 'Атмосферна листівка з гусями біля хатинки.',
    artist: 'Madred'
  },
  {
    id: 'madred-13',
    title: 'Стікерпак «Жаби»',
    price: 150,
    image: '/images/madred/photo_13_2026-07-07_02-07-31.jpg',
    category: 'Стікери',
    description: 'Набір матових наліпок формату А5 з різними жабками.',
    artist: 'Madred'
  },
  {
    id: 'madred-14',
    title: 'Набір «Шкрек»',
    price: 350,
    image: '/images/madred/photo_14_2026-07-07_02-07-31.jpg',
    category: 'Набори',
    description: 'Великий фірмовий комбо-набір: 2 стікерпаки + 1 листівка + 1 додатковий стікер.',
    artist: 'Madred'
  }
];
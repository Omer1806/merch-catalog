import type { Author } from './components/AuthorCard';
import madredAvatar from './assets/madred-avatar.png.jpg'; 
import arhimagAvatar from './assets/arhimag-avatar.jpg'; 
import tekaAvatar from './assets/teka-avatar.jpg';

export const AUTHORS: Author[] = [
  {
    id: 'madred',
    name: 'Madred',
    productArtist: 'Madred',
    location: 'Херсон, Україна',
    bio: 'Художниця, ілюстраторка і волонтерка з Херсона, яка створює оригінальний авторський мерч у фентезійному стилі.',
    philosophy: 'Люблю українізацію та створення персонажів, що поєднують фентезійну естетику з живою емоцією.',
    avatarUrl: madredAvatar,
    socials: {
      twitter: 'https://x.com/pandaRED7',
      instagram: 'https://www.instagram.com/mad___red',
      orderForm: 'https://docs.google.com/forms/d/e/1FAIpQLSfiPISbAvzDtqeRdTQTddrkhvkXzYAcTPkOcoTxfWj4hpNg8w/viewform?usp=send_form',
    },
  },
  {
  id: 'arhimag',
  name: "Архімаг Стася",
  productArtist: 'Архімаг',
  location: 'Artist from Kyiv 🐈',
  bio: 'Ілюстраторка та художниця з Києва, яка створює унікальні авторські роботи та мерч у фентезійному стилі.',
  philosophy: 'Моя творчість поєднує фентезійну естетику з живою емоцією, створюючи персонажів, які оживають на полотні.',
  avatarUrl: arhimagAvatar,
  socials: {
    threads: 'https://www.threads.com/@archimajik?xmt=AQG0TR6ilJPatwiLSv5c4OmCEM9gsFgJTRF8XugoV61ElUc',
    instagram: 'https://www.instagram.com/archimajik/',
  },
  extraLinks: [
    { label: 'Подивись мені в очі', url: 'https://www.instagram.com/le.gushka/' },
  ],
},
{
  id: 'teka',
  name: 'Teka',
  productArtist: 'Тека',
  location: 'Київ, Україна',
  bio: 'Художниця та ілюстраторка з Києва, яка створює авторські роботи та мерч у фентезійному стилі.',
  philosophy: 'Моя творчість поєднує фентезійну естетику з живою емоцією, створюючи персонажів, які оживають на полотні.',
  avatarUrl: tekaAvatar,
  socials: {
    instagram: 'https://www.instagram.com/zhabe.nya?igsh=MFd1d3BxOW03aGU5cQ%3D%3D',
    orderForm: 'https://linktr.ee/Tekari_kat?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQPOTM2NjE5NzQzMzkyNDU5AAGnqsgl...',
  },
  extraLinks: [
    { label: 'Другий Instagram', url: 'https://www.instagram.com/tekari_kat?igsh=MWdvc3JuODNncjE4cQ%3D%3D' },
  ],
},
  
];

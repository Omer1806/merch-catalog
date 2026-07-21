// src/components/AuthorCard.tsx
import { useEffect, useState } from 'react';

export interface AuthorLink {
  label: string;
  url: string;
}

export interface Author {
  id: string;
  name: string;
  productArtist?: string;
  location: string;
  bio: string;
  philosophy: string;
  avatarUrl: string;
  socials: {
    twitter?: string;
    instagram?: string;
    threads?: string;
    orderForm?: string;
  };
  extraLinks?: AuthorLink[];
}

export function AuthorCard({ author, onSelect }: { author: Author; onSelect?: (author: Author) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handlePointerMove = (event: React.MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;

    setTilt({
      x: (0.5 - px) * 8,
      y: (py - 0.5) * 8,
    });
  };

  const resetTilt = () => setTilt({ x: 0, y: 0 });

  return (
    <>
      {/* Картка у списку */}
      <button
        type="button"
        onClick={() => {
          onSelect?.(author);
          setIsOpen(true);
        }}
        onMouseMove={handlePointerMove}
        onMouseLeave={resetTilt}
        className="group relative w-full border-2 border-black p-4 rounded-lg shadow-[3px_3px_0px_rgba(0,0,0,1)] bg-white cursor-pointer text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-[6px_6px_0px_rgba(0,0,0,1)]"
        style={{
          transform: `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
          transition: 'transform 180ms ease-out, box-shadow 180ms ease-out, translate 180ms ease-out',
        }}
      >
        <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-br from-[#DBFA40]/40 via-transparent to-[#FF4FA3]/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <img
          src={author.avatarUrl}
          alt={author.name}
          className="relative z-10 w-20 h-20 rounded-full object-cover border-2 border-black mb-3 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3"
        />
        <h3 className="relative z-10 font-black text-lg text-black">{author.name}</h3>
        <p className="relative z-10 text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">{author.location}</p>
        <p className="relative z-10 text-sm text-gray-700 line-clamp-3">{author.bio}</p>
      </button>

      {/* Модальне вікно з деталями */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label={`Закрити профіль автора «${author.name}»`}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            style={{ animation: 'modalFadeIn 0.2s ease-out forwards' }}
          />

          <div
            className="bg-white w-full max-w-lg max-h-[calc(100dvh-2rem)] sm:max-h-[85vh] flex flex-col border-4 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative z-10 overflow-hidden"
            style={{ animation: 'modalScaleUp 0.25s ease-out forwards' }}
          >
            <div className="flex items-center justify-between border-b-4 border-black p-4 bg-[#FF4FA3]">
              <h2 className="text-xl sm:text-2xl font-black text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                Про автора
              </h2>
              <button
                type="button"
                aria-label={`Закрити профіль автора «${author.name}»`}
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-[#DBFA40] font-black text-xl bg-black bg-opacity-20 w-11 h-11 rounded-full flex items-center justify-center transition border border-black"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#FFFDF0] space-y-5">
              <div className="flex items-center gap-3 sm:gap-4">
                <img
                  src={author.avatarUrl}
                  alt={author.name}
                  className="w-16 h-16 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                />
                <div>
                  <h3 className="font-black text-xl sm:text-2xl text-black">{author.name}</h3>
                  <p className="text-xs text-gray-600 font-bold uppercase tracking-wider">{author.location}</p>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-gray-500 mb-1">Про художницю</h4>
                <p className="text-sm text-gray-800 leading-relaxed">{author.bio}</p>
              </div>

              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-gray-500 mb-1">Філософія творчості</h4>
                <p className="text-sm text-gray-800 leading-relaxed">{author.philosophy}</p>
              </div>

              <div className="border-t-2 border-dashed border-black pt-4 space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-gray-500 mb-2">Соціальні мережі</h4>

                {author.socials.instagram && (
                  <a
                    href={author.socials.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-white border-2 border-black rounded-lg px-4 py-2.5 font-bold text-black shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:bg-gray-50 active:translate-y-0.5 active:translate-x-0.5 active:shadow-none transition"
                  >
                    <span className="text-lg">📸</span> Instagram
                  </a>
                )}

                {author.socials.twitter && (
                  <a
                    href={author.socials.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-white border-2 border-black rounded-lg px-4 py-2.5 font-bold text-black shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:bg-gray-50 active:translate-y-0.5 active:translate-x-0.5 active:shadow-none transition"
                  >
                    <span className="text-lg">🐦</span> X (Twitter)
                  </a>
                )}

                {author.socials.threads && (
                  <a
                    href={author.socials.threads}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-white border-2 border-black rounded-lg px-4 py-2.5 font-bold text-black shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:bg-gray-50 active:translate-y-0.5 active:translate-x-0.5 active:shadow-none transition"
                  >
                    <span className="text-lg">🧵</span> Threads
                  </a>
                )}

                {author.extraLinks?.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-white border-2 border-black rounded-lg px-4 py-2.5 font-bold text-black shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:bg-gray-50 active:translate-y-0.5 active:translate-x-0.5 active:shadow-none transition"
                  >
                    <span className="text-lg">🔗</span> {link.label}
                  </a>
                ))}

                {author.socials.orderForm && (
                  <a
                    href={author.socials.orderForm}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-[#FFB37B] border-2 border-black rounded-lg px-4 py-2.5 font-black text-black shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:opacity-90 active:translate-y-0.5 active:translate-x-0.5 active:shadow-none transition"
                  >
                    <span className="text-lg">📝</span> Форма замовлення
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

import kurisuFixed from "../assets/kurisu-fixed.png";

export default function FloatingImageLink() {
  return (
    <a
      href="https://t.me/kurisushoop"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Telegram KURISU"
      className="fixed bottom-4 right-4 z-50 group cursor-pointer"
    >
      <img
        src={kurisuFixed}
        alt="Kurisu"
        className="
          w-24 md:w-28
          drop-shadow-[0_8px_16px_rgba(0,0,0,0.35)]
          animate-[kurisuFloat_4s_ease-in-out_infinite]
          transition-all
          duration-300
          group-hover:scale-110
          group-hover:-translate-y-1
        "
      />
    </a>
  );
}
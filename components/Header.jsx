import Link from "next/link";
import { toko } from "@/lib/toko";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-garis bg-latar/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="group flex items-center gap-2.5 rounded-xl py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-utama"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-utama text-sm font-black text-white shadow-xs transition-colors group-hover:bg-utama-gelap">
            {toko.nama ? toko.nama.charAt(0) : "T"}
          </span>
          <span className="text-lg font-extrabold tracking-tight text-teks transition-colors group-hover:text-utama">
            {toko.nama}
          </span>
        </Link>

        <nav aria-label="Navigasi utama" className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/#katalog"
            className="inline-flex min-h-[44px] items-center rounded-xl px-3 py-2 text-sm font-semibold text-teks-lembut transition-colors hover:bg-permukaan hover:text-utama focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-utama"
          >
            Katalog
          </Link>
          <Link
            href="/#kontak"
            className="inline-flex min-h-[44px] items-center rounded-xl px-3 py-2 text-sm font-semibold text-teks-lembut transition-colors hover:bg-permukaan hover:text-utama focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-utama"
          >
            Kontak
          </Link>
          <a
            href={`https://wa.me/${toko.nomorWhatsApp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-garis bg-latar px-3.5 py-2 text-xs font-bold text-teks transition-colors hover:border-utama hover:text-utama focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-utama"
          >
            <svg
              className="h-4 w-4 text-utama"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.18-2.587-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.106.005.249-.04.39.299.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.353.101.173.449.74 0.965 1.2 0.664.591 1.224.774 1.397.86.173.086.274.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.144.39-.086s1.011.477 1.184.564.289.13.332.202c.043.072.043.419-.101.824z" />
            </svg>
            <span>Chat WhatsApp</span>
          </a>
        </nav>
      </div>
    </header>
  );
}

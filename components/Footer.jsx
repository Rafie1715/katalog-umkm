import Link from "next/link";
import { toko } from "@/lib/toko";

export default function Footer() {
  return (
    <footer id="kontak" className="mt-20 border-t border-garis bg-permukaan/70 scroll-mt-10">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="md:col-span-2 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-utama text-xs font-black text-white">
                {toko.nama ? toko.nama.charAt(0) : "T"}
              </span>
              <h3 className="text-base font-extrabold text-teks">{toko.nama}</h3>
            </div>
            <p className="max-w-md text-sm text-teks-lembut leading-relaxed">
              {toko.tagline}
            </p>
            <div className="mt-2 flex flex-col gap-1.5 text-xs text-teks-lembut">
              <div className="flex items-start gap-2">
                <span className="font-semibold text-teks">Alamat:</span>
                <span>{toko.alamat}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-semibold text-teks">Jam buka:</span>
                <span>{toko.jamBuka}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-semibold text-teks">WhatsApp:</span>
                <a
                  href={`https://wa.me/${toko.nomorWhatsApp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-utama underline underline-offset-2 hover:text-utama-gelap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-utama rounded"
                >
                  +{toko.nomorWhatsApp}
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 md:items-end md:text-right">
            <h4 className="text-xs font-bold uppercase tracking-wider text-teks-lembut">Akses Pengelola</h4>
            <Link
              href="/admin"
              className="inline-flex min-h-[44px] items-center text-xs font-medium text-teks-lembut underline underline-offset-4 hover:text-utama focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-utama rounded"
            >
              Masuk sebagai admin
            </Link>
          </div>
        </div>

        <div className="mt-10 border-t border-garis/60 pt-6 text-xs text-teks-lembut flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <p>© {new Date().getFullYear()} {toko.nama}. Seluruh hak cipta dilindungi.</p>
          <p className="text-[11px]">Katalog UMKM Digital</p>
        </div>
      </div>
    </footer>
  );
}

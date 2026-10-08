import Tombol from "@/components/Tombol";

export default function TidakDitemukan() {
  return (
    <div className="flex flex-col items-start gap-4 py-16 sm:py-24">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-garis bg-permukaan text-utama">
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h1 className="text-3xl font-extrabold tracking-tight text-teks">
        Halaman tidak ditemukan
      </h1>
      <p className="max-w-md text-base leading-relaxed text-teks-lembut">
        Produk atau halaman yang kamu cari tidak ada atau sudah dihapus. Silakan kembali ke katalog untuk melihat produk lainnya.
      </p>
      <div className="pt-2">
        <Tombol href="/#katalog">Lihat semua produk</Tombol>
      </div>
    </div>
  );
}

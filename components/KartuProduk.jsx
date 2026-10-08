import Link from "next/link";
import { formatRupiah } from "@/lib/format";
import FotoProduk from "@/components/FotoProduk";

export default function KartuProduk({ produk }) {
  return (
    <Link
      href={`/produk/${produk.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-garis bg-latar shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-utama/50 hover:shadow-md motion-reduce:hover:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-utama focus-visible:ring-offset-2"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-permukaan">
        <FotoProduk
          fotoUrl={produk.foto_url}
          alt={produk.nama}
          priority={false}
          className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105 motion-reduce:group-hover:scale-100"
        />
        {produk.kategori ? (
          <span className="absolute left-2.5 top-2.5 rounded-md border border-garis/50 bg-latar/90 px-2 py-0.5 text-[11px] font-semibold text-teks-lembut shadow-xs backdrop-blur-xs">
            {produk.kategori}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col justify-between p-3.5 sm:p-4">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-teks leading-snug group-hover:text-utama transition-colors line-clamp-2">
            {produk.nama}
          </h3>
        </div>

        <div className="mt-3 pt-2">
          <span className="inline-block rounded-lg bg-harga-latar px-2.5 py-1 text-sm sm:text-base font-bold text-harga">
            {formatRupiah(produk.harga)}
          </span>
        </div>
      </div>
    </Link>
  );
}

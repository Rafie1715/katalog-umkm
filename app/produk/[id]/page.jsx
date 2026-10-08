import Link from "next/link";
import { notFound } from "next/navigation";
import PesanProduk from "@/components/PesanProduk";
import FotoProduk from "@/components/FotoProduk";
import { createServerClient } from "@/lib/supabase/server";
import { formatRupiah } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function HalamanDetailProduk({ params }) {
  const { id } = await params;
  const supabase = createServerClient();

  const { data: produk, error } = await supabase
    .from("produk")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !produk) {
    notFound();
  }

  return (
    <article className="py-6 sm:py-10 pb-28 sm:pb-12">
      <div className="mb-6">
        <Link
          href="/#katalog"
          className="inline-flex min-h-[44px] items-center gap-2 rounded-xl text-sm font-semibold text-teks-lembut transition-colors hover:text-utama focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-utama"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Kembali ke katalog</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
        <div className="overflow-hidden rounded-3xl border border-garis bg-permukaan shadow-xs">
          <FotoProduk
            fotoUrl={produk.foto_url}
            alt={produk.nama}
            priority={true}
            className="aspect-square w-full object-cover"
          />
        </div>

        <div className="flex flex-col gap-4 sm:gap-5">
          {produk.kategori && (
            <span className="self-start rounded-full border border-garis bg-permukaan px-3 py-1 text-xs font-semibold text-teks-lembut">
              {produk.kategori}
            </span>
          )}

          <h1 className="text-2xl font-extrabold leading-tight tracking-tight text-teks sm:text-3xl lg:text-4xl">
            {produk.nama}
          </h1>

          <div className="self-start rounded-xl bg-harga-latar px-4 py-2 text-2xl font-extrabold text-harga sm:text-3xl">
            {formatRupiah(produk.harga)}
          </div>

          <div className="border-t border-garis/60 pt-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-teks-lembut">
              Deskripsi Produk
            </h2>
            <p className="mt-2 max-w-prose text-base leading-relaxed text-teks whitespace-pre-line">
              {produk.deskripsi || "Tidak ada deskripsi untuk produk ini."}
            </p>
          </div>

          <div className="border-t border-garis/60 pt-4">
            <PesanProduk produk={produk} />
          </div>
        </div>
      </div>
    </article>
  );
}

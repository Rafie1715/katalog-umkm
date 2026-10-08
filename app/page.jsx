import Link from "next/link";
import { redirect } from "next/navigation";
import KartuProduk from "@/components/KartuProduk";
import FotoProduk from "@/components/FotoProduk";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";
import { toko } from "@/lib/toko";
import { formatRupiah } from "@/lib/format";
import { createServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

async function cari(formData) {
  "use server";
  const q = formData.get("q")?.toString().trim() || "";
  if (!q) {
    redirect("/");
  }
  redirect(`/?q=${encodeURIComponent(q)}#katalog`);
}

export default async function HalamanKatalog({ searchParams }) {
  const params = await searchParams;
  const query = params?.q?.toString().trim() || "";

  let daftarProduk = [];
  let errorPesan = null;

  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("produk")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      errorPesan = error.message;
    } else {
      daftarProduk = data || [];
    }
  } catch (err) {
    errorPesan = err.message || "Gagal terhubung ke database.";
  }

  // Saring produk berdasarkan nama tanpa membedakan huruf besar/kecil
  const kataKunci = query.toLowerCase();
  const produkTersaring = query
    ? daftarProduk.filter((produk) =>
        produk.nama?.toLowerCase().includes(kataKunci)
      )
    : daftarProduk;

  // Ambil maksimal 3 produk nyata untuk showcase bagian pembuka (hero)
  const produkHero = daftarProduk.slice(0, 3);

  return (
    <>
      {/* Bagian Pembuka (Hero) */}
      <section className="relative overflow-hidden py-10 sm:py-16">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Sisi Kiri: Teks & Aksi */}
          <div className={`${produkHero.length > 0 ? "lg:col-span-7" : "lg:col-span-9"} flex flex-col items-start`}>
            <div className="inline-flex items-center gap-2 rounded-full border border-garis bg-permukaan px-3.5 py-1 text-xs font-semibold text-utama">
              <span className="h-2 w-2 rounded-full bg-utama" />
              <span>Katalog Produk Lokal UMKM</span>
            </div>

            <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-teks sm:text-4xl lg:text-5xl">
              Karya &amp; Cita Rasa Pilihan dari {toko.nama}
            </h1>

            <p className="mt-4 max-w-xl text-base leading-relaxed text-teks-lembut sm:text-lg">
              {toko.tagline}
            </p>

            <div className="mt-3 flex items-center gap-2 text-xs sm:text-sm text-teks-lembut">
              <svg className="h-4 w-4 text-utama shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Buka: {toko.jamBuka}</span>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Tombol href="#katalog" className="gap-2 shadow-xs">
                <span>Jelajahi produk</span>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </Tombol>
              <a
                href={`https://wa.me/${toko.nomorWhatsApp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-garis bg-latar px-4 py-2.5 text-sm font-semibold text-teks transition-colors hover:border-utama hover:text-utama focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-utama"
              >
                Hubungi via WhatsApp
              </a>
            </div>
          </div>

          {/* Sisi Kanan: Showcase produk nyata (maksimal 3 produk jika ada) */}
          {produkHero.length > 0 && (
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl border border-garis bg-permukaan/60 p-4 sm:p-5">
                <div className="absolute inset-0 rounded-3xl motif-anyaman opacity-20 pointer-events-none" />
                <div className="relative flex flex-col gap-3">
                  <div className="flex items-center justify-between pb-1 text-xs font-bold text-teks-lembut uppercase tracking-wider">
                    <span>Cuplikan Produk</span>
                    <span>{produkHero.length} pilihan</span>
                  </div>

                  {/* Produk Utama di Hero */}
                  <Link
                    href={`/produk/${produkHero[0].id}`}
                    className="group relative flex overflow-hidden rounded-2xl border border-garis bg-latar shadow-xs transition-all duration-200 hover:shadow-md hover:border-utama/50"
                  >
                    <div className="aspect-square w-28 sm:w-32 shrink-0 bg-permukaan overflow-hidden">
                      <FotoProduk
                        fotoUrl={produkHero[0].foto_url}
                        alt={produkHero[0].nama}
                        priority={true}
                        ukuranBadge="sembunyi"
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-between p-3">
                      <div>
                        {produkHero[0].kategori && (
                          <span className="text-[11px] font-semibold text-teks-lembut">
                            {produkHero[0].kategori}
                          </span>
                        )}
                        <h2 className="text-sm font-bold text-teks group-hover:text-utama transition-colors line-clamp-2">
                          {produkHero[0].nama}
                        </h2>
                      </div>
                      <span className="self-start rounded-md bg-harga-latar px-2 py-0.5 text-xs font-bold text-harga">
                        {formatRupiah(produkHero[0].harga)}
                      </span>
                    </div>
                  </Link>

                  {/* Produk Tambahan (ke-2 dan ke-3 jika tersedia) */}
                  {produkHero.slice(1).map((produk) => (
                    <Link
                      key={produk.id}
                      href={`/produk/${produk.id}`}
                      className="group flex items-center gap-3 rounded-xl border border-garis/80 bg-latar/80 p-2.5 shadow-xs transition-all duration-200 hover:bg-latar hover:shadow-sm hover:border-utama/40"
                    >
                      <div className="h-14 w-14 shrink-0 rounded-lg overflow-hidden bg-permukaan border border-garis/40">
                        <FotoProduk
                          fotoUrl={produk.foto_url}
                          alt={produk.nama}
                          priority={true}
                          ukuranBadge="sembunyi"
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="flex flex-1 items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate text-xs font-bold text-teks group-hover:text-utama transition-colors">
                            {produk.nama}
                          </p>
                          <p className="text-[11px] text-teks-lembut truncate">
                            {produk.kategori || "Produk lokal"}
                          </p>
                        </div>
                        <span className="shrink-0 rounded-md bg-harga-latar px-2 py-0.5 text-xs font-bold text-harga">
                          {formatRupiah(produk.harga)}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Bagian Katalog Produk */}
      <section
        id="katalog"
        aria-labelledby="judul-katalog"
        className="scroll-mt-20 pt-6 pb-16 flex flex-col gap-6"
      >
        <div className="flex flex-col gap-1 border-b border-garis/70 pb-4">
          <h2 id="judul-katalog" className="text-2xl font-bold tracking-tight text-teks sm:text-3xl">
            Katalog Produk
          </h2>
          <p className="text-sm text-teks-lembut">
            Menampilkan {produkTersaring.length} produk{query ? ` untuk "${query}"` : ""}
          </p>
        </div>

        {/* Form Pencarian */}
        <form
          action={cari}
          className="flex flex-col gap-2.5 sm:max-w-xl sm:flex-row sm:items-end"
        >
          <div className="flex-1">
            <Input
              label="Cari produk"
              name="q"
              type="search"
              defaultValue={query}
              placeholder="Ketik nama produk..."
            />
          </div>
          <Tombol type="submit" className="gap-1.5 sm:self-end">
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span>Cari</span>
          </Tombol>
          {query && (
            <Tombol href="/#katalog" varian="garis" className="sm:self-end">
              Reset
            </Tombol>
          )}
        </form>

        {/* Keterangan Pencarian Aktif */}
        {query && (
          <div className="flex items-center gap-2 text-sm text-teks-lembut">
            <span>
              Hasil pencarian untuk &ldquo;<strong className="text-teks">{query}</strong>&rdquo;
            </span>
            <span>·</span>
            <Link
              href="/#katalog"
              className="font-medium text-utama underline underline-offset-4 hover:text-utama-gelap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-utama rounded"
            >
              Tampilkan semua produk
            </Link>
          </div>
        )}

        {/* State Tampilan: Gagal Memuat / Kosong / Hasil */}
        {errorPesan ? (
          <div
            className="rounded-2xl border border-bahaya/30 bg-red-50/70 p-5 text-bahaya"
            role="alert"
          >
            <div className="flex items-center gap-2 font-semibold">
              <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>Gagal memuat produk</span>
            </div>
            <p className="mt-1.5 text-sm text-teks-lembut">{errorPesan}</p>
          </div>
        ) : daftarProduk.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-garis bg-permukaan/50 p-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-latar border border-garis text-utama shadow-xs mb-3">
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <p className="text-lg font-bold text-teks">Belum ada produk</p>
            <p className="mt-1 max-w-sm text-sm text-teks-lembut">
              Katalog produk UMKM sedang dipersiapkan. Silakan kunjungi kembali nanti atau hubungi kami lewat WhatsApp.
            </p>
          </div>
        ) : produkTersaring.length === 0 ? (
          <div className="flex flex-col items-start gap-4 rounded-3xl border border-dashed border-garis bg-permukaan/50 p-8 sm:p-10">
            <div>
              <p className="text-lg font-bold text-teks">Produk tidak ditemukan</p>
              <p className="mt-1 text-sm text-teks-lembut">
                Tidak ada produk yang cocok dengan kata kunci &ldquo;{query}&rdquo;.
              </p>
            </div>
            <Tombol href="/#katalog" varian="garis">
              Lihat semua produk
            </Tombol>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3.5 sm:gap-6 md:grid-cols-3">
            {produkTersaring.map((produk) => (
              <KartuProduk key={produk.id} produk={produk} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

import { redirect } from "next/navigation";
import KartuProduk from "@/components/KartuProduk";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";
import { toko } from "@/lib/toko";
import { createServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

async function cari(formData) {
  "use server";
  const q = formData.get("q")?.toString().trim() || "";
  if (!q) {
    redirect("/");
  }
  redirect(`/?q=${encodeURIComponent(q)}`);
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

  return (
    <>
      <section className="py-10 sm:py-14">
        <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          {toko.nama}
        </h1>
        <p className="mt-3 max-w-xl text-lg text-teks-lembut">{toko.tagline}</p>
        <p className="mt-4 text-sm text-teks-lembut">{toko.jamBuka}</p>
      </section>

      <section aria-labelledby="judul-produk" className="flex flex-col gap-5">
        <h2 id="judul-produk" className="text-xl font-bold">
          Produk kami
        </h2>

        <form action={cari} className="flex flex-col gap-2 sm:max-w-md sm:flex-row sm:items-end">
          <div className="flex-1">
            <Input
              label="Cari produk"
              name="q"
              type="search"
              defaultValue={query}
              placeholder="Ketik nama produk..."
            />
          </div>
          <Tombol type="submit" className="sm:h-[46px]">
            Cari
          </Tombol>
        </form>

        {errorPesan ? (
          <div className="rounded-xl border border-garis bg-permukaan p-4 text-bahaya">
            <p className="font-semibold">Gagal memuat produk</p>
            <p className="mt-1 text-sm">{errorPesan}</p>
          </div>
        ) : daftarProduk.length === 0 ? (
          <p className="text-teks-lembut">Belum ada produk</p>
        ) : produkTersaring.length === 0 ? (
          <div className="flex flex-col items-start gap-3 py-6">
            <p className="text-teks-lembut">Produk tidak ditemukan</p>
            <Tombol href="/" varian="garis">
              Lihat semua produk
            </Tombol>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {produkTersaring.map((produk) => (
              <KartuProduk key={produk.id} produk={produk} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

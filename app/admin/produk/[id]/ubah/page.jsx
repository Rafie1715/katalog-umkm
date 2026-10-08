import { notFound, redirect } from "next/navigation";
import NavAdmin from "@/components/NavAdmin";
import FormProduk from "@/components/FormProduk";
import { createSessionClient } from "@/lib/supabase/session";
import { ubahProduk } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function HalamanUbahProduk({ params }) {
  const { id } = await params;

  const supabase = await createSessionClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/admin/login");
  }

  const idNum = Number(id);
  if (!id || !Number.isInteger(idNum) || idNum <= 0) {
    notFound();
  }

  const { data: produk, error } = await supabase
    .from("produk")
    .select("*")
    .eq("id", idNum)
    .maybeSingle();

  if (error) {
    return (
      <div className="flex flex-col gap-6 py-8">
        <NavAdmin />
        <h1 className="text-2xl font-extrabold">Ubah produk</h1>
        <div className="rounded-xl border border-garis bg-permukaan p-4 text-bahaya">
          <p className="font-semibold">Gagal memuat produk</p>
          <p className="mt-1 text-sm">{error.message || "Gagal terhubung ke database."}</p>
        </div>
      </div>
    );
  }

  if (!produk) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <h1 className="text-2xl font-extrabold">Ubah produk</h1>
      <FormProduk produk={produk} labelTombol="Simpan perubahan" action={ubahProduk} />
    </div>
  );
}

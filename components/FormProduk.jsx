"use client";

import { useActionState } from "react";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";
import { tambahProduk } from "@/app/admin/actions";

// Dipakai untuk tambah produk (US-08) dan ubah produk (US-09). Keduanya bonus di jalur offline.
// Nama field sama dengan kolom tabel "produk".
export default function FormProduk({ produk = {}, labelTombol, action = tambahProduk }) {
  const [state, formAction, isPending] = useActionState(action, null);

  const nilaiNama = state?.values?.nama ?? produk.nama ?? "";
  const nilaiHarga =
    state?.values?.harga ?? (produk.harga !== undefined ? String(produk.harga) : "");
  const nilaiKategori = state?.values?.kategori ?? produk.kategori ?? "";
  const nilaiFotoUrl = state?.values?.foto_url ?? produk.foto_url ?? "";
  const nilaiDeskripsi = state?.values?.deskripsi ?? produk.deskripsi ?? "";

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-4">
      {state?.error && (
        <div className="rounded-xl border border-garis bg-permukaan p-3 text-sm text-bahaya">
          {state.error}
        </div>
      )}

      {produk.id && <input type="hidden" name="id" value={produk.id} />}

      <Input
        label="Nama produk"
        name="nama"
        key={`nama-${state?.timestamp || "init"}`}
        defaultValue={nilaiNama}
        required
      />
      <Input
        label="Harga (Rp)"
        name="harga"
        type="number"
        min="0"
        key={`harga-${state?.timestamp || "init"}`}
        defaultValue={nilaiHarga}
        required
      />
      <Input
        label="Kategori"
        name="kategori"
        key={`kategori-${state?.timestamp || "init"}`}
        defaultValue={nilaiKategori}
      />
      <Input
        label="Link foto"
        name="foto_url"
        placeholder="https://... atau /produk/nama-file.svg"
        key={`foto_url-${state?.timestamp || "init"}`}
        defaultValue={nilaiFotoUrl}
      />
      <Input
        label="Deskripsi"
        name="deskripsi"
        textarea
        key={`deskripsi-${state?.timestamp || "init"}`}
        defaultValue={nilaiDeskripsi}
      />
      <div className="flex gap-3">
        <Tombol type="submit" disabled={isPending}>
          {isPending ? "Menyimpan..." : labelTombol}
        </Tombol>
        <Tombol href="/admin" varian="garis">
          Batal
        </Tombol>
      </div>
    </form>
  );
}

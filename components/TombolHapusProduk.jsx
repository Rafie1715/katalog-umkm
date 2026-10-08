"use client";

import { useTransition } from "react";
import Tombol from "@/components/Tombol";
import { hapusProduk } from "@/app/admin/actions";

export default function TombolHapusProduk({ id, nama }) {
  const [isPending, startTransition] = useTransition();

  const handleHapus = () => {
    const konfirmasi = window.confirm(
      `Apakah Anda yakin ingin menghapus produk "${nama}"?`
    );

    if (!konfirmasi) {
      return;
    }

    startTransition(async () => {
      const res = await hapusProduk(id);
      if (res?.error) {
        alert(res.error);
      }
    });
  };

  return (
    <Tombol
      type="button"
      varian="bahaya"
      onClick={handleHapus}
      disabled={isPending}
      className="disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isPending ? "Menghapus..." : "Hapus"}
    </Tombol>
  );
}


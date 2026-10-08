"use client";

import { useState } from "react";
import Input from "@/components/Input";
import TombolWhatsApp from "@/components/TombolWhatsApp";
import { formatRupiah } from "@/lib/format";

export default function PesanProduk({ produk }) {
  const [jumlahText, setJumlahText] = useState("1");

  let pesanValidasi = null;
  let validJumlah = null;

  const trimmed = jumlahText.trim();
  if (!trimmed) {
    pesanValidasi = "Jumlah wajib diisi.";
  } else {
    const num = Number(trimmed);
    if (isNaN(num)) {
      pesanValidasi = "Jumlah harus berupa angka valid.";
    } else if (!Number.isInteger(num)) {
      pesanValidasi = "Jumlah harus berupa bilangan bulat.";
    } else if (num < 1) {
      pesanValidasi = "Jumlah minimal 1.";
    } else if (num > 999) {
      pesanValidasi = "Jumlah maksimal 999.";
    } else {
      validJumlah = num;
    }
  }

  const isValid = validJumlah !== null;
  const total = isValid ? formatRupiah(produk.harga * validJumlah) : "-";

  return (
    <div className="flex flex-col gap-4 pt-2">
      <div className="w-32">
        <Input
          label="Jumlah"
          name="jumlah"
          type="number"
          min="1"
          max="999"
          step="1"
          value={jumlahText}
          onChange={(e) => setJumlahText(e.target.value)}
        />
      </div>

      {pesanValidasi && (
        <p className="text-sm font-medium text-bahaya">{pesanValidasi}</p>
      )}

      <div className="flex items-baseline justify-between rounded-lg border border-garis bg-permukaan p-3 sm:max-w-xs">
        <span className="text-sm font-medium text-teks-lembut">Total harga:</span>
        <span className="text-lg font-bold text-harga">{total}</span>
      </div>

      <TombolWhatsApp
        produk={produk}
        jumlah={validJumlah ?? 1}
        disabled={!isValid}
      />
    </div>
  );
}


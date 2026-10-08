"use client";

import { useState } from "react";
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

  const ubahJumlah = (delta) => {
    const current = Number(jumlahText) || 1;
    const baru = Math.max(1, Math.min(999, current + delta));
    setJumlahText(String(baru));
  };

  return (
    <div className="flex flex-col gap-5 pt-3">
      <div className="flex flex-col gap-2">
        <label htmlFor="input-jumlah" className="text-sm font-semibold text-teks">
          Jumlah pesanan
        </label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => ubahJumlah(-1)}
            disabled={Number(jumlahText) <= 1}
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl border border-garis bg-latar text-lg font-bold text-teks transition-colors hover:bg-permukaan active:bg-garis focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-utama disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Kurangi jumlah pesanan"
          >
            −
          </button>
          <input
            id="input-jumlah"
            name="jumlah"
            type="number"
            min="1"
            max="999"
            step="1"
            value={jumlahText}
            onChange={(e) => setJumlahText(e.target.value)}
            className="h-11 w-20 rounded-xl border border-garis bg-latar text-center text-base font-bold text-teks transition-colors focus:border-utama focus:ring-2 focus:ring-utama/20 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => ubahJumlah(1)}
            disabled={Number(jumlahText) >= 999}
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl border border-garis bg-latar text-lg font-bold text-teks transition-colors hover:bg-permukaan active:bg-garis focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-utama disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Tambah jumlah pesanan"
          >
            +
          </button>
        </div>
      </div>

      {pesanValidasi && (
        <p className="text-sm font-semibold text-bahaya" role="alert">
          {pesanValidasi}
        </p>
      )}

      <div className="flex items-baseline justify-between rounded-2xl border border-garis bg-permukaan/70 p-4 sm:max-w-md">
        <div className="flex flex-col">
          <span className="text-xs font-medium text-teks-lembut">
            Total pesanan ({validJumlah ?? 1} item)
          </span>
          <span className="text-2xl font-extrabold text-harga">{total}</span>
        </div>
        <span className="text-xs text-teks-lembut">
          @ {formatRupiah(produk.harga)}
        </span>
      </div>

      <div className="pt-1">
        <TombolWhatsApp
          produk={produk}
          jumlah={validJumlah ?? 1}
          disabled={!isValid}
        />
      </div>

      {/* Bar pesanan sticky untuk layar HP */}
      <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-garis bg-latar/95 px-4 py-3 shadow-lg backdrop-blur-md sm:hidden pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-[11px] font-medium text-teks-lembut">Total ({validJumlah ?? 1} item)</span>
            <span className="text-base font-extrabold text-harga">{total}</span>
          </div>
          <div className="flex-1 max-w-[200px]">
            <TombolWhatsApp
              produk={produk}
              jumlah={validJumlah ?? 1}
              disabled={!isValid}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

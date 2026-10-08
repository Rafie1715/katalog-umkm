"use client";

import { useState } from "react";
import { resolveFotoProduk } from "@/lib/produk-gambar";

/**
 * Komponen bersama untuk menampilkan foto produk dengan:
 * - Pemetaan otomatis path bawaan ke aset baru melalui resolveFotoProduk.
 * - Prioritas URL kustom yang diinput oleh admin.
 * - Fallback lokal "Foto belum tersedia" saat URL kosong atau gambar gagal dimuat (tanpa error loop).
 * - Penanda "Gambar ilustrasi" hanya pada aset ilustrasi (bukan foto asli toko).
 * - Pencegahan layout shift dengan rasio aspek konsisten dan lazy-loading.
 */
export default function FotoProduk({
  fotoUrl,
  alt = "",
  className = "h-full w-full object-cover",
  aspectRatio = "aspect-square",
  priority = false,
  tampilkanBadgeIlustrasi = true,
  ukuranBadge = "normal",
}) {
  const [hasError, setHasError] = useState(false);
  const info = resolveFotoProduk(fotoUrl);

  const altTampil = alt || info.altDefault || "";
  const isFallback = hasError || info.isFallback || !info.src;

  return (
    <div
      className={`relative ${aspectRatio} w-full overflow-hidden bg-permukaan flex items-center justify-center`}
    >
      {isFallback ? (
        <div
          className="flex h-full w-full flex-col items-center justify-center p-3 text-center text-teks-lembut select-none"
          role="img"
          aria-label="Foto belum tersedia"
        >
          <svg
            className="h-8 w-8 text-teks-lembut/50 mb-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="text-xs font-medium">Foto belum tersedia</span>
        </div>
      ) : (
        <>
          <img
            src={info.src}
            alt={altTampil}
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
            onError={() => setHasError(true)}
            className={className}
          />
          {info.isIlustrasi && tampilkanBadgeIlustrasi && ukuranBadge !== "sembunyi" && (
            <span
              className={`absolute bottom-2 left-2 rounded-md bg-teks/80 px-2 py-0.5 font-medium text-white shadow-xs backdrop-blur-xs select-none ${
                ukuranBadge === "kecil" ? "text-[9px]" : "text-[10px]"
              }`}
            >
              Gambar ilustrasi
            </span>
          )}
        </>
      )}
    </div>
  );
}


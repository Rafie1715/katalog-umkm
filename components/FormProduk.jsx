"use client";

import { useActionState, useState, useRef } from "react";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";
import { tambahProduk, buatDeskripsiAI } from "@/app/admin/actions";

// Dipakai untuk tambah produk (US-08) dan ubah produk (US-09). Keduanya bonus di jalur offline.
// Nama field sama dengan kolom tabel "produk".
export default function FormProduk({ produk = {}, labelTombol, action = tambahProduk }) {
  const [state, formAction, isPending] = useActionState(action, null);
  const formRef = useRef(null);

  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiError, setAiError] = useState(null);

  const nilaiNama = state?.values?.nama ?? produk.nama ?? "";
  const nilaiHarga =
    state?.values?.harga ?? (produk.harga !== undefined ? String(produk.harga) : "");
  const nilaiKategori = state?.values?.kategori ?? produk.kategori ?? "";
  const nilaiFotoUrl = state?.values?.foto_url ?? produk.foto_url ?? "";
  const nilaiDeskripsi = state?.values?.deskripsi ?? produk.deskripsi ?? "";

  const handleBuatDeskripsiAI = async () => {
    if (isGeneratingAI || isPending) return;

    const form = formRef.current;
    if (!form) return;

    const currentNama = form.elements["nama"]?.value?.trim() || "";
    const currentKategori = form.elements["kategori"]?.value?.trim() || "";
    const currentDeskripsi = form.elements["deskripsi"]?.value || "";

    setAiError(null);

    if (!currentNama) {
      setAiError("Nama produk wajib diisi sebelum membuat deskripsi dengan AI.");
      return;
    }

    if (!currentKategori) {
      setAiError("Kategori produk wajib diisi sebelum membuat deskripsi dengan AI.");
      return;
    }

    if (currentDeskripsi.trim().length > 0) {
      const konfirmasi = window.confirm(
        "Kolom deskripsi sudah terisi. Apakah Anda yakin ingin menggantinya dengan saran deskripsi dari AI?"
      );
      if (!konfirmasi) {
        return;
      }
    }

    setIsGeneratingAI(true);
    const requestedNama = currentNama;
    const requestedKategori = currentKategori;

    try {
      const res = await buatDeskripsiAI({
        nama: currentNama,
        kategori: currentKategori,
      });

      if (res?.error) {
        setAiError(res.error);
      } else if (res?.deskripsi) {
        // Cek apakah admin mengubah nama/kategori saat request sedang berlangsung
        const latestNama = form.elements["nama"]?.value?.trim() || "";
        const latestKategori = form.elements["kategori"]?.value?.trim() || "";

        if (latestNama !== requestedNama || latestKategori !== requestedKategori) {
          const konfirmasiTimpa = window.confirm(
            "Nama atau kategori telah diubah saat AI memproses. Tetap pasang deskripsi yang baru dibuat?"
          );
          if (!konfirmasiTimpa) {
            return;
          }
        }

        const textarea = form.elements["deskripsi"];
        if (textarea) {
          textarea.value = res.deskripsi;
        }
      }
    } catch {
      setAiError("Terjadi kesalahan saat memproses deskripsi dengan AI. Silakan coba lagi.");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  return (
    <form ref={formRef} action={formAction} className="flex max-w-xl flex-col gap-4">
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

      <div className="flex flex-col gap-1.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label htmlFor="deskripsi-field" className="text-sm font-semibold">
            Deskripsi
          </label>
          <button
            type="button"
            onClick={handleBuatDeskripsiAI}
            disabled={isGeneratingAI || isPending}
            className="inline-flex items-center justify-center rounded-lg border border-garis bg-latar px-3 py-1.5 text-xs font-semibold text-teks transition-colors hover:border-utama hover:text-utama disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isGeneratingAI ? "Membuat deskripsi..." : "✨ Buat deskripsi dengan AI"}
          </button>
        </div>

        {aiError && (
          <p className="rounded-lg border border-garis bg-permukaan p-2.5 text-xs text-bahaya">
            {aiError}
          </p>
        )}

        <textarea
          id="deskripsi-field"
          name="deskripsi"
          rows={4}
          key={`deskripsi-${state?.timestamp || "init"}`}
          defaultValue={nilaiDeskripsi}
          className="w-full rounded-lg border border-garis bg-latar px-3 py-2.5 text-base text-teks placeholder:text-teks-lembut focus:border-utama focus:outline-none"
        />
      </div>

      <div className="flex gap-3">
        <Tombol type="submit" disabled={isPending || isGeneratingAI}>
          {isPending ? "Menyimpan..." : labelTombol}
        </Tombol>
        <Tombol href="/admin" varian="garis">
          Batal
        </Tombol>
      </div>
    </form>
  );
}

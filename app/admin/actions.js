"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createSessionClient } from "@/lib/supabase/session";

export async function login(arg1, arg2) {
  const formData = arg1 instanceof FormData ? arg1 : (arg2 instanceof FormData ? arg2 : null);

  const email = formData?.get("email")?.toString().trim();
  const password = formData?.get("password")?.toString();

  if (!email || !password) {
    const pesan = "Email dan password wajib diisi.";
    if (arg1 instanceof FormData) {
      redirect(`/admin/login?error=${encodeURIComponent(pesan)}`);
    }
    return { error: pesan };
  }

  const supabase = await createSessionClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    let pesanError = "Login gagal. Periksa kembali email dan password.";
    if (error.message?.toLowerCase().includes("invalid login credentials")) {
      pesanError = "Email atau password salah.";
    } else {
      pesanError = error.message;
    }

    if (arg1 instanceof FormData) {
      redirect(`/admin/login?error=${encodeURIComponent(pesanError)}`);
    }
    return { error: pesanError };
  }

  redirect("/admin");
}

export async function keluar() {
  const supabase = await createSessionClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function gantiPassword(arg1, arg2) {
  const formData = arg1 instanceof FormData ? arg1 : (arg2 instanceof FormData ? arg2 : null);

  const passwordBaru = formData?.get("password_baru")?.toString();
  const konfirmasiPassword = formData?.get("konfirmasi_password")?.toString();

  const supabase = await createSessionClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/admin/login?error=" + encodeURIComponent("Silakan login terlebih dahulu."));
  }

  if (!passwordBaru || !konfirmasiPassword) {
    const pesan = "Password baru dan konfirmasi password wajib diisi.";
    if (arg1 instanceof FormData) {
      redirect(`/admin/password?error=${encodeURIComponent(pesan)}`);
    }
    return { error: pesan };
  }

  if (passwordBaru.length < 8) {
    const pesan = "Password baru minimal 8 karakter.";
    if (arg1 instanceof FormData) {
      redirect(`/admin/password?error=${encodeURIComponent(pesan)}`);
    }
    return { error: pesan };
  }

  if (passwordBaru !== konfirmasiPassword) {
    const pesan = "Konfirmasi password tidak cocok dengan password baru.";
    if (arg1 instanceof FormData) {
      redirect(`/admin/password?error=${encodeURIComponent(pesan)}`);
    }
    return { error: pesan };
  }

  const { error } = await supabase.auth.updateUser({ password: passwordBaru });

  if (error) {
    const pesan = error.message || "Gagal mengganti password.";
    if (arg1 instanceof FormData) {
      redirect(`/admin/password?error=${encodeURIComponent(pesan)}`);
    }
    return { error: pesan };
  }

  const pesanBerhasil = "Password berhasil diganti.";
  if (arg1 instanceof FormData) {
    redirect(`/admin/password?berhasil=${encodeURIComponent(pesanBerhasil)}`);
  }
  return { berhasil: pesanBerhasil };
}

export async function tambahProduk(prevState, formData) {
  const data = formData instanceof FormData ? formData : prevState;

  const rawNama = data instanceof FormData ? data.get("nama") : data?.nama;
  const rawHarga = data instanceof FormData ? data.get("harga") : data?.harga;
  const rawKategori = data instanceof FormData ? data.get("kategori") : data?.kategori;
  const rawFotoUrl = data instanceof FormData ? data.get("foto_url") : data?.foto_url;
  const rawDeskripsi = data instanceof FormData ? data.get("deskripsi") : data?.deskripsi;

  const values = {
    nama: rawNama?.toString() || "",
    harga: rawHarga?.toString() || "",
    kategori: rawKategori?.toString() || "",
    foto_url: rawFotoUrl?.toString() || "",
    deskripsi: rawDeskripsi?.toString() || "",
  };

  const supabase = await createSessionClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      error: "Tidak diizinkan: Anda harus login sebagai admin terlebih dahulu.",
      values,
      timestamp: Date.now(),
    };
  }

  // Validasi: nama setelah trim wajib terisi
  const nama = values.nama.trim();
  if (!nama) {
    return {
      error: "Nama produk wajib diisi.",
      values,
      timestamp: Date.now(),
    };
  }

  // Validasi: harga wajib diisi dan berupa angka finite minimal 0
  const trimmedHarga = values.harga.trim();
  if (!trimmedHarga) {
    return {
      error: "Harga wajib diisi.",
      values,
      timestamp: Date.now(),
    };
  }

  const hargaNum = Number(trimmedHarga);
  if (!Number.isFinite(hargaNum) || hargaNum < 0) {
    return {
      error: "Harga harus berupa angka valid dan minimal 0.",
      values,
      timestamp: Date.now(),
    };
  }

  // Validasi: foto_url jika diisi hanya menerima URL http/https atau path aset lokal valid
  const trimmedFoto = values.foto_url.trim();
  let foto_url = null;
  if (trimmedFoto) {
    const isHttp = /^https?:\/\/.+/i.test(trimmedFoto);
    const isLocalAsset = /^\/[^\s]+$/.test(trimmedFoto);
    if (!isHttp && !isLocalAsset) {
      return {
        error: "Link foto harus berupa URL (http/https) atau path aset lokal (diawali dengan /).",
        values,
        timestamp: Date.now(),
      };
    }
    foto_url = trimmedFoto;
  }

  const kategori = values.kategori.trim() || null;
  const deskripsi = values.deskripsi.trim() || null;
  const hargaFinal = Math.round(hargaNum);

  const { error: insertError } = await supabase.from("produk").insert({
    nama,
    harga: hargaFinal,
    deskripsi,
    foto_url,
    kategori,
  });

  if (insertError) {
    return {
      error: "Gagal menyimpan produk: " + insertError.message,
      values,
      timestamp: Date.now(),
    };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin?berhasil=" + encodeURIComponent("Produk berhasil ditambahkan."));
}

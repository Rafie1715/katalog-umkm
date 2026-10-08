"use server";

import { redirect } from "next/navigation";
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

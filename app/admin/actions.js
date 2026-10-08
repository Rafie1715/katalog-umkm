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


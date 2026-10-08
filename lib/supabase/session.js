import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createSessionClient() {
  let cookieStore = null;
  try {
    cookieStore = await cookies();
  } catch {
    // Dipanggil di luar konteks request (misalnya testing script)
  }

  const url = process.env.SUPABASE_URL?.trim()
    ?.replace(/^["']|["']$/g, "")
    ?.replace(/\/rest\/v1\/?$/, "")
    ?.replace(/\/+$/, "");
  const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY?.trim()
    ?.replace(/^["']|["']$/g, "");

  if (!url || !publishableKey) {
    throw new Error(
      "SUPABASE_URL dan SUPABASE_PUBLISHABLE_KEY belum diatur di environment variable."
    );
  }

  return createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return cookieStore ? cookieStore.getAll() : [];
      },
      setAll(cookiesToSet) {
        if (!cookieStore) return;
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Ignore if called from a Server Component
        }
      },
    },
  });
}

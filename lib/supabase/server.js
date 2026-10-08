import { createClient } from "@supabase/supabase-js";

export function createServerClient() {
  const url = process.env.SUPABASE_URL?.trim()
    ?.replace(/^["']|["']$/g, "")
    ?.replace(/\/rest\/v1\/?$/, "")
    ?.replace(/\/+$/, "");
  const secretKey = process.env.SUPABASE_SECRET_KEY?.trim()?.replace(/^["']|["']$/g, "");

  if (!url || !secretKey) {
    throw new Error(
      "SUPABASE_URL dan SUPABASE_SECRET_KEY belum diatur di environment variable."
    );
  }

  return createClient(url, secretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export { createServerClient as createClient };
export default createServerClient;


export function readSupabaseConfig(env: { VITE_SUPABASE_URL?: string; VITE_SUPABASE_PUBLISHABLE_KEY?: string }) {
  const key = env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim();
  const value = env.VITE_SUPABASE_URL?.trim();
  if (!key || !value) return null;

  try {
    const url = new URL(value);
    const local = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
    if (url.protocol !== "https:" && !(local && url.protocol === "http:")) return null;
    if (url.username || url.password || url.search || url.hash) return null;
    return { url: url.href.replace(/\/$/, ""), key };
  } catch {
    return null;
  }
}

export const supabaseConfig = readSupabaseConfig({ VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY });

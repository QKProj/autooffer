import { createClient, SupabaseClient, User, Session } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Client-side Supabase instance (uses anon key, respects RLS)
export const supabaseAuth: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// ═══════════════════════════════════════════
// AUTH HELPERS
// ═══════════════════════════════════════════

export async function signUp(email: string, password: string): Promise<{ user: User | null; error: string | null }> {
  const { data, error } = await supabaseAuth.auth.signUp({ email, password });
  if (error) return { user: null, error: error.message };
  return { user: data.user, error: null };
}

export async function signIn(email: string, password: string): Promise<{ user: User | null; error: string | null }> {
  const { data, error } = await supabaseAuth.auth.signInWithPassword({ email, password });
  if (error) return { user: null, error: error.message };
  return { user: data.user, error: null };
}

export async function signOut(): Promise<void> {
  await supabaseAuth.auth.signOut();
}

export async function getSession(): Promise<Session | null> {
  const { data } = await supabaseAuth.auth.getSession();
  return data.session;
}

export async function getUser(): Promise<User | null> {
  const { data } = await supabaseAuth.auth.getUser();
  return data.user;
}

export function onAuthStateChange(callback: (user: User | null) => void) {
  return supabaseAuth.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null);
  });
}


import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Variables de entorno VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY no están definidas.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

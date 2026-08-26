import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  (import.meta.env.VITE_SUPABASE_URL as string) ||
  (typeof process !== "undefined" && process.env?.VITE_SUPABASE_URL) ||
  "https://zdyygdivjhftirykvjjk.supabase.co";

const supabaseKey =
  (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string) ||
  (typeof process !== "undefined" && process.env?.VITE_SUPABASE_PUBLISHABLE_KEY) ||
  "sb_publishable_V6TPJryhSdRjDPsW8f07OA_b11osYAw";

export const supabase = createClient(supabaseUrl, supabaseKey);

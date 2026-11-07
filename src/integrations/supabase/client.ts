import { createClient } from "@supabase/supabase-js";
import { supabaseConfig } from "./config";

if (!supabaseConfig) throw new Error("Supabase deployment configuration is missing or invalid.");

export const supabase = createClient(supabaseConfig.url, supabaseConfig.key);

import { env } from "../config/env";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

export const getDbClient = () => {
  if (!env.supabaseUrl || !env.supabaseServiceKey) {
    return null;
  }
  if (!client) client = createClient(env.supabaseUrl, env.supabaseServiceKey, { auth: { persistSession: false, autoRefreshToken: false } });
  return client;
};

export function requireDb(): SupabaseClient {
  const db = getDbClient();
  if (!db) { const error = new Error("Database is not ready. Configure the backend service-role credentials and run the migrations."); (error as Error & { statusCode: number }).statusCode = 503; throw error; }
  return db;
}


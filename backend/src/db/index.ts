// TEAMMATE: Supabase client initialization and database helpers
// When Supabase credentials are configured, initialize the client here.

import { env } from "../config/env";

export const getDbClient = () => {
  if (!env.supabaseUrl || !env.supabaseServiceKey) {
    return null;
  }
  // Teammate will initialize:
  // return createClient(env.supabaseUrl, env.supabaseServiceKey);
  return null;
};

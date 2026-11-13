import { getDbClient } from "../db";

const required: Record<string, string> = {
  profiles: "id,username,username_chosen,onboarding_completed,timezone,longest_streak,avatar_id",
  challenges: "id,node_id,base_xp,order_index",
  skill_nodes: "id,language,position,title,description,is_boss",
  skill_node_challenges: "node_id,challenge_id,position",
  user_languages: "user_id,language,last_challenge_id,xp,completed_count",
  challenge_progress: "user_id,challenge_id,language,status,attempts,best_passed,total_tests,xp_awarded",
  xp_events: "id,user_id,amount,reason,challenge_id,language,created_at",
  badges: "id,name,description,icon",
  user_badges: "user_id,badge_id,earned_at",
};

async function main() {
  const db = getDbClient();
  if (!db) { console.error("Database is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_KEY in backend/.env."); process.exitCode = 1; return; }
  const missing: string[] = [];
  for (const [table, columns] of Object.entries(required)) {
    const { error } = await db.from(table).select(columns).limit(1);
    if (error) missing.push(`${table}: ${error.message}`);
  }
  if (missing.length) { console.error("Database is not ready:\n" + missing.join("\n")); process.exitCode = 1; return; }
  console.log("Database schema check passed: all required tables and columns are available.");
}
main().catch((error) => { console.error("Database check failed:", error.message); process.exitCode = 1; });

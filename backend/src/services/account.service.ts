import { requireDb } from "../db";
import { levelForXp, xpForLevel } from "../config/progression";

export const LANGUAGES = ["python", "javascript", "cpp"] as const;
export type Language = typeof LANGUAGES[number];

export function validLanguage(value: unknown): value is Language { return typeof value === "string" && (LANGUAGES as readonly string[]).includes(value); }
export async function ensureProfile(user: { id: string; email?: string }) {
  const db = requireDb();
  const { error } = await db.from("profiles").upsert({ id: user.id, email: user.email ?? null, username: "Coder", username_chosen: false, streak_days: 0 }, { onConflict: "id", ignoreDuplicates: true });
  if (error) throw error;
  const { data, error: readError } = await db.from("profiles").select("*").eq("id", user.id).single();
  if (readError) throw readError;
  return data;
}
export function levelSummary(xp: number) { const level = levelForXp(xp); const floor = (level - 1) ** 2 * 100; return { level, xpIntoLevel: xp - floor, xpForNextLevel: xpForLevel(level) - floor }; }

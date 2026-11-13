// TEAMMATE: replace this mock, keep the response shape
import { AttemptPayload, ProgressResponse } from "@mentor/shared";
import { requireDb } from "../db";
import { completionXp, levelForXp, xpForLevel } from "../config/progression";

export class ProgressService {
  async recordAttempt(attempt: AttemptPayload, userId: string): Promise<ProgressResponse> {
    const language = attempt.language || "python";
    const db = requireDb();
    if (attempt.passed > attempt.total || attempt.total < 1) { const error = new Error("Invalid test totals."); (error as Error & { statusCode:number }).statusCode=400; throw error; }
    const { data: challenge, error: challengeError } = await db.from("challenges").select("id,base_xp,test_cases").eq("id",attempt.challengeId).single();
    if (challengeError || !challenge) throw challengeError || new Error("Challenge not found.");
    const expectedTests = Array.isArray(challenge.test_cases) ? challenge.test_cases.length : attempt.total;
    if (attempt.total !== expectedTests) { const error=new Error("Test total does not match this challenge."); (error as Error & {statusCode:number}).statusCode=400; throw error; }
    const { data: previous } = await db.from("challenge_progress").select("*").eq("user_id",userId).eq("challenge_id",attempt.challengeId).eq("language",language).maybeSingle();
    if (attempt.passed !== attempt.total || previous?.status === "completed") return { xpGained:0,totalXp:0,level:1,streak:0,newBadges:[],nextChallengeId:"" };
    const { data: hints } = await db.from("mentor_events").select("hint_level").eq("user_id",userId).eq("challenge_id",attempt.challengeId).eq("language",language);
    const maxHint=Math.max(0,...(hints??[]).map((x:any)=>x.hint_level||0)); const awarded=completionXp(challenge.base_xp, maxHint);
    await db.from("challenge_progress").upsert({user_id:userId,challenge_id:attempt.challengeId,language,status:"completed",attempts:(previous?.attempts||0)+1,best_passed:attempt.total,total_tests:attempt.total,first_completed_at:new Date().toISOString(),last_attempt_at:new Date().toISOString(),xp_awarded:awarded},{onConflict:"user_id,challenge_id,language"});
    await db.from("xp_events").insert({user_id:userId,amount:awarded,reason:"challenge_completed",challenge_id:attempt.challengeId,language});
    const {data:events}=await db.from("xp_events").select("amount").eq("user_id",userId); const totalXp=(events??[]).reduce((sum:number,e:any)=>sum+e.amount,0);
    await db.from("profiles").update({xp:totalXp,level:levelForXp(totalXp)}).eq("id",userId);
    const level=levelForXp(totalXp); const floor=(level-1)**2*100; return {xpGained:awarded,totalXp,level,streak:0,newBadges:[],nextChallengeId:"",xpBreakdown:[{label:"Challenge",amount:challenge.base_xp},{label:"Hints",amount:awarded-challenge.base_xp}],xpIntoLevel:totalXp-floor,xpForNextLevel:xpForLevel(level)-floor};
  }
}

export const progressService = new ProgressService();


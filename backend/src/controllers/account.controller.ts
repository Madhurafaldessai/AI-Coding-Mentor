import { NextFunction, Response } from "express";
import { z } from "zod";
import { AuthenticatedRequest } from "../middleware/requireAuth";
import { ensureProfile, levelSummary, validLanguage } from "../services/account.service";
import { requireDb } from "../db";

const usernameSchema = z.string().trim().regex(/^[A-Za-z0-9_]{3,16}$/, "Use 3–16 letters, numbers, or underscores.");
const languageSchema = z.object({ language: z.enum(["python", "javascript", "cpp"]) });
const sendValidation = (res: Response, message: string) => res.status(400).json({ error: { code: "VALIDATION_ERROR", message } });

export async function me(req: AuthenticatedRequest, res: Response, next: NextFunction) { try {
 const profile = await ensureProfile(req.user); const db = requireDb();
 const [{ data: languages }, { data: badges }] = await Promise.all([db.from("user_languages").select("*").eq("user_id", req.user.id), db.from("user_badges").select("badge_id, earned_at, badges(id,name,description,icon)").eq("user_id", req.user.id)]);
 res.json({ profile, languages: languages ?? [], badges: badges ?? [], todayStreakStatus: "ready", ...levelSummary(profile.xp ?? 0) });
} catch (e) { next(e); } }
export async function usernameAvailable(req: AuthenticatedRequest, res: Response, next: NextFunction) { try {
 const parsed = usernameSchema.safeParse(req.query.u); if (!parsed.success) { sendValidation(res, "Use 3–16 letters, numbers, or underscores."); return; }
 const { data, error } = await requireDb().from("profiles").select("id").ilike("username", parsed.data).eq("username_chosen", true).neq("id", req.user.id).limit(1); if (error) throw error;
 res.json({ available: !data?.length });
} catch (e) { next(e); } }
export async function updateUsername(req: AuthenticatedRequest, res: Response, next: NextFunction) { try {
 const parsed = usernameSchema.safeParse(req.body.username); if (!parsed.success) { sendValidation(res, "Use 3–16 letters, numbers, or underscores."); return; }
 await ensureProfile(req.user); const db = requireDb(); const { data: taken, error: lookup } = await db.from("profiles").select("id").ilike("username", parsed.data).eq("username_chosen", true).neq("id", req.user.id).limit(1); if (lookup) throw lookup;
 if (taken?.length) { res.status(409).json({ error: { code: "USERNAME_TAKEN", message: "That username is already taken." } }); return; }
 const { data, error } = await db.from("profiles").update({ username: parsed.data, username_chosen: true }).eq("id", req.user.id).select().single(); if (error) throw error; res.json({ profile: data });
} catch(e) { next(e); } }
export async function startLanguage(req: AuthenticatedRequest, res: Response, next: NextFunction) { try {
 const parsed = languageSchema.safeParse(req.body); if (!parsed.success) { sendValidation(res, "Choose Python, JavaScript, or C++."); return; }
 await ensureProfile(req.user); const db = requireDb(); const { error } = await db.from("user_languages").upsert({ user_id: req.user.id, language: parsed.data.language }, { onConflict: "user_id,language", ignoreDuplicates: true }); if (error) throw error;
 await db.from("profiles").update({ selected_language: parsed.data.language, onboarding_completed: true }).eq("id", req.user.id); res.status(201).json({ language: parsed.data.language });
} catch(e) { next(e); } }
export async function dashboard(req: AuthenticatedRequest, res: Response, next: NextFunction) { try {
 const profile = await ensureProfile(req.user); const db = requireDb(); const [{data: languages}, {data: progress}, {data: badges}, {data: activity}] = await Promise.all([
 db.from("user_languages").select("*").eq("user_id",req.user.id).order("last_opened_at",{ascending:false}), db.from("challenge_progress").select("*").eq("user_id",req.user.id), db.from("user_badges").select("earned_at,badges(id,name,description,icon)").eq("user_id",req.user.id), db.from("xp_events").select("amount,reason,challenge_id,language,created_at").eq("user_id",req.user.id).order("created_at",{ascending:false}).limit(8)
 ]);
 const started = languages ?? []; const continueTarget = started[0]?.last_challenge_id ? { id: started[0].last_challenge_id, language: started[0].language } : null;
 res.json({ profile, ...levelSummary(profile.xp ?? 0), streak: profile.streak_days ?? 0, languages: started, progress: progress ?? [], badges: badges ?? [], recentActivity: activity ?? [], continueTarget });
} catch(e) { next(e); } }
export async function track(req: AuthenticatedRequest, res: Response, next: NextFunction) { try {
 const language = req.params.language; if (!validLanguage(language)) { sendValidation(res,"Unknown language."); return; } await ensureProfile(req.user); const db=requireDb();
 const {data:nodes,error}=await db.from("skill_nodes").select("*, skill_node_challenges(challenge_id,position,challenges(id,title,difficulty,base_xp,order_index))").eq("language",language).order("position"); if(error) throw error;
 const {data: progress}=await db.from("challenge_progress").select("*").eq("user_id",req.user.id).eq("language",language); const byId=new Map((progress??[]).map(p=>[p.challenge_id,p])); let priorComplete=true;
 const result=(nodes??[]).map(node=>{const challenges=(node.skill_node_challenges??[]).sort((a:any,b:any)=>a.position-b.position).map((row:any)=>({...row.challenges,status:byId.get(row.challenge_id)?.status??"not_started"})); const complete=challenges.length>0&&challenges.every((c:any)=>c.status==="completed"); const state=complete?"completed":priorComplete?(challenges.some((c:any)=>c.status!=="not_started")?"in_progress":"available"):"locked"; priorComplete=complete; return {...node,challenges,state,percent:challenges.length?Math.round(challenges.filter((c:any)=>c.status==="completed").length/challenges.length*100):0};});
 res.json({language,nodes:result});
} catch(e){next(e);} }

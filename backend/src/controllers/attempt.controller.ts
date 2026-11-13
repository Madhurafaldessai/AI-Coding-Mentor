import { NextFunction, Response } from "express";
import { z } from "zod";
import { AuthenticatedRequest } from "../middleware/requireAuth";
import { ensureProfile } from "../services/account.service";
import { requireDb } from "../db";
const schema=z.object({challengeId:z.string().min(1),language:z.enum(["python","javascript","cpp"]),passed:z.number().int().min(0),total:z.number().int().positive(),errorType:z.string().optional(),runtimeMs:z.number().nonnegative().optional(),hintLevelUsed:z.number().int().min(0).max(4).default(0)});
export async function recordAttempt(req:AuthenticatedRequest,res:Response,next:NextFunction){try{const p=schema.safeParse(req.body);if(!p.success||p.data.passed>p.data.total){res.status(400).json({error:{code:"VALIDATION_ERROR",message:"Invalid attempt results."}});return;}await ensureProfile(req.user);const db=requireDb();
// Browser-run Python/JS results are client-reported; completion validates counts before awards.
const {error}=await db.from("attempts").insert({user_id:req.user.id,challenge_id:p.data.challengeId,language:p.data.language,passed_count:p.data.passed,total_count:p.data.total,error_type:p.data.errorType??null,execution_time_ms:p.data.runtimeMs??null,hints_used_max_level:p.data.hintLevelUsed,xp_awarded:0});if(error)throw error;
await db.from("challenge_progress").upsert({user_id:req.user.id,challenge_id:p.data.challengeId,language:p.data.language,status:"in_progress",attempts:1,best_passed:p.data.passed,total_tests:p.data.total,last_attempt_at:new Date().toISOString()},{onConflict:"user_id,challenge_id,language"});
await db.from("user_languages").update({last_challenge_id:p.data.challengeId,last_opened_at:new Date().toISOString()}).eq("user_id",req.user.id).eq("language",p.data.language);res.status(201).json({ok:true});}catch(e){next(e)}}

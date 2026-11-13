import { Router } from "express";
import { dashboard, me, startLanguage, track, updateUsername, usernameAvailable } from "../controllers/account.controller";
const router=Router();
router.get("/me",me as any); router.get("/username-available",usernameAvailable as any); router.put("/me/username",updateUsername as any); router.post("/me/languages",startLanguage as any); router.get("/tracks/:language",track as any); router.get("/dashboard",dashboard as any);
export default router;

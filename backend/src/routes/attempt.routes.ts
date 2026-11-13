import { Router } from "express"; import { recordAttempt } from "../controllers/attempt.controller"; const router=Router(); router.post("/attempts",recordAttempt as any); export default router;

import { Router } from "express";
import { handleProgressRecord } from "../controllers/progress.controller";

const router = Router();

// POST /api/progress
router.post("/progress", handleProgressRecord);

export default router;


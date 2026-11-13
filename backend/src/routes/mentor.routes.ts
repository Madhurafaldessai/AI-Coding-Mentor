import { Router } from "express";
import { handleMentorRequest } from "../controllers/mentor.controller";

const router = Router();

// POST /api/mentor
router.post("/mentor", handleMentorRequest as any);

export default router;


import { Router } from "express";
import { handleHealthCheck } from "../controllers/health.controller";

const router = Router();

// GET /api/health
router.get("/health", handleHealthCheck);

export default router;

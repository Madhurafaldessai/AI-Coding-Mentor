import { Router } from "express";
import { handleRunCpp } from "../controllers/run.controller";

const router = Router();

// POST /api/run-cpp
router.post("/run-cpp", handleRunCpp);

export default router;

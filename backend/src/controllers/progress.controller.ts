import { Request, Response, NextFunction } from "express";
import { progressService } from "../services/progress.service";
import { AttemptPayload } from "@mentor/shared";

export async function handleProgressRecord(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { challengeId, code, passed, total, errorType, hintLevelUsed } = req.body as AttemptPayload;

    if (!challengeId || typeof code !== "string" || typeof passed !== "number" || typeof total !== "number") {
      res.status(400).json({
        error: "Invalid progress payload: challengeId, code, passed, and total are required.",
      });
      return;
    }

    const result = await progressService.recordAttempt({
      challengeId,
      code,
      passed,
      total,
      errorType,
      hintLevelUsed: hintLevelUsed || 0,
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
}

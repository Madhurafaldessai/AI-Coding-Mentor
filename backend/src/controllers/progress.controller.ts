import { Response, NextFunction } from "express";
import { progressService } from "../services/progress.service";
import { AttemptPayload } from "@mentor/shared";
import { AuthenticatedRequest } from "../middleware/requireAuth";

export async function handleProgressRecord(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { challengeId, code, passed, total, errorType, hintLevelUsed, language } = req.body as AttemptPayload;

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
      hintLevelUsed: hintLevelUsed || 0, language,
    }, req.user.id);

    res.json(result);
  } catch (error) {
    next(error);
  }
}


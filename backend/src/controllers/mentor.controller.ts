import { Response, NextFunction } from "express";
import { mentorService } from "../services/mentor.service";
import { MentorRequest } from "@mentor/shared";
import { AuthenticatedRequest } from "../middleware/requireAuth";
import { requireDb } from "../db";
import { hintCosts } from "../config/progression";

export async function handleMentorRequest(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { challengeId, code, errorText, requestedLevel } = req.body as MentorRequest;

    if (!challengeId || typeof code !== "string" || !requestedLevel) {
      res.status(400).json({
        error: "Missing required fields: challengeId, code, and requestedLevel are required.",
      });
      return;
    }

    if (![1, 2, 3, 4].includes(requestedLevel)) {
      res.status(400).json({
        error: "requestedLevel must be 1, 2, 3, or 4.",
      });
      return;
    }

    const response = await mentorService.getGuidance({
      challengeId,
      code,
      errorText: errorText || "",
      requestedLevel,
    });

    // AI-INTEGRATION: learner context will be assembled here without changing provider prompts.
    await requireDb().from("mentor_events").insert({ user_id: req.user.id, challenge_id: challengeId, language: req.body.language || "python", hint_level: requestedLevel });
    res.json({ ...response, costXp: hintCosts[requestedLevel] ?? 0 });
  } catch (error) {
    next(error);
  }
}


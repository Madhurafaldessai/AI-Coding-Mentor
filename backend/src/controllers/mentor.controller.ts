import { Request, Response, NextFunction } from "express";
import { mentorService } from "../services/mentor.service";
import { MentorRequest } from "@mentor/shared";

export async function handleMentorRequest(
  req: Request,
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

    res.json(response);
  } catch (error) {
    next(error);
  }
}

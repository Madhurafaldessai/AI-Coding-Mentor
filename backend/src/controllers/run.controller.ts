import { Request, Response, NextFunction } from "express";
import { runnerService } from "../services/runner.service";

export async function handleRunCpp(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { code, stdin } = req.body;
    await runnerService.runCpp(code || "", stdin || "");
  } catch (error) {
    next(error);
  }
}

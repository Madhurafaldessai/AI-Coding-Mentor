import { Request, Response } from "express";

export function handleHealthCheck(req: Request, res: Response): void {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "ai-coding-mentor-backend",
  });
}


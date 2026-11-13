import { NextFunction, Request, Response } from "express";
import { requireDb } from "../db";

export type AuthenticatedRequest = Request & { user: { id: string; email?: string } };

export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const token = req.header("authorization")?.replace(/^Bearer\s+/i, "");
    if (!token) { res.status(401).json({ error: { code: "AUTH_REQUIRED", message: "Sign in to continue." } }); return; }
    const { data, error } = await requireDb().auth.getUser(token);
    if (error || !data.user) { res.status(401).json({ error: { code: "INVALID_SESSION", message: "Your session is invalid or has expired." } }); return; }
    (req as AuthenticatedRequest).user = { id: data.user.id, email: data.user.email };
    next();
  } catch (error) { next(error); }
}

import express from "express";
import cors from "cors";
import { env } from "./config/env";
import mentorRoutes from "./routes/mentor.routes";
import progressRoutes from "./routes/progress.routes";
import runRoutes from "./routes/run.routes";
import healthRoutes from "./routes/health.routes";
import { errorHandler } from "./middleware/errorHandler";
import { requireAuth } from "./middleware/requireAuth";
import accountRoutes from "./routes/account.routes";
import attemptRoutes from "./routes/attempt.routes";

export const app = express();

// Security & Parsing Middleware
app.use(
  cors({
    origin: env.frontendOrigin,
    credentials: true,
  })
);
app.use(express.json());

// API Routes
app.use("/api", healthRoutes);
app.use("/api", requireAuth);
app.use("/api", accountRoutes);
app.use("/api", attemptRoutes);
app.use("/api", mentorRoutes);
app.use("/api", progressRoutes);
app.use("/api", runRoutes);

// Error Handling Middleware
app.use(errorHandler);


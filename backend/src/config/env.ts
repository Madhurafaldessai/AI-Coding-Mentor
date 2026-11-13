import dotenv from "dotenv";
import path from "path";

// Work from source, compiled output, or a workspace script without exposing values.
dotenv.config({ path: path.resolve(process.cwd(), "backend/.env") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

export const env = {
  port: parseInt(process.env.PORT || "4000", 10),
  frontendOrigin: process.env.FRONTEND_ORIGIN || "http://localhost:3000",
  useMockAi: process.env.USE_MOCK_AI !== "false",
  groqApiKey: process.env.GROQ_API_KEY || "",
  mentorModel: process.env.MENTOR_MODEL || "llama-3.3-70b-versatile",
  supabaseUrl: process.env.SUPABASE_URL || "",
  // Supabase renamed service-role keys to secret keys; both remain backend-only.
  supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SECRET_KEY || "",
};


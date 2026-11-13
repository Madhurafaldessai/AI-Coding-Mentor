import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export const env = {
  port: parseInt(process.env.PORT || "4000", 10),
  frontendOrigin: process.env.FRONTEND_ORIGIN || "http://localhost:3000",
  useMockAi: process.env.USE_MOCK_AI !== "false",
  groqApiKey: process.env.GROQ_API_KEY || "",
  mentorModel: process.env.MENTOR_MODEL || "llama-3.3-70b-versatile",
  supabaseUrl: process.env.SUPABASE_URL || "",
  supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY || "",
};

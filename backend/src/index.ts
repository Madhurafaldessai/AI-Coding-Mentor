import { app } from "./app";
import { env } from "./config/env";

app.listen(env.port, () => {
  console.log(`⚡ [Backend] AI Coding Mentor Server running on port ${env.port}`);
  console.log(`⚡ [Backend] Frontend Origin: ${env.frontendOrigin}`);
  console.log(`⚡ [Backend] Mock AI Mode: ${env.useMockAi ? "ENABLED" : "DISABLED"}`);
});

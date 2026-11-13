// TEAMMATE: replace this mock, keep the response shape
// This service will initialize the Groq SDK and handle prompt execution when USE_MOCK_AI=false.

import { env } from "../config/env";

export class LlmService {
  private apiKey: string;
  private model: string;

  constructor() {
    this.apiKey = env.groqApiKey;
    this.model = env.mentorModel;
  }

  async generateChatCompletion(systemPrompt: string, userPrompt: string): Promise<string> {
    if (env.useMockAi || !this.apiKey) {
      return "Mock LLM output: Groq API key not configured or USE_MOCK_AI is active.";
    }

    // Teammate will connect Groq SDK here:
    // const groq = new Groq({ apiKey: this.apiKey });
    // const response = await groq.chat.completions.create({...});
    throw new Error("Real Groq LLM service not configured yet by teammate.");
  }
}

export const llmService = new LlmService();


// TEAMMATE: replace this mock, keep the response shape
import { MentorRequest, MentorResponse } from "@mentor/shared";
import { getMockMentorResponse } from "../mocks/mentor.mock";
import { env } from "../config/env";

export class MentorService {
  async getGuidance(req: MentorRequest): Promise<MentorResponse> {
    // Artificial 600ms delay to make loading and typing states testable on frontend
    await new Promise((resolve) => setTimeout(resolve, 600));

    if (env.useMockAi) {
      return getMockMentorResponse(req.requestedLevel);
    }

    // Teammate will implement real Groq prompt generation here when ready
    return getMockMentorResponse(req.requestedLevel);
  }
}

export const mentorService = new MentorService();


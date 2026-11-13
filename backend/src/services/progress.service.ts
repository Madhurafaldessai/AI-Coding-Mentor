// TEAMMATE: replace this mock, keep the response shape
import { AttemptPayload, ProgressResponse } from "@mentor/shared";
import { getMockProgressResponse } from "../mocks/progress.mock";

export class ProgressService {
  async recordAttempt(attempt: AttemptPayload): Promise<ProgressResponse> {
    // Artificial 600ms delay to make progress loading states testable on frontend
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Teammate will connect Supabase queries to save attempt and calculate persistent XP
    return getMockProgressResponse(attempt);
  }
}

export const progressService = new ProgressService();

import { ProgressResponse, AttemptPayload } from "@mentor/shared";

// TEAMMATE: replace this mock, keep the response shape
export function getMockProgressResponse(attempt: AttemptPayload): ProgressResponse {
  const isPerfect = attempt.passed === attempt.total && attempt.total > 0;
  const basePoints = isPerfect ? 50 : Math.round((attempt.passed / Math.max(attempt.total, 1)) * 30);
  
  // Deduct small amount if high hint level was used
  const hintPenalty = Math.max(0, (attempt.hintLevelUsed - 1) * 5);
  const earnedXp = Math.max(10, basePoints - hintPenalty);

  const mockNewBadges: string[] = [];
  if (isPerfect) {
    mockNewBadges.push("First Green Test Suite!");
  }

  return {
    xpGained: earnedXp,
    totalXp: 350 + earnedXp,
    level: Math.floor((350 + earnedXp) / 100) + 1,
    streak: 3,
    newBadges: mockNewBadges,
    nextChallengeId: attempt.challengeId === "reverse-string" ? "find-max" : "two-sum",
  };
}


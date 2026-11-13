export type Lang = "python" | "javascript" | "cpp";

export type TestCase = {
  input: string;
  expected: string;
};

export type RunResult = {
  passed: number;
  total: number;
  stdout: string;
  stderr: string;
  errorType?: "syntax" | "runtime" | "wrong_answer" | "timeout" | "compile";
  runtimeMs: number;
};

export type MentorRequest = {
  challengeId: string;
  code: string;
  errorText: string;
  requestedLevel: 1 | 2 | 3 | 4;
};

export type MentorResponse = {
  message: string;
  level: 1 | 2 | 3 | 4;
  concept: string;
  confidence_signal: "stuck" | "close" | "confused_basics";
};

export type AttemptPayload = {
  challengeId: string;
  code: string;
  passed: number;
  total: number;
  errorType?: string;
  hintLevelUsed: number;
};

export type ProgressResponse = {
  xpGained: number;
  totalXp: number;
  level: number;
  streak: number;
  newBadges: string[];
  nextChallengeId: string;
};

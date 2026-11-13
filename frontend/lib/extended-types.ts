import {
  Lang,
  TestCase,
  RunResult,
  MentorRequest,
  MentorResponse,
  AttemptPayload,
  ProgressResponse,
} from "@mentor/shared";

// Re-export base contracts from shared
export type {
  Lang,
  TestCase,
  RunResult,
  MentorRequest,
  MentorResponse,
  AttemptPayload,
  ProgressResponse,
};

// Proposed extension for ProgressResponse (Success Modal)
export interface ExtendedProgressResponse extends ProgressResponse {
  xpBreakdown?: { label: string; amount: number }[];
  xpIntoLevel?: number;
  xpForNextLevel?: number;
}

// Proposed extension for MentorResponse (Server-governed hint costs)
export interface ExtendedMentorResponse extends MentorResponse {
  costXp?: number;
}

// Unified multi-language challenge structure
export interface UnifiedChallenge {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  concept: string;
  description: string;
  starterCode: Record<Lang, string>;
  testCases: TestCase[];
}


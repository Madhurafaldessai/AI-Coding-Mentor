import challengesData from "@/data/challenges.json";
import { Lang, TestCase } from "@mentor/shared";

export interface ChallengeExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface Challenge {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  concept: string;
  description: string;
  examples: ChallengeExample[];
  constraints: string[];
  starterCode: Record<Lang, string>;
  testCases: TestCase[];
}

const challenges: Challenge[] = challengesData as Challenge[];

export function getAllChallenges(): Challenge[] {
  return challenges;
}

export function getChallengeById(id: string): Challenge | null {
  return challenges.find((c) => c.id === id) || null;
}


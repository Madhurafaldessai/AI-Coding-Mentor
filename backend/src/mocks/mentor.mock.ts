import { MentorResponse } from "@mentor/shared";

// TEAMMATE: replace this mock, keep the response shape
export function getMockMentorResponse(
  requestedLevel: 1 | 2 | 3 | 4,
  conceptOverride?: string
): MentorResponse {
  const hints: Record<1 | 2 | 3 | 4, string> = {
    1: "Nudge: Check your loop condition and boundary variables. Think about what happens on the very first and last iterations.",
    2: "Specific hint: In zero-indexed languages, the last element is at length - 1. Make sure your bounds check does not step out of range.",
    3: "Step-by-step breakdown:\n1. Initialize your running result or pointer before the loop.\n2. Iterate through each item and evaluate the target condition.\n3. Return or print the result without re-mutating the inputs.",
    4: "Complete guided solution pattern:\nHere is how to structure this logic:\n\n```python\ndef solve(arr, target):\n    seen = {}\n    for i, num in enumerate(arr):\n        diff = target - num\n        if diff in seen:\n            return [seen[diff], i]\n        seen[num] = i\n    return []\n```\nNotice how the hash map allows O(1) lookups instead of nested loops.",
  };

  const signals: Record<1 | 2 | 3 | 4, "stuck" | "close" | "confused_basics"> = {
    1: "close",
    2: "close",
    3: "stuck",
    4: "confused_basics",
  };

  return {
    message: hints[requestedLevel] || hints[1],
    level: requestedLevel,
    concept: conceptOverride || "Array Indexing & Iteration",
    confidence_signal: signals[requestedLevel] || "close",
  };
}


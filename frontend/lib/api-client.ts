import { MentorRequest, MentorResponse, AttemptPayload, ProgressResponse } from "@mentor/shared";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(errorBody.error || `Request failed with status ${response.status}`);
  }

  return response.json();
}

export const apiClient = {
  async getHealth(): Promise<{ status: string; timestamp: string; service: string }> {
    return request("/api/health");
  },

  async getMentorGuidance(data: MentorRequest): Promise<MentorResponse> {
    return request<MentorResponse>("/api/mentor", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async recordProgress(data: AttemptPayload): Promise<ProgressResponse> {
    return request<ProgressResponse>("/api/progress", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async runCpp(code: string, stdin: string): Promise<never> {
    return request<never>("/api/run-cpp", {
      method: "POST",
      body: JSON.stringify({ code, stdin }),
    });
  },
};

// TEAMMATE: replace this mock, keep the response shape
// C++ runner proxy to Judge0 or remote container execution

export class RunnerService {
  async runCpp(code: string, stdin: string): Promise<never> {
    // Teammate will connect remote C++ runner (Judge0 / isolated docker runner)
    const error = new Error("C++ runner proxy is not implemented yet. Remote execution engine integration in progress.");
    (error as unknown as { statusCode: number }).statusCode = 501;
    throw error;
  }
}

export const runnerService = new RunnerService();


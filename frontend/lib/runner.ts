import { Lang, RunResult, TestCase } from "@mentor/shared";
import { apiClient } from "@/lib/api-client";

const TIMEOUT_MS = 5000;

class CodeRunnerService {
  private pyodideWorker: Worker | null = null;
  private jsWorker: Worker | null = null;
  private isPyReady: boolean = false;
  private pyReadyListeners: Set<() => void> = new Set();

  constructor() {
    if (typeof window !== "undefined") {
      this.initWorkers();
    }
  }

  private initWorkers() {
    this.initPyodideWorker();
    this.initJsWorker();
  }

  private initPyodideWorker() {
    if (typeof window === "undefined") return;
    try {
      if (this.pyodideWorker) {
        this.pyodideWorker.terminate();
      }
      this.isPyReady = false;
      this.pyodideWorker = new Worker("/workers/pyodide.worker.js");
      this.pyodideWorker.onmessage = (e) => {
        if (e.data.type === "READY") {
          this.isPyReady = true;
          this.pyReadyListeners.forEach((fn) => fn());
        }
      };
    } catch (err) {
      console.warn("Failed to spawn Pyodide Web Worker", err);
    }
  }

  private initJsWorker() {
    if (typeof window === "undefined") return;
    try {
      if (this.jsWorker) {
        this.jsWorker.terminate();
      }
      this.jsWorker = new Worker("/workers/js.worker.js");
    } catch (err) {
      console.warn("Failed to spawn JavaScript Web Worker", err);
    }
  }

  public isPythonReady(): boolean {
    return this.isPyReady;
  }

  public onPythonReady(callback: () => void): () => void {
    if (this.isPyReady) {
      callback();
    }
    this.pyReadyListeners.add(callback);
    return () => {
      this.pyReadyListeners.delete(callback);
    };
  }

  public async runCode(
    lang: Lang,
    code: string,
    tests: TestCase[]
  ): Promise<RunResult> {
    if (lang === "cpp") {
      return this.runCppProxy(code, tests);
    }

    if (lang === "python") {
      return this.runWithWorker(
        () => {
          if (!this.pyodideWorker) this.initPyodideWorker();
          return this.pyodideWorker!;
        },
        () => this.initPyodideWorker(),
        code,
        tests
      );
    }

    // JavaScript
    return this.runWithWorker(
      () => {
        if (!this.jsWorker) this.initJsWorker();
        return this.jsWorker!;
      },
      () => this.initJsWorker(),
      code,
      tests
    );
  }

  private async runCppProxy(code: string, tests: TestCase[]): Promise<RunResult> {
    const startTime = performance.now();
    try {
      await apiClient.runCpp(code, tests[0]?.input || "");
      return {
        passed: 0,
        total: tests.length,
        stdout: "",
        stderr: "C++ runner executed.",
        runtimeMs: Math.round(performance.now() - startTime),
      };
    } catch (err) {
      return {
        passed: 0,
        total: tests.length,
        stdout: "",
        stderr:
          "C++ runner is coming soon. The backend remote execution engine is currently being integrated by your teammate.",
        errorType: "compile",
        runtimeMs: Math.round(performance.now() - startTime),
      };
    }
  }

  private runWithWorker(
    getWorker: () => Worker,
    reinitWorker: () => void,
    code: string,
    tests: TestCase[]
  ): Promise<RunResult> {
    return new Promise<RunResult>((resolve) => {
      const worker = getWorker();
      let isSettled = false;

      // 5-second timeout guard
      const timer = setTimeout(() => {
        if (isSettled) return;
        isSettled = true;

        // Force terminate frozen worker (infinite loop)
        worker.terminate();
        reinitWorker();

        resolve({
          passed: 0,
          total: tests.length,
          stdout: "",
          stderr:
            "Execution timed out (> 5.0s).\nYour code took too long. Check for an infinite loop or heavy operations.",
          errorType: "timeout",
          runtimeMs: TIMEOUT_MS,
        });
      }, TIMEOUT_MS);

      worker.onmessage = (e) => {
        if (isSettled) return;
        if (e.data.type === "RESULT") {
          clearTimeout(timer);
          isSettled = true;
          resolve(e.data.result);
        } else if (e.data.type === "READY") {
          this.isPyReady = true;
          this.pyReadyListeners.forEach((fn) => fn());
        }
      };

      worker.onerror = (errEvent) => {
        if (isSettled) return;
        clearTimeout(timer);
        isSettled = true;
        resolve({
          passed: 0,
          total: tests.length,
          stdout: "",
          stderr: `Worker runtime error: ${errEvent.message || "Unknown worker error"}`,
          errorType: "runtime",
          runtimeMs: 0,
        });
      };

      worker.postMessage({
        type: "RUN",
        code,
        tests,
      });
    });
  }
}

export const runnerService = new CodeRunnerService();

export async function runCode(
  lang: Lang,
  code: string,
  tests: TestCase[]
): Promise<RunResult> {
  return runnerService.runCode(lang, code, tests);
}

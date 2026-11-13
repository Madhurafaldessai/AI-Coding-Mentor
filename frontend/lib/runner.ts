// Core runner interface: Executes Python/JS in Web Workers, proxies C++ to backend
import { Lang, RunResult, TestCase } from "@mentor/shared";

export async function runCode(
  lang: Lang,
  code: string,
  tests: TestCase[]
): Promise<RunResult> {
  // Stub for Step 6: Pyodide for Python, Web Worker for JS, apiClient.runCpp for C++
  return {
    passed: 0,
    total: tests.length,
    stdout: "",
    stderr: "",
    runtimeMs: 0,
  };
}

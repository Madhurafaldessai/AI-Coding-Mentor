// Pyodide Python Runner Web Worker
let pyodide = null;
let isInitializing = false;

async function initPyodide() {
  if (pyodide) return pyodide;
  if (isInitializing) return;
  isInitializing = true;
  try {
    importScripts("https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js");
    pyodide = await loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/",
    });
    await pyodide.runPythonAsync("import sys, io");
    self.postMessage({ type: "READY" });
  } catch (err) {
    self.postMessage({ type: "INIT_ERROR", error: String(err) });
  } finally {
    isInitializing = false;
  }
}

// Start downloading/initializing immediately
initPyodide();

self.onmessage = async (e) => {
  const { type, code, tests } = e.data;

  if (type === "CHECK_READY") {
    if (pyodide) {
      self.postMessage({ type: "READY" });
    }
    return;
  }

  if (type === "RUN") {
    if (!pyodide) {
      await initPyodide();
    }

    const startTime = performance.now();
    let passed = 0;
    let accumulatedStdout = "";
    let accumulatedStderr = "";
    let errorType = undefined;

    for (let i = 0; i < tests.length; i++) {
      const test = tests[i];
      try {
        pyodide.globals.set("test_input", test.input);
        pyodide.globals.set("student_code", code);

        const pyRunner = `
import sys, io, traceback

sys.stdin = io.StringIO(test_input)
_stdout = io.StringIO()
_stderr = io.StringIO()
sys.stdout = _stdout
sys.stderr = _stderr

try:
    _user_globals = {'__name__': '__main__'}
    exec(compile(student_code, '<student_code>', 'exec'), _user_globals)
except Exception as _e:
    sys.stderr.write(traceback.format_exc())
    raise _e
finally:
    _actual_stdout = _stdout.getvalue()
    _actual_stderr = _stderr.getvalue()
    sys.stdout = sys.__stdout__
    sys.stderr = sys.__stderr__
`;
        await pyodide.runPythonAsync(pyRunner);
        const actualStdout = String(pyodide.globals.get("_actual_stdout") || "");
        const actualStderr = String(pyodide.globals.get("_actual_stderr") || "");

        if (actualStderr) {
          accumulatedStderr += (accumulatedStderr ? "\n" : "") + actualStderr;
        }

        const trimmedActual = actualStdout.trim();
        const trimmedExpected = test.expected.trim();

        if (trimmedActual === trimmedExpected) {
          passed++;
          accumulatedStdout += `Test ${i + 1} Passed\n`;
        } else {
          errorType = "wrong_answer";
          accumulatedStdout += `Test ${i + 1} Failed:\nExpected: "${trimmedExpected}"\nActual:   "${trimmedActual}"\n`;
          break;
        }
      } catch (err) {
        const errStr = String(err);
        const isSyntax = errStr.includes("SyntaxError") || errStr.includes("IndentationError");
        errorType = isSyntax ? "syntax" : "runtime";

        const pyStderr = String(pyodide.globals.get("_actual_stderr") || "");
        accumulatedStderr = pyStderr || errStr;
        break;
      }
    }

    const runtimeMs = Math.round(performance.now() - startTime);

    self.postMessage({
      type: "RESULT",
      result: {
        passed,
        total: tests.length,
        stdout: accumulatedStdout.trim(),
        stderr: accumulatedStderr.trim(),
        errorType,
        runtimeMs,
      },
    });
  }
};


// Sandboxed JavaScript Execution Worker

self.onmessage = (e) => {
  const { type, code, tests } = e.data;

  if (type === "RUN") {
    const startTime = performance.now();
    let passed = 0;
    let accumulatedStdout = "";
    let accumulatedStderr = "";
    let errorType = undefined;

    // Check syntax error first
    try {
      new Function(code);
    } catch (syntaxErr) {
      self.postMessage({
        type: "RESULT",
        result: {
          passed: 0,
          total: tests.length,
          stdout: "",
          stderr: String(syntaxErr.stack || syntaxErr),
          errorType: "syntax",
          runtimeMs: 1,
        },
      });
      return;
    }

    for (let i = 0; i < tests.length; i++) {
      const test = tests[i];
      let testStdout = "";
      let testStderr = "";

      // Setup readline provider for test input
      const lines = test.input.split(/\r?\n/);
      let linePointer = 0;
      const readline = () => {
        if (linePointer < lines.length) {
          return lines[linePointer++];
        }
        return "";
      };

      // Custom console proxy
      const customConsole = {
        log: (...args) => {
          testStdout += args.map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a))).join(" ") + "\n";
        },
        info: (...args) => {
          testStdout += args.map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a))).join(" ") + "\n";
        },
        warn: (...args) => {
          testStderr += args.map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a))).join(" ") + "\n";
        },
        error: (...args) => {
          testStderr += args.map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a))).join(" ") + "\n";
        },
      };

      try {
        // Execute student code with scoped readline and console
        const runnerFn = new Function("readline", "console", code);
        runnerFn(readline, customConsole);

        if (testStderr) {
          accumulatedStderr += (accumulatedStderr ? "\n" : "") + testStderr;
        }

        const trimmedActual = testStdout.trim();
        const trimmedExpected = test.expected.trim();

        if (trimmedActual === trimmedExpected) {
          passed++;
          accumulatedStdout += `Test ${i + 1} Passed\n`;
        } else {
          errorType = "wrong_answer";
          accumulatedStdout += `Test ${i + 1} Failed:\nExpected: "${trimmedExpected}"\nActual:   "${trimmedActual}"\n`;
          break;
        }
      } catch (runtimeErr) {
        errorType = "runtime";
        accumulatedStderr += (accumulatedStderr ? "\n" : "") + String(runtimeErr.stack || runtimeErr);
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


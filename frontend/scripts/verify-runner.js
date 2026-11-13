// Node.js script connecting to Chrome via CDP to run and verify browser tests
const { spawn } = require("child_process");

async function run() {
  const port = 9222;
  const userDataDir = "/tmp/chrome-cdp-profile-" + Date.now();
  
  console.log("Launching headless Chrome on port " + port + "...");
  const chrome = spawn("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", [
    "--headless=new",
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    "--no-first-run",
    "--disable-gpu",
    "about:blank"
  ]);

  // Wait 2 seconds for Chrome to be ready
  await new Promise(r => setTimeout(r, 2000));

  try {
    // Fetch target tabs
    const versionRes = await fetch(`http://127.0.0.1:${port}/json/version`);
    const versionData = await versionRes.json();
    console.log("Connected to browser:", versionData.Browser);

    const newTabRes = await fetch(`http://127.0.0.1:${port}/json/new?http://localhost:3000/test-runner.html`, { method: "PUT" });
    const tabData = await newTabRes.json();
    const wsUrl = tabData.webSocketDebuggerUrl;
    console.log("Test page opened, connecting to CDP WebSocket:", wsUrl);

    const ws = new WebSocket(wsUrl);

    await new Promise((resolve, reject) => {
      ws.onopen = resolve;
      ws.onerror = reject;
    });

    let id = 1;
    function sendCommand(method, params = {}) {
      return new Promise((resolve) => {
        const cmdId = id++;
        const handler = (event) => {
          const msg = JSON.parse(event.data);
          if (msg.id === cmdId) {
            ws.removeEventListener("message", handler);
            resolve(msg.result);
          }
        };
        ws.addEventListener("message", handler);
        ws.send(JSON.stringify({ id: cmdId, method, params }));
      });
    }

    // Enable console
    await sendCommand("Runtime.enable");

    console.log("Waiting for test suite completion (timeout tests take ~10-15s)...");

    let isDone = false;
    let attempts = 0;
    while (!isDone && attempts < 40) {
      await new Promise(r => setTimeout(r, 1000));
      attempts++;
      const evalRes = await sendCommand("Runtime.evaluate", {
        expression: "window.__ALL_TESTS_DONE__ === true"
      });
      if (evalRes?.result?.value === true) {
        isDone = true;
      }
    }

    if (!isDone) {
      console.error("Timed out waiting for test suite to finish!");
    } else {
      console.log("Test suite finished in ~" + attempts + "s!");
    }

    // Read results
    const resultsRes = await sendCommand("Runtime.evaluate", {
      expression: "JSON.stringify({ status: document.getElementById('status').textContent, log: document.getElementById('log').textContent, results: window.__TEST_RESULTS__ })",
      returnByValue: true
    });

    const parsed = JSON.parse(resultsRes.result.value);
    console.log("\n==================== TEST LOG ====================");
    console.log(parsed.log);
    console.log("==================================================");
    console.log("\nFINAL STATUS: " + parsed.status);
    console.log("RESULTS JSON:\n" + JSON.stringify(parsed.results, null, 2));

    // Capture screenshot of test runner
    const screenshotRes = await sendCommand("Page.captureScreenshot", { format: "png" });
    if (screenshotRes?.data) {
      const fs = require("fs");
      const buffer = Buffer.from(screenshotRes.data, "base64");
      const outPath = "/Users/madhura/.gemini/antigravity/brain/482ea37e-a014-42f3-9ecc-77301bd4cdd3/runner-verification-report.png";
      fs.writeFileSync(outPath, buffer);
      console.log("Screenshot saved to:", outPath);
    }

    ws.close();
  } catch (err) {
    console.error("Verification execution error:", err);
  } finally {
    chrome.kill("SIGKILL");
  }
}

run();


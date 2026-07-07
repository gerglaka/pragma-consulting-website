// Verification helper (CLAUDE.md checklist): for every page × locale × viewport,
// assert no horizontal overflow and no browser console errors/warnings.
// Usage: node scripts/check-pages.mjs [baseUrl]
import puppeteer from "puppeteer-core";

const BASE = process.argv[2] ?? "http://localhost:3199";
const CHROME =
  process.env.CHROME_PATH ?? "/usr/bin/chromium-browser";

const PATHS = [
  "/hu", "/hu/szolgaltatasok", "/hu/referenciak", "/hu/rolunk", "/hu/kapcsolat",
  "/sk", "/sk/sluzby", "/sk/referencie", "/sk/o-nas", "/sk/kontakt",
  "/en", "/en/services", "/en/references", "/en/about", "/en/contact",
];
const VIEWPORTS = [
  { width: 375, height: 800 },
  { width: 768, height: 900 },
  { width: 1440, height: 900 },
];

// Snap-packaged Chromium forks via a wrapper, so puppeteer.launch() never sees
// the DevTools endpoint. Start Chromium ourselves and connect over CDP instead.
// Profile must live in a snap-accessible dir (no /tmp, no hidden $HOME dirs).
import { spawn } from "node:child_process";

const profileDir = `${process.env.HOME}/snap/chromium/common/pragma-pptr-profile`;
const DEBUG_PORT = 9222;

const chrome = spawn(
  CHROME,
  [
    "--headless",
    "--no-sandbox",
    "--disable-gpu",
    "--disable-dev-shm-usage",
    `--remote-debugging-port=${DEBUG_PORT}`,
    `--user-data-dir=${profileDir}`,
    "about:blank",
  ],
  { stdio: "ignore", detached: false },
);

async function connectWithRetry() {
  for (let i = 0; i < 30; i++) {
    try {
      return await puppeteer.connect({
        browserURL: `http://127.0.0.1:${DEBUG_PORT}`,
      });
    } catch {
      await new Promise((r) => setTimeout(r, 500));
    }
  }
  throw new Error("Could not connect to Chromium DevTools endpoint");
}

const browser = await connectWithRetry();
process.on("exit", () => chrome.kill());

let failures = 0;
const page = await browser.newPage();
const consoleIssues = [];
page.on("console", (msg) => {
  if (msg.type() === "error" || msg.type() === "warning") {
    consoleIssues.push(`${msg.type()}: ${msg.text()}`);
  }
});
page.on("pageerror", (err) => consoleIssues.push(`pageerror: ${err.message}`));

for (const path of PATHS) {
  for (const vp of VIEWPORTS) {
    consoleIssues.length = 0;
    await page.setViewport(vp);
    const res = await page.goto(`${BASE}${path}`, { waitUntil: "networkidle0" });
    const status = res?.status() === 304 ? 200 : res?.status();
    const { scrollWidth, innerWidth, offenders } = await page.evaluate(() => {
      const offenders = [];
      const docWidth = document.documentElement.clientWidth;
      for (const el of document.querySelectorAll("body *")) {
        // Skip intentionally offscreen/decorative elements (honeypot, hero blob)
        if (el.closest('[aria-hidden="true"]')) continue;
        const r = el.getBoundingClientRect();
        if (r.right > docWidth + 1 || r.left < -1) {
          offenders.push(
            `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 60)} right=${Math.round(r.right)}`,
          );
          if (offenders.length >= 3) break;
        }
      }
      return {
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
        offenders,
      };
    });
    const overflow = scrollWidth > vp.width;
    const bad = status !== 200 || overflow || consoleIssues.length > 0;
    if (bad) failures++;
    console.log(
      `${bad ? "FAIL" : "ok  "} ${path} @${vp.width}px status=${status} scrollWidth=${scrollWidth}${
        overflow ? ` OVERFLOW (viewport ${innerWidth})` : ""
      }${consoleIssues.length ? ` console: ${consoleIssues.join(" | ").slice(0, 200)}` : ""}${
        offenders.length ? ` offenders: ${offenders.join("; ")}` : ""
      }`,
    );
  }
}

await browser.close();
console.log(failures === 0 ? "\nALL CHECKS PASSED" : `\n${failures} CHECK(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);

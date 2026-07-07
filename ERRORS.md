# ERRORS.md — Pragma website

Log of approaches that took more than 2 attempts: what failed, what worked.

## 2026-07-07 — shadcn init CLI flags

- **Failed:** `npx shadcn@latest init -y -b neutral` — in the current shadcn CLI, `-b` means component base (`radix`/`base`), not base color. Then plain `init -y -b radix` stalled on an interactive preset prompt.
- **Worked:** `npx shadcn@latest init -y -d` (defaults: next template + base-nova preset). Brand colors are applied afterwards by overwriting the CSS variables in `globals.css` anyway.
- Also: a combined `shadcn add button input textarea select label sheet` call only installed `button`; re-running `add` with the remaining components worked.

## 2026-07-07 — puppeteer + snap Chromium (verification script)

- **Failed (1):** `puppeteer.launch({ executablePath: "/usr/bin/chromium-browser" })` → TimeoutError waiting for the WS endpoint in stdout. Snap confinement blocks the default `/tmp` profile dir.
- **Failed (2):** same with `--user-data-dir` under `~/.cache` — snap also blocks hidden `$HOME` dirs.
- **Root cause:** the snap `chromium-browser` binary is a wrapper that forks; the real process's stdout (with the DevTools endpoint) never reaches puppeteer.
- **Worked:** spawn Chromium manually with `--headless --remote-debugging-port=9222 --user-data-dir=$HOME/snap/chromium/common/<profile>` and `puppeteer.connect({ browserURL: "http://127.0.0.1:9222" })` with retry. See `scripts/check-pages.mjs`.

## 2026-07-07 — HU header overflow at 768px

- **Failed:** desktop nav + CTA visible from `md:` (768px) — fine in EN, but Hungarian nav labels plus "Kérjen ajánlatot" made the header 799px wide at a 768px viewport (31px horizontal overflow on every HU page).
- **Worked:** moved desktop nav and header CTA to `lg:` (1024px); the sheet-based mobile menu now covers <1024px. Exactly the "HU strings are 20–30% longer" trap CLAUDE.md warns about — always test breakpoints with HU copy, not EN.
- Also fixed checker false-positives: 304 (cache) responses counted as failures; the honeypot's intentional `-9999px` offset and the decorative hero blob were flagged as overflow offenders (now skipped via `[aria-hidden="true"]`).

## 2026-07-07 — Lighthouse performance below 90 (multi-step)

- **Failed (1):** homepage Perf 83, LCP 4.6s. Cause: the hero was wrapped in the Motion-based `Reveal`, whose SSR output keeps content at `opacity: 0` until hydration — on throttled mobile the LCP text stayed invisible for ~4.5s.
- **Failed (2):** switching the hero to a CSS keyframe animation starting at `opacity: 0` moved LCP to… the tiny header logo. Chromium never emits LCP candidates for elements painted at opacity 0, so all animated hero content was excluded from LCP entirely. Fix: entrance animation starts at `opacity: 0.4` (content readable from first paint, still LCP-eligible).
- **Failed (3):** scores oscillated 87–92; Lantern (simulated throttling) pins the LCP paint to webfont arrival even with `font-display: swap` (it maps the locally-observed webfont paint through the throttled dependency graph). `display: "optional"` changed nothing; `weight:` arrays on variable Google fonts don't shrink the payload (next/font always ships the variable file).
- **Worked:** `preload: false` on Inter (body) so Space Grotesk (the LCP heading font) wins the early-bandwidth race, + CSS-only above-the-fold entrances. Result: hu 91 / sk 91 / en 96, stable across repeat runs.
- Lesson: never wrap above-the-fold/LCP content in JS scroll-reveal components; check *which element* Lighthouse picks as LCP before optimizing.

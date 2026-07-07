# MEMORY.md — Pragma website

Decision log. Read at session start. Never contradict an entry without flagging it.

## 2026-07-07 — Phase 0 scaffold

- **Decided:** Next.js 16.2.10, React 19.2.4, Tailwind v4, next-intl 4.13.1, shadcn/ui (radix base), motion 12, next-themes, Resend. Node 20, npm.
  **Why:** Locked stack per CLAUDE.md; latest stable versions at scaffold time.
  **Rejected:** —

- **Decided:** `src/` directory layout with `@/*` import alias.
  **Why:** create-next-app default, keeps app code separated from config/content at root.
  **Rejected:** root-level `app/`.

- **Decided:** Locale routing via `src/proxy.ts` (Next 16 convention) with next-intl `createMiddleware`; `localePrefix: "always"` → `/hu`, `/sk`, `/en`; hu is default. Localized slugs defined centrally in `src/i18n/routing.ts` `pathnames` (e.g. `/szolgaltatasok` / `/sluzby` / `/services`).
  **Why:** Next 16 renamed middleware.ts → proxy.ts; central pathnames give typed, localized URLs.
  **Rejected:** `middleware.ts` (deprecated name in Next 16), per-page slug handling.

- **Decided:** Fonts: Space Grotesk (headings, `--font-display`) + Inter (body, `--font-sans`) via next/font/google with `latin` + `latin-ext` subsets (covers ő ű á é í ó ö ü / č ď ľ ň š ť ž ô ä ý).
  **Why:** Both are variable fonts with full HU/SK diacritic coverage; geometric + editorial feel matching brand.
  **Rejected:** Geist (default, weaker latin-ext story at the time), serif display fonts (only 400 weight available).
  **Note:** Diacritic rendering must be visually verified in browser (Phase 2).

- **Decided:** Brand tokens in `globals.css`: Deep Blue `#1A3A7A` (`--brand-deep`), Pragma Blue `#3B5BAD` (`--primary`/`--brand`), Gold `#E8A020` (`--gold`, used sparingly — CTAs/highlights only), warm off-white bg `#FAF8F3`, near-black text `#1A1B20`. Dark mode uses Deep Blue-tinted darks (`#0D1424` bg), primary flips to light blue `#93ACE8` with dark text for contrast.
  **Why:** CLAUDE.md brand rules; white text on Pragma Blue fails contrast in dark mode, light-blue buttons with dark text keep AA contrast.
  **Rejected:** pure #FFF background, pure black dark mode, gold as shadcn `--accent` (accent is a hover-surface token in shadcn; gold got its own `--gold` token instead).

- **Decided:** Dark mode via next-themes (`attribute="class"`, system default + manual toggle in header).
  **Why:** Standard shadcn-compatible approach, no flash, honors system preference.
  **Rejected:** hand-rolled theme script.

- **Decided:** SK message file carries `"_note": "SK: needs native review"` as a JSON key.
  **Why:** JSON does not support `<!-- -->` comments; a `_note` key is the closest equivalent. Flagged to Gergő.
  **Rejected:** JSONC/JSON5 (next-intl expects plain JSON).

- **Decided:** shadcn components installed: button, input, textarea, select, label, sheet (mobile nav). Only what's needed.

- **Fact:** Removed create-next-app boilerplate `src/app/layout.tsx` + `page.tsx` — replaced by `src/app/[locale]/layout.tsx` + `page.tsx` (required by next-intl structure).

## 2026-07-07 — Phase 1 content & pages

- **Decided (Checkpoint 1, approved by Gergő):** Hero headline uses the longer "kis- és középvállalkozásoknak"; NO response-time promise ("48 órán belül" rejected by Gergő). Tone: formal Ön/Vy, direct, warm, zero buzzwords.

- **Decided:** Copy structure: all strings in `messages/{hu,sk,en}.json`; project case studies under `projects.*` namespace; page structure (order, gradients) in `src/content/projects.ts`. HU drafted first, then EN, then SK (SK flagged for native review via `_note`).

- **Decided:** References use CSS-only `DeviceFrame` mockups (browser chrome + brand gradient + skeleton bars) — no fake screenshots. Real screenshots swap in later.

- **Decided:** No prices anywhere; Services page has an "About pricing" section that routes to contact. No invented metrics in reference results (qualitative outcomes only).

- **Decided:** Contact flow: client form (manual localized validation, honeypot field `website`) → `POST /api/contact` → Resend. Env vars: `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` (falls back to Resend onboarding sender). Without API key, the route logs to console and returns success (dev/build never breaks). Honeypot hits return fake success without sending.

- **Fact:** Internal route names are English (`/[locale]/services` etc.); localized public slugs (`/hu/szolgaltatasok`, `/sk/sluzby`) are rewritten by the next-intl proxy, and internal-name URLs 307-redirect to the localized slug.

- **Follow-up needed:** real contact email address + Resend domain verification before go-live; SK native review; real screenshots for references.

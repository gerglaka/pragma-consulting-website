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

## 2026-07-07 — Phase 2 design & polish

- **Decided:** Logo = "Pragma" wordmark (Space Grotesk) + minimal enso mark: open circle stroke in `currentColor`/primary with a small gold square inside (`src/components/layout/logo.tsx`). Inline SVG, scales with text, works in both themes.
  **Rejected:** labyrinth mark (too busy at 32px), image-file logo (inline SVG inherits theme colors for free).

- **Decided:** Scroll reveals via a single `Reveal` client component (`motion/react`, `whileInView`, `once: true`, 24px rise, 0.5s ease-out). `useReducedMotion` disables the initial offset entirely — reduced-motion users see content instantly.
  **Rejected:** per-section bespoke animations (inconsistent, more JS), animating on every scroll (distracting).

- **Decided:** Desktop nav + header CTA show at `lg:` (1024px), not `md:` (768px); mobile sheet menu covers everything below `lg:`.
  **Why:** HU nav labels + "Kérjen ajánlatot" CTA overflowed the 768px viewport by 31px — the HU-length risk from CLAUDE.md, caught by the checker. See ERRORS.md.

- **Decided:** Hover micro-interactions on cards: border-primary tint + shadow + 1px lift, `motion-safe:` gated. Gold reserved for final-CTA button and Pillar B accents only.

- **Fact:** `scripts/check-pages.mjs` added — spawns system Chromium, checks every page × locale × 375/768/1440px for horizontal overflow + console errors. Phase 2 exit state: 45/45 checks pass, `npm run build` clean.

## 2026-07-07 — Phase 3 SEO, i18n, performance

- **Decided:** All SEO URL building goes through `src/lib/seo.ts` — `SITE_URL` comes from `NEXT_PUBLIC_SITE_URL` (fallback `http://localhost:3199`); the build is domain-agnostic. `buildPageMetadata()` produces title/description + canonical + hreflang (`hu`/`sk`/`en`/`x-default` → default locale) + OpenGraph/Twitter for every page, always with localized slugs via next-intl `getPathname`.
  **Why:** one source of truth; hreflang with localized slugs is easy to get wrong by hand.

- **Decided:** Per-locale OG images via `src/app/[locale]/opengraph-image.tsx` (next/og, 1200×630): brand gradient, enso mark, localized tagline + hero headline. Space Grotesk TTFs are vendored in `src/assets/fonts/` because satori can't use woff2 and build-time network fetches are fragile. Diacritics verified visually (ő, é, á, í render correctly).

- **Decided:** JSON-LD: `ProfessionalService` in the locale layout (name, slogan, areaServed HU+SK, knowsLanguage) + per-page `WebPage`/`CollectionPage`/`AboutPage`/`ContactPage`. No `priceRange`, no email (no verified address yet), no invented data.

- **Decided:** `sitemap.ts` (all 15 URLs with xhtml:link alternates) and `robots.ts` (allow all, disallow `/api/`, sitemap ref).

- **Decided:** Above-the-fold content animates via CSS `animate-fade-up` (opacity 0.4→1 + 16px rise, reduced-motion safe), NOT the JS `Reveal` component. Motion-based `Reveal` stays for below-the-fold sections only.
  **Why:** Motion's SSR output holds content at `opacity: 0` until hydration → hero LCP measured at ~4.6s. Also: Chromium never emits LCP candidates for elements painted at opacity 0, so the animation must not start fully transparent. See ERRORS.md.

- **Decided:** Inter (body) is `preload: false`; Space Grotesk (display) stays preloaded.
  **Why:** the LCP hero text uses Space Grotesk; preloading all four font files (175 KB) made them compete for early bandwidth and LCP landed at 3.7–3.8s (Perf 87–90). Prioritizing the display font: hu 91 / sk 91 / en 96. Fact: next/font ships the full variable file for variable Google fonts — `weight:` arrays don't shrink payload.

- **Decided:** Skip-to-content link added (localized, `a11y.skipToContent`), `main` has `id="content"`. Generic "Learn more"-type link texts replaced with descriptive ones in all locales (Lighthouse SEO flagged EN).

- **Fact:** Phase 3 exit state: Lighthouse mobile homepage hu 91 / sk 91 / en 96 performance, 100/100/100 a11y/BP/SEO on all three; 45/45 page checks; build + tsc + eslint clean. Lab LCP (~3.3s) is dominated by a Lantern simulated-throttling artifact that pins LCP to webfont arrival even with `font-display: swap`; real users see fallback text at ~1s, and production CDN TTFB will further improve field scores.

## 2026-07-07 — Phase 4 handover

- **Decided:** README rewritten as the handover doc: run locally, edit copy (message JSONs + slugs + projects), swap DeviceFrame → next/image screenshots, env vars, Vercel deploy steps, verification commands. `.env.example` added.
- **Fact:** Final verification (Checkpoint 2): build 0 errors; 45/45 page×locale×viewport checks; Lighthouse hu 91/100/100/100, sk 91/100/100/100, en 96/100/100/100; contact API valid/invalid/honeypot paths verified; zero MISSING_MESSAGE; keyboard tab order correct (skip link first, visible focus styles, honeypot excluded).
- **Not done on purpose (awaiting Gergő):** deploy/push — never without explicit yes; real contact email + Resend domain; SK native review; real screenshots.

## 2026-07-07 — Session end: where we left off

- **State:** All 4 phases complete and committed (`main` @ `0ab0fcd`, working tree clean). Checkpoint 2 results presented; Gergő wants to preview the site before approving deploy.
- **Next session:** Gergő reviews locally (`npm run build && npm run start -- -p 3199`, or phone via LAN IP). Then he decides: Vercel preview deploy (no domain/env needed) or straight to launch prep. Do NOT deploy or push without his explicit yes.
- **Open items for go-live:** RESEND_API_KEY + CONTACT_TO_EMAIL/CONTACT_FROM_EMAIL (Resend domain verification), NEXT_PUBLIC_SITE_URL, SK native review, real reference screenshots.
- **Note:** the local server on port 3199 was started from this session and may not survive a reboot/VSCode close — just restart it.

## 2026-07-08 — Partners strip + Team section (placeholders)

- **Decided (Gergő):** build both sections with clearly-marked placeholders first — 3 partners, 3 team members — so the design can be previewed before real names/logos/photos exist. No invented names (CLAUDE.md: no fake team/client data).
- **Decided (Gergő):** Partners = logo strip on the homepage between "How we work" and the final CTA. Team = photo cards (photo, name, role) on the About page between the facts grid and the CTA.
- **Decided:** content lives in `src/content/partners.ts` (`{id, name, logo?, url?}`) and `src/content/team.ts` (`{id, photo?}`); all visible text (partner section title, team names/roles) in the message files under `home.partners.*` / `aboutPage.team.*`. Entries without `logo`/`photo` render placeholder marks (dashed wordmark box / neutral avatar). Swap instructions documented in README ("Partners and team (placeholders)").
- **Fact:** verification after the feature: build 0 errors, 45/45 page×locale×viewport checks, both sections render in all three locales.
